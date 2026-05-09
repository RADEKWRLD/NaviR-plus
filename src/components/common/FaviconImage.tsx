'use client';

import { useState, useCallback } from 'react';
import { getFaviconeUrl, getFallbackFaviconUrl } from '@/lib/favicon';

interface FaviconImageProps {
  url: string;
  customIconUrl?: string;
  className?: string;
  size?: number;
}

type Stage = 'custom' | 'favicone' | 'fallback' | 'failed';

export default function FaviconImage({
  url,
  customIconUrl,
  className,
  size = 64,
}: FaviconImageProps) {
  const computeInitial = (custom: string | undefined): Stage =>
    custom ? 'custom' : 'favicone';

  const [stage, setStage] = useState<Stage>(computeInitial(customIconUrl));
  const [resetKey, setResetKey] = useState(`${customIconUrl ?? ''}|${url}`);

  // 当 customIconUrl 或 url 变化时，重置状态机（React 官方推荐的 key-reset 模式）
  const currentKey = `${customIconUrl ?? ''}|${url}`;
  if (resetKey !== currentKey) {
    setResetKey(currentKey);
    setStage(computeInitial(customIconUrl));
  }

  const handleError = useCallback(() => {
    setStage((prev) => {
      if (prev === 'custom') return 'favicone';
      if (prev === 'favicone') return 'fallback';
      return 'failed';
    });
  }, []);

  if (stage === 'failed') return null;

  let src = '';
  if (stage === 'custom' && customIconUrl) src = customIconUrl;
  else if (stage === 'favicone') src = getFaviconeUrl(url, size);
  else if (stage === 'fallback') src = getFallbackFaviconUrl(url);

  if (!src) return null;

  return <img src={src} alt="" className={className} onError={handleError} />;
}
