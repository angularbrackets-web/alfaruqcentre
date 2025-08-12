# Framework Version Awareness Guide

## 🎯 PURPOSE
Prevent version compatibility issues by maintaining current framework knowledge and checking patterns before implementation.

## 📦 CURRENT PROJECT VERSIONS (CHECK PACKAGE.JSON)

### Core Framework Stack
- **Next.js**: 15.4.4 (Major version with breaking changes)
- **React**: 19.1.1 (Latest with new hooks)
- **TypeScript**: 5.x (Current stable)
- **Prisma**: 6.13.0 (Latest ORM)
- **Tailwind CSS**: 3.4.1 (Stable)

### Key Dependencies
- **Framer Motion**: 12.5.0
- **Lucide React**: 0.475.0
- **Cloudinary**: 2.7.0
- **bcryptjs**: 3.0.2

## 🚨 KNOWN BREAKING CHANGES

### Next.js 15.x Breaking Changes
```typescript
// OLD (14.x) - WRONG
{ params }: { params: { id: string } }

// NEW (15.x) - CORRECT
{ params }: { params: Promise<{ id: string }> }
```

### React 19.x Changes
- `use()` hook for unwrapping Promises
- Enhanced server components
- Improved concurrent features

## 🔍 VERSION CHECK PROTOCOL

### Step 1: Always Check Current Versions
```bash
# Check all versions
cat package.json | grep -E '"(next|react|prisma|typescript)"'

# Or specific framework
grep '"next"' package.json
```

### Step 2: Identify Major Version Changes
- **Major version change** (14.x → 15.x): Likely breaking changes
- **Minor version change** (15.1 → 15.4): Usually safe
- **Patch version change** (15.4.1 → 15.4.4): Safe

### Step 3: Research Breaking Changes
For major versions, search:
- Official migration guides
- Release notes
- Community breaking change reports

## 📚 FRAMEWORK-SPECIFIC PATTERNS

### Next.js 15.x Patterns
```typescript
// API Routes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Use id here
}

// Client Pages
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // Use resolvedParams.id
}

// Server Pages (can be async)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Use id here
}
```

### React 19.x Patterns
```typescript
// Use hook for Promises
import { use } from 'react';

const MyComponent = ({ dataPromise }: { dataPromise: Promise<Data> }) => {
  const data = use(dataPromise);
  return <div>{data.content}</div>;
};
```

### Prisma 6.x Patterns
```typescript
// Current singleton pattern in this project
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Auto-generation on build
// No manual generation needed
```

## 🛠️ COMPATIBILITY TESTING

### Local Testing Checklist
- [ ] `npm run build` - Must pass without errors
- [ ] `npm run lint` - Must pass TypeScript checks
- [ ] `npm run dev` - Must start without warnings
- [ ] Test API endpoints in browser/Postman
- [ ] Test page navigation and params

### Production Testing
- [ ] Vercel deployment must succeed
- [ ] All routes must be accessible
- [ ] Database operations must work
- [ ] Error boundaries must handle failures

## 📈 FUTURE-PROOFING

### Version Update Strategy
1. **Monitor releases**: Keep track of framework updates
2. **Test incrementally**: Update patch versions regularly
3. **Plan major upgrades**: Schedule time for breaking changes
4. **Document patterns**: Update this guide with new patterns

### Warning Signs
- Build failures after updates
- TypeScript errors in previously working code
- Runtime errors with framework APIs
- Deprecation warnings in console

## 🔄 MAINTENANCE

### Update This Guide When:
- Framework versions change in package.json
- New breaking changes discovered
- New patterns implemented
- Migration completed

### Regular Checks:
- Monthly: Review for outdated information
- Before major features: Verify current patterns
- After deployments: Document any issues found

---

**REMEMBER**: When in doubt, check existing working code first, then verify with current documentation.