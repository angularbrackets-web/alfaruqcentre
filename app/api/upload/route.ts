import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cloudinary not configured', 
          message: 'Missing Cloudinary environment variables' 
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided', message: 'Please select a file to upload' },
        { status: 400 }
      );
    }

    // Validate file type - support both images and videos
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type',
          message: 'Only JPEG, PNG, WebP images and MP4, MOV, AVI videos are allowed'
        },
        { status: 400 }
      );
    }

    // Validate file size - different limits for images and videos
    const isVideo = allowedVideoTypes.includes(file.type);
    const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for videos, 5MB for images

    if (file.size > maxSize) {
      const maxSizeText = isVideo ? '100MB' : '5MB';
      return NextResponse.json(
        {
          success: false,
          error: 'File too large',
          message: `File size must be less than ${maxSizeText}`
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get folder and upload config based on file type
    const folder = isVideo ? 'alfaruq-events/videos' : 'alfaruq-events/images';
    const uploadConfig: {
      folder: string;
      resource_type: 'auto' | 'video' | 'image' | 'raw';
      transformation?: Record<string, unknown>[];
      video_metadata?: boolean;
      eager?: Record<string, unknown>[];
    } = {
      folder: folder,
      resource_type: 'auto'
    };

    // Add transformations for images only
    if (!isVideo) {
      uploadConfig.transformation = [
        { width: 800, height: 1000, crop: 'limit' }, // Optimize image size
        { quality: 'auto:good' }, // Automatic quality optimization
        { fetch_format: 'auto' } // Automatic format optimization
      ];
    } else {
      // Video-specific settings
      uploadConfig.video_metadata = true; // Extract video metadata
      uploadConfig.eager = [
        {
          width: 800, height: 600, crop: 'limit',
          resource_type: 'video',
          format: 'jpg' // Generate thumbnail
        }
      ];
    }

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadConfig,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const result = uploadResponse as {
      secure_url: string;
      public_id: string;
      eager?: Array<{ secure_url: string }>;
      resource_type: string;
    };

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      thumbnailUrl: result.eager?.[0]?.secure_url, // For video thumbnails
      resourceType: result.resource_type,
      message: `${isVideo ? 'Video' : 'Image'} uploaded successfully`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Upload failed', 
        message: 'An error occurred while uploading the file' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete image from Cloudinary (optional)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No public ID provided', message: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return NextResponse.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Delete failed', message: 'Could not delete image from Cloudinary' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Delete failed', message: 'An error occurred while deleting the image' },
      { status: 500 }
    );
  }
}