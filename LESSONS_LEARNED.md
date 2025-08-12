# Lessons Learned - Al-Faruq Islamic Centre Project

## 🎯 PURPOSE
This file contains critical lessons learned to prevent repeating mistakes across different agents and sessions. **EVERY AGENT MUST READ THIS BEFORE STARTING WORK**.

## 🚨 CRITICAL LESSON #1: Framework Version Awareness

### The Problem
- **Date**: August 12, 2025
- **Issue**: Implemented Next.js 14 patterns in a Next.js 15.4.4 project
- **Impact**: Production deployment failed due to async params handling
- **Root Cause**: Did not check framework versions before coding

### Next.js 15 Breaking Changes (MANDATORY KNOWLEDGE)
```typescript
// ❌ WRONG (Next.js 14 pattern)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const slide = await prisma.heroSlide.findUnique({
    where: { id: params.id }
  });
}

// ✅ CORRECT (Next.js 15 pattern)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({
    where: { id }
  });
}

// ❌ WRONG (Client components)
export default function EditPage({ params }: { params: { id: string } }) {
  useEffect(() => {
    fetchData(params.id);
  }, [params.id]);
}

// ✅ CORRECT (Client components)
export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  useEffect(() => {
    fetchData(resolvedParams.id);
  }, [resolvedParams.id]);
}
```

### Prevention Protocol (MANDATORY FOR ALL AGENTS)
1. **ALWAYS** check `package.json` first for framework versions
2. **ALWAYS** look for existing working patterns in the codebase
3. **ALWAYS** run `npm run build` after implementing core functionality
4. **NEVER** assume framework patterns from training data

## 🚨 CRITICAL LESSON #2: Copy Working Patterns

### The Problem
- **Issue**: Tried to implement fallback solutions instead of using existing Programs CMS pattern
- **Impact**: Overcomplicated simple database migration issue
- **Root Cause**: Did not leverage existing working foundation

### Prevention Protocol
1. **FIRST** examine existing working code for similar functionality
2. **COPY** the working patterns exactly
3. **ADAPT** only after understanding why it works
4. **ASK** user before implementing fallback solutions

## 🛠️ MANDATORY PRE-WORK CHECKLIST

### Before Writing ANY Code:
- [ ] Read CLAUDE.md for project overview
- [ ] Read LESSONS_LEARNED.md (this file)
- [ ] Check `package.json` for framework versions
- [ ] Search codebase for similar existing patterns
- [ ] Verify current status in ACTIVE_DEVELOPMENT.md

### For Framework-Specific Code:
- [ ] Check if framework version has breaking changes
- [ ] WebSearch for recent migration guides if unsure
- [ ] Test build immediately after core implementation
- [ ] Document any new patterns discovered

### For Database/API Work:
- [ ] Check existing API routes for patterns
- [ ] Verify database schema in prisma/schema.prisma
- [ ] Test database connection before implementing
- [ ] Use existing error handling patterns

## 📚 FRAMEWORK-SPECIFIC KNOWLEDGE BASE

### Next.js 15.4.4 (Current Project Version)
- **Params**: Always Promise-based in API routes and pages
- **SearchParams**: Now Promise-based
- **Client Components**: Use `React.use()` to unwrap Promises
- **API Routes**: Must await params before accessing properties
- **Build Command**: `npm run build` includes Prisma generation

### React 19.1.1 (Current Project Version)
- **use() Hook**: Required for unwrapping Promises in client components
- **Async Components**: Server components can be async, client cannot

### Prisma 6.13.0 (Current Project Version)
- **Generation**: Auto-runs on build via `prisma generate`
- **Migration**: Use `prisma db push` for schema changes
- **Client**: Singleton pattern used in this project

## 🔄 CROSS-SESSION CONTINUITY

### For Next Agent/Session:
1. **START HERE**: Read CLAUDE.md → LESSONS_LEARNED.md → ACTIVE_DEVELOPMENT.md
2. **UNDERSTAND**: Current framework versions and breaking changes
3. **FOLLOW**: The working patterns already established
4. **DOCUMENT**: Any new lessons learned in this file

### When Things Go Wrong:
1. **ANALYZE ROOT CAUSE**: Don't assume, investigate
2. **CHECK VERSIONS**: Framework compatibility issues?
3. **LEVERAGE EXISTING**: What working patterns can solve this?
4. **DOCUMENT**: Add lesson to this file for future agents

## 📊 SUCCESS METRICS

### Indicators of Good Practice:
- ✅ Build passes on first try
- ✅ Code follows existing patterns
- ✅ No version compatibility issues
- ✅ Features work locally and in production

### Red Flags:
- ❌ Production deployment failures
- ❌ Type errors during build
- ❌ Implementing fallbacks without asking
- ❌ Not checking existing codebase first

## 🎯 GOLDEN RULES

1. **"Check First, Code Second"** - Always examine existing patterns
2. **"Version Matters"** - Framework versions determine API patterns
3. **"Build Early, Build Often"** - Test compilation immediately
4. **"Copy, Don't Assume"** - Use working patterns as templates
5. **"Document Everything"** - Future agents depend on your notes

---

**REMEMBER**: This file is a living document. Add new lessons immediately when discovered. Every mistake here should never happen again.