const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function exportData() {
  try {
    console.log('📦 Exporting current SQLite data...')
    
    // Get all programs from SQLite
    const programs = await prisma.program.findMany({
      orderBy: { order: 'asc' }
    })
    
    console.log(`✅ Found ${programs.length} programs`)
    
    // Convert to JSON for backup
    const exportData = {
      programs: programs.map(program => ({
        id: program.id,
        title: program.title,
        description: program.description,
        imageUrl: program.imageUrl,
        linkUrl: program.linkUrl,
        linkText: program.linkText,
        status: program.status,
        order: program.order,
        createdAt: program.createdAt.toISOString(),
        updatedAt: program.updatedAt.toISOString()
      })),
      exportDate: new Date().toISOString(),
      totalRecords: programs.length
    }
    
    // Save to file
    const filename = `data-export-${new Date().toISOString().split('T')[0]}.json`
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2))
    
    console.log(`💾 Data exported to: ${filename}`)
    console.log('📋 Programs exported:')
    programs.forEach(p => console.log(`  - ${p.title} (${p.status})`))
    
  } catch (error) {
    console.error('❌ Export failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()