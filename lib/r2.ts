import { S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID || 'placeholder'}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'placeholder',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'placeholder',
  },
})

export async function getVideoUrl(videoKey: string): Promise<string> {
  if (process.env.R2_PUBLIC_URL) {
    return `${process.env.R2_PUBLIC_URL}/${videoKey}`
  }

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'placeholder',
    Key: videoKey,
  })

  return await getSignedUrl(r2Client, command, { expiresIn: 3600 })
}

export { r2Client }
