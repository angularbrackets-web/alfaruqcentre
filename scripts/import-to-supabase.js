const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function importData() {
  try {
    console.log('🚀 Starting data import to Supabase...')
    
    // Read exported data
    const exportData = JSON.parse(fs.readFileSync('data-export-2025-08-12.json', 'utf8'))
    console.log(`📦 Found ${exportData.totalRecords} programs to import`)
    
    // Clear existing data (in case of re-import)
    await prisma.program.deleteMany({})
    console.log('🧹 Cleared existing data')
    
    // Import programs
    for (const program of exportData.programs) {
      const imported = await prisma.program.create({
        data: {
          id: program.id,
          title: program.title,
          description: program.description,
          imageUrl: program.imageUrl,
          linkUrl: program.linkUrl,
          linkText: program.linkText,
          status: program.status,
          order: program.order,
          createdAt: new Date(program.createdAt),
          updatedAt: new Date(program.updatedAt)
        }
      })
      console.log(`✅ Imported: ${imported.title}`)
    }
    
    // Verify import
    const count = await prisma.program.count()
    console.log(`🎉 Import complete! ${count} programs now in Supabase`)
    
    // Show imported data
    const programs = await prisma.program.findMany({
      orderBy: { order: 'asc' }
    })
    
    console.log('\n📋 Imported Programs:')
    programs.forEach(p => {
      console.log(`  ${p.order}. ${p.title} (${p.status})`)
    })
    
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

importData()