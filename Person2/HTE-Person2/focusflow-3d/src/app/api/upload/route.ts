/**
 * POST /api/upload — PDF 上傳
 * 優先：Vercel Blob（有 BLOB_READ_WRITE_TOKEN）→ S3（有 bucket）→ 本機回傳 base64
 */
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }
    const file = formData.get('file') as File | null;
    if (!file || typeof file.type !== 'string' || file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Please upload a PDF file (multipart/form-data, field: file)' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1) Vercel Blob（符合新需求 0-2h：local or Vercel Blob）
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${Date.now()}-${file.name.replace(/\s/g, '_')}`, file, {
        access: 'public',
        addRandomSuffix: true,
      });
      return NextResponse.json({
        ok: true,
        url: blob.url,
        size: buffer.length,
        message: 'Uploaded to Vercel Blob. Use this URL or POST /api/ingest with pdfBase64 for extraction.',
      });
    }

    // 2) S3（選用）
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
    if (bucket) {
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
      const key = `uploads/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const client = new S3Client({ region: process.env.AWS_REGION ?? 'us-east-1' });
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: 'application/pdf',
        })
      );
      return NextResponse.json({
        ok: true,
        s3_key: key,
        size: buffer.length,
        message: 'Uploaded to S3. Call /api/ingest with pdfBase64 or multipart for extraction.',
      });
    }

    // 3) 本機：回傳 base64
    const base64 = buffer.toString('base64');
    return NextResponse.json({
      ok: true,
      size: buffer.length,
      base64,
      message: 'PDF received. Use POST /api/ingest with body { "pdfBase64": "..." } to extract concepts.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
