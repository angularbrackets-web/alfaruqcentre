require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to generate unique ID
function generateId() {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
}

// Helper function to upload file to Cloudinary
async function uploadToCloudinary(filePath, folder, isVideo = false) {
  try {
    console.log(`Uploading ${filePath} to Cloudinary...`);

    const uploadConfig = {
      folder: folder,
      resource_type: 'auto'
    };

    if (isVideo) {
      // Video-specific settings
      uploadConfig.video_metadata = true;
      uploadConfig.eager = [
        {
          width: 800, height: 600, crop: 'limit',
          resource_type: 'video',
          format: 'jpg' // Generate thumbnail
        }
      ];
    } else {
      // Image transformations
      uploadConfig.transformation = [
        { width: 800, height: 1000, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ];
    }

    const result = await cloudinary.uploader.upload(filePath, uploadConfig);
    console.log(`✓ Uploaded: ${result.secure_url}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      thumbnailUrl: result.eager?.[0]?.secure_url
    };
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return null;
  }
}

// Static events data to migrate
const staticEvents = [
  {
    title: 'Summer Camp 2025',
    posterFile: 'AFIS.SummerCamp.2025.jpeg',
    registrationLink: 'https://forms.gle/eaNc7Wi7L2LRiApL9',
    startDate: '2025-07-07',
    endDate: '2025-08-21',
    expiryDate: '2025-12-31',
    summary: [
      'Get ready for a summer full of learning, fun, and unforgettable memories! Al-Faruq Summer Camp is now accepting registrations.',
      'Our program includes engaging courses in Qur\'an, Arabic, Islamic Studies, Language Arts, and Math—alongside exciting activities like sports, games, and field trips.',
      'Spaces are limited, so don\'t wait!'
    ],
    tags: ['summer', 'camp', 'education', 'youth']
  },
  {
    title: 'School Trip to Half Moon Farm',
    videoFile: 'AFIS.FieldTrip.May10.2025.mp4',
    thumbnailFile: 'AFIS.FieldTrip.May10.2025.Thumbnail.png',
    registrationLink: null, // Past event, no registration
    startDate: '2025-05-10',
    endDate: '2025-05-10',
    expiryDate: '2025-06-30',
    summary: [
      'A Day of Learning and Reflection',
      'Our students enjoyed a beautiful and enriching trip to Half Moon Farm, where we explored the wonders of nature and deepened our understanding of the world through the lens of our faith.',
      'From the gentle animals to the vibrant plants and peaceful surroundings, every part of the farm reminded us of Allah\'s magnificent creations. We took time to reflect on how everything in nature big or small points to His wisdom, mercy, and power.',
      'May these moments plant seeds of love, curiosity, and appreciation for the world Allah has given us.'
    ],
    tags: ['field-trip', 'nature', 'learning', 'reflection']
  }
];

async function migrateEvents() {
  console.log('🚀 Starting events migration...');

  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary environment variables not configured');
    }

    const publicDir = path.join(__dirname, '..', 'public');
    let order = 1;

    for (const eventData of staticEvents) {
      console.log(`\n📝 Migrating: ${eventData.title}`);

      let posterUrl = null;
      let videoUrl = null;
      let thumbnailUrl = null;

      // Upload poster if exists
      if (eventData.posterFile) {
        const posterPath = path.join(publicDir, eventData.posterFile);
        if (fs.existsSync(posterPath)) {
          const result = await uploadToCloudinary(posterPath, 'alfaruq-events/images');
          if (result) posterUrl = result.url;
        }
      }

      // Upload video if exists
      if (eventData.videoFile) {
        const videoPath = path.join(publicDir, eventData.videoFile);
        if (fs.existsSync(videoPath)) {
          const result = await uploadToCloudinary(videoPath, 'alfaruq-events/videos', true);
          if (result) {
            videoUrl = result.url;
            // Use Cloudinary auto-generated thumbnail if available
            thumbnailUrl = result.thumbnailUrl;
          }
        }
      }

      // Upload custom thumbnail if exists and no auto-generated one
      if (eventData.thumbnailFile && !thumbnailUrl) {
        const thumbnailPath = path.join(publicDir, eventData.thumbnailFile);
        if (fs.existsSync(thumbnailPath)) {
          const result = await uploadToCloudinary(thumbnailPath, 'alfaruq-events/images');
          if (result) thumbnailUrl = result.url;
        }
      }

      // Create event in database
      const newEvent = await prisma.event.create({
        data: {
          id: generateId(),
          title: eventData.title,
          description: null,
          poster: posterUrl,
          video: videoUrl,
          thumbnail: thumbnailUrl,
          registrationLink: eventData.registrationLink,
          startDate: new Date(eventData.startDate + 'T00:00:00.000Z'),
          endDate: new Date(eventData.endDate + 'T23:59:59.999Z'),
          expiryDate: new Date(eventData.expiryDate + 'T23:59:59.999Z'),
          summary: eventData.summary,
          tags: eventData.tags,
          status: 'ACTIVE',
          order: order++
        }
      });

      console.log(`✅ Created event: ${newEvent.title} (ID: ${newEvent.id})`);
    }

    console.log('\n🎉 Events migration completed successfully!');
    console.log('\n📊 Summary:');

    const totalEvents = await prisma.event.count();
    console.log(`- Total events in database: ${totalEvents}`);

    const eventsWithMedia = await prisma.event.count({
      where: {
        OR: [
          { poster: { not: null } },
          { video: { not: null } },
          { thumbnail: { not: null } }
        ]
      }
    });
    console.log(`- Events with media: ${eventsWithMedia}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateEvents();