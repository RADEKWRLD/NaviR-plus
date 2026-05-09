import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

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
