const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Production setup: Create initial data if database is empty
async function setupProduction() {
  try {
    console.log('🚀 Checking production database setup...')
    
    // Check if any programs exist
    const count = await prisma.program.count()
    
    if (count === 0) {
      console.log('📋 Empty database detected, creating initial programs...')
      
      // Create the initial programs for production
      const initialPrograms = [
        {
          id: 'afis-summer-camp-2025',
          title: 'Summer Camp 2025',
          description: 'Al-Faruq Summer Camp – Registration Now Open! Get ready for a summer full of learning, fun, and unforgettable memories.',
          imageUrl: '/AFIS.SummerCamp.2025.jpeg',
          linkUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc6U1ur8QSSrfBBO-Ws7BxCBOCMh4RU_hwN7bvF9RfObB_xhg/viewform',
          linkText: 'Register',
          status: 'ACTIVE',
          order: 1
        },
        {
          id: 'islamic-school-amana-academy',
          title: 'Al-Faruq Islamic School & Amana Academy',
          description: 'Safeguard Your Child\'s Future with Al-Faruq Islamic School & Amana Academy. Alberta Education Accredited school for KG to Grade 9.',
          imageUrl: '/AlFaruqIslamicSchoolAndAmanaAcademy.April2025.1.jpeg',
          linkUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScBGnya-MWf-d39tWtyDQNgEP_2Ft_86aslmSndZAY2BfRqwg/viewform',
          linkText: 'Register',
          status: 'ACTIVE',
          order: 2
        },
        {
          id: 'weekend-quran-school',
          title: 'Weekend Quran School',
          description: 'Al-Faruq Weekend Quran School for ages 5 to 12 years. Saturday and Sunday, 11:00 AM - 02:00 PM.',
          imageUrl: '/AlFaruq.Weekend.Quran.School.March2025.jpeg',
          linkUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScV2xkunYsiua7s9srJdhPGaMFQDN4JN_nRWwK8nYGEnDd5kw/viewform',
          linkText: 'Register',
          status: 'ACTIVE',
          order: 3
        },
        {
          id: 'classical-arabic-program',
          title: 'Classical Arabic Program',
          description: 'Learn Classical Arabic with our comprehensive program designed to help students master the Arabic language.',
          imageUrl: '/AlFaruq.ClassicalArabicProgram.jpeg',
          status: 'ACTIVE',
          order: 4
        }
      ]
      
      for (const program of initialPrograms) {
        await prisma.program.create({ data: program })
        console.log(`✅ Created: ${program.title}`)
      }
      
      console.log('🎉 Production database setup complete!')
    } else {
      console.log(`📊 Database already contains ${count} programs`)
    }
    
  } catch (error) {
    console.error('❌ Production setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupProduction()