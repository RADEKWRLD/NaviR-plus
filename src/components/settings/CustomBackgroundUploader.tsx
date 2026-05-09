'use client';

import { useRef, useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { trpc } from '@/lib/trpc/client';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];
const MAX_BYTES = 100 * 1024 * 1024;

function isAllowedType(t: string): t is AllowedType {
  return (ALLOWED_TYPES as readonly string[]).includes(t);
}

function formatMb(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(1);
}

function uploadToR2(
  url: string,
  contentType: string,
  file: File,
  onProgress: (ratio: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    });
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new Error('Upload aborted'));
    xhr.send(file);
  });
}

export default function CustomBackgroundUploader() {
  const { settings, updateAppearance } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUploadUrlMutation = trpc.settings.getBackgroundUploadUrl.useMutation();
  const saveMutation = trpc.settings.save.useMutation();
  const cleanupMutation = trpc.settings.cleanupOrphanBackground.useMutation();

  const currentUrl = settings.appearance.customBackgroundUrl;

  function pickFile() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // 允许同名重传
    if (!file) return;

    setError(null);

    if (!isAllowedType(file.type)) {
      setError('Only JPEG / PNG / WebP are supported');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`File is ${formatMb(file.size)} MB, exceeds 100 MB limit`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    let uploadedKey: string | null = null;

    try {
      const presign = await getUploadUrlMutation.mutateAsync({
        contentType: file.type,
      });
      uploadedKey = presign.key;

      await uploadToR2(presign.url, presign.contentType, file, setProgress);

      // 直接同步到云端，await 可捕获失败 → 清理孤儿对象
      const newSettings = {
        ...settings,
        appearance: {
          ...settings.appearance,
          backgroundEffect: 'custom' as const,
          customBackgroundUrl: presign.publicUrl,
        },
      };

      try {
        await saveMutation.mutateAsync(newSettings);
      } catch (saveErr) {
        await cleanupMutation
          .mutateAsync({ key: presign.key })
          .catch((cleanupErr) =>
            console.error('orphan cleanup failed:', cleanupErr),
          );
        throw saveErr;
      }

      // 更新本地状态（会触发一次幂等的重复 save，可接受）
      updateAppearance({
        backgroundEffect: 'custom',
        customBackgroundUrl: presign.publicUrl,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
      // 上传到 R2 之后才发生的错误（save 失败已在上面单独处理）
      // 这里不需要再清理
      void uploadedKey;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }

  function clearBackground() {
    setError(null);
    updateAppearance({
      backgroundEffect: 'none',
      customBackgroundUrl: null,
    });
  }

  return (
    <div className="space-y-3 pl-2 border-l-2 border-(--border-default)">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {currentUrl && (
        <div className="relative w-full aspect-video overflow-hidden border-2 border-(--border-default) bg-(--bg-main)">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt="Custom background preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="w-full h-2 bg-(--bg-main) border-2 border-(--border-default) overflow-hidden">
            <div
              className="h-full bg-(--text-primary) transition-[width] duration-150"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p
            className="text-xs uppercase tracking-wide text-(--text-muted)"
            style={{ fontFamily: 'var(--font-oxanium)' }}
          >
            Uploading {Math.round(progress * 100)}%
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={pickFile}
          disabled={isUploading}
          className={`px-4 py-2 border-2 border-(--border-default) bg-(--bg-main) text-(--text-primary) font-bold uppercase tracking-wide text-sm transition-colors hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35] ${
            isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          style={{ fontFamily: 'var(--font-oxanium)' }}
        >
          {currentUrl ? 'Replace Image' : 'Upload Image'}
        </button>

        {currentUrl && !isUploading && (
          <button
            type="button"
            onClick={clearBackground}
            className="px-4 py-2 border-2 border-red-500 bg-(--bg-main) text-red-500 font-bold uppercase tracking-wide text-sm transition-colors hover:bg-red-500 hover:text-white cursor-pointer"
            style={{ fontFamily: 'var(--font-oxanium)' }}
          >
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-(--text-muted) leading-relaxed">
        JPEG / PNG / WebP, up to 100 MB and 8K resolution.
        <br />
        Large images (above 4K) may affect performance on low-end mobile devices.
      </p>
    </div>
  );
}
