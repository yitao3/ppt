import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// 创建 S3 客户端
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 生成唯一的文件键
    const fileKey = `uploads/${Date.now()}-${file.name}`;

    // 创建上传命令
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: file.type,
    });

    // 生成预签名 URL
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // 返回预签名 URL 和文件信息
    return NextResponse.json({
      uploadUrl: signedUrl,
      fileKey,
      publicUrl: `${process.env.R2_PUBLIC_URL}/${fileKey}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
} 