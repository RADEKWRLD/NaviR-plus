import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

export const BACKGROUND_MAX_BYTES = 100 * 1024 * 1024; // 100 MB
export const BACKGROUND_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type BackgroundContentType = (typeof BACKGROUND_ALLOWED_TYPES)[number];

let cachedClient: S3Client | null = null;

function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not configured');
  }

  cachedClient = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return cachedClient;
}

function getBucket(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error('R2_BUCKET_NAME not configured');
  return bucket;
}

function getPublicUrlPrefix(): string {
  const prefix = process.env.R2_PUBLIC_URL;
  if (!prefix) throw new Error('R2_PUBLIC_URL not configured');
  return prefix.replace(/\/$/, '');
}

export async function uploadIcon(
  userId: string,
  buffer: Buffer,
  mime: string,
  ext: string,
): Promise<string> {
  const key = `icons/${userId}/${randomUUID()}.${ext}`;
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: mime,
    }),
  );
  return `${getPublicUrlPrefix()}/${key}`;
}

export async function deleteIconIfOurs(
  url: string | null | undefined,
): Promise<void> {
  if (!url) return;
  const prefix = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
  if (!prefix || !url.startsWith(prefix)) return;

  const key = url.slice(prefix.length).replace(/^\//, '');
  if (!key) return;

  try {
    await getR2Client().send(
      new DeleteObjectCommand({ Bucket: getBucket(), Key: key }),
    );
  } catch (err) {
    console.error('Failed to delete R2 object:', key, err);
  }
}

const CONTENT_TYPE_TO_EXT: Record<BackgroundContentType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface BackgroundPresignedPut {
  url: string;
  key: string;
  publicUrl: string;
  contentType: BackgroundContentType;
}

export async function createBackgroundPresignedPutUrl(
  userId: string,
  contentType: BackgroundContentType,
): Promise<BackgroundPresignedPut> {
  const ext = CONTENT_TYPE_TO_EXT[contentType];
  const key = `backgrounds/${userId}/${randomUUID()}.${ext}`;

  const url = await getSignedUrl(
    getR2Client(),
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 },
  );

  return {
    url,
    key,
    publicUrl: `${getPublicUrlPrefix()}/${key}`,
    contentType,
  };
}

export interface BackgroundVerifyResult {
  ok: boolean;
  reason?: 'missing' | 'too_large' | 'bad_type';
  size?: number;
  contentType?: string;
}

export async function verifyBackgroundObject(
  key: string,
): Promise<BackgroundVerifyResult> {
  try {
    const head = await getR2Client().send(
      new HeadObjectCommand({ Bucket: getBucket(), Key: key }),
    );
    const size = head.ContentLength ?? 0;
    const ct = head.ContentType ?? '';
    if (!(BACKGROUND_ALLOWED_TYPES as readonly string[]).includes(ct)) {
      return { ok: false, reason: 'bad_type', size, contentType: ct };
    }
    if (size > BACKGROUND_MAX_BYTES) {
      return { ok: false, reason: 'too_large', size, contentType: ct };
    }
    return { ok: true, size, contentType: ct };
  } catch (err) {
    console.error('HeadObject failed:', key, err);
    return { ok: false, reason: 'missing' };
  }
}

export function extractBackgroundKey(url: string | null | undefined): string | null {
  if (!url) return null;
  const prefix = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
  if (!prefix || !url.startsWith(prefix)) return null;
  const key = url.slice(prefix.length).replace(/^\//, '');
  return key.startsWith('backgrounds/') ? key : null;
}

export async function deleteBackgroundIfOurs(
  url: string | null | undefined,
): Promise<void> {
  if (!url) return;
  const prefix = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
  if (!prefix || !url.startsWith(prefix)) return;

  const key = url.slice(prefix.length).replace(/^\//, '');
  if (!key.startsWith('backgrounds/')) return;

  try {
    await getR2Client().send(
      new DeleteObjectCommand({ Bucket: getBucket(), Key: key }),
    );
  } catch (err) {
    console.error('Failed to delete R2 background:', key, err);
  }
}

export async function deleteBackgroundByKey(key: string): Promise<void> {
  try {
    await getR2Client().send(
      new DeleteObjectCommand({ Bucket: getBucket(), Key: key }),
    );
  } catch (err) {
    console.error('Failed to delete R2 background by key:', key, err);
  }
}
