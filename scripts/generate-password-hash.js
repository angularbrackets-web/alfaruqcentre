const bcrypt = require('bcryptjs')

async function generateHash() {
  try {
    // Generate hash for password 'admin123'
    const password = 'admin123'
    const saltRounds = 12
    
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('🔑 New password hash for admin123:')
    console.log(hash)
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash)
    console.log('✅ Hash validation test:', isValid ? 'PASSED' : 'FAILED')
    
    // Show URL-encoded version
    const urlEncoded = encodeURIComponent(hash)
    console.log('🌐 URL-encoded version:')
    console.log(urlEncoded)
    
  } catch (error) {
    console.error('❌ Error generating hash:', error)
  }
}

generateHash()