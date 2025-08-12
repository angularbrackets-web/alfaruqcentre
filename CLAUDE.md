# Al-Faruq Islamic Centre Website Enhancement Project

## 🎯 PROJECT OVERVIEW
**Goal**: Transform the Al-Faruq Islamic Centre website into a modern, engaging, and highly functional community platform
**Timeline**: Multi-session development with incremental improvements
**Current Status**: PRODUCTION DEPLOYED - PostgreSQL migration complete, live at https://www.alfaruqcentre.com

## 🚨 CRITICAL PROTOCOLS
⚠️ **READ VERIFICATION_PROTOCOLS.md BEFORE ANY PLATFORM RECOMMENDATIONS**
- Never trust training data for pricing/availability
- Always WebSearch current information before recommending platforms
- Verify free tiers, pricing, and features in real-time
- Document verification dates for future agents

## 🔧 TECHNICAL FOUNDATION
- **Framework**: Next.js 15.4.4 with React 19.1.1
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 12.5.0
- **Icons**: Lucide React 0.475.0
- **Language**: TypeScript 5
- **Database**: Prisma 6.13.0 with PostgreSQL (Supabase)
- **Build Commands**: 
  - Dev: `npm run dev --turbopack`
  - Build: `npm run build`
  - Lint: `npm run lint`

### ⚠️ CRITICAL: Next.js 15 Breaking Changes
- **API Routes**: `params` is now Promise - use `const { id } = await params`
- **Page Components**: `params` must be unwrapped with `React.use()` in client components
- **SearchParams**: Now Promise-based, requires await
- **Always check existing working patterns before implementing new features**

## 📁 PROJECT STRUCTURE
```
app/
├── components/ (React components)
├── data/ (Prayer times data)
├── globals.css (Global styles)
├── layout.tsx (Root layout)
├── page.tsx (Homepage)
├── prayertimes/ (Prayer times page)
├── programs/ (Programs page)
├── weekendschool/ (Weekend school page)
└── nowhiring/ (Hiring page)
```

## ✅ CURRENT FEATURES (Working)
- Glassmorphic prayer times display
- Auto-playing hero carousel with navigation controls
- Program showcase gallery with dynamic image loading
- Responsive design foundation
- Donation integration via external links
- Islamic school and weekend school information
- Top banner with animated donation call-to-action

## 🚀 USER'S PRIORITY FEATURE LIST
> **PENDING**: Waiting for user to provide their prioritized list of features to implement first

## 🎯 IMPLEMENTATION QUEUE
**Status**: Ready to receive and implement user's feature priorities

## 📝 SESSION NOTES & PROGRESS LOG

### Session 1 (Current)
- **Date**: [Current session]
- **Actions Completed**:
  - Analyzed existing codebase and architecture
  - Created CLAUDE.md for project continuity
  - Documented current features and technical stack
- **Next Steps**: 
  - Receive user's priority feature list
  - Begin implementation based on user priorities
  - Configure project for multi-session development

## 🛠️ DEVELOPMENT GUIDELINES

### Code Standards
- Follow existing TypeScript patterns in codebase
- Use Tailwind CSS for all styling (avoid custom CSS where possible)
- Maintain responsive design principles
- Ensure accessibility compliance
- Follow Next.js 15 best practices

### Component Patterns
- Use "use client" directive for client-side components
- Implement proper error boundaries
- Use Next.js Image component for optimizations
- Follow existing naming conventions

### Testing & Quality
- Run `npm run lint` before committing changes
- Test on multiple screen sizes
- Verify functionality across browsers
- Check accessibility with screen readers

## 🎨 DESIGN PRINCIPLES
- Islamic-inspired color schemes and aesthetics
- Clean, modern interface design
- Accessible and inclusive user experience
- Mobile-first responsive approach
- Performance-optimized implementations

## 📋 TRACKING SYSTEM OVERVIEW

### 📁 File Structure
- **CLAUDE.md** (this file): Project overview, current status, high-level roadmap
- **ACTIVE_DEVELOPMENT.md**: Current feature development tracking (detailed logs)
- **LESSONS_LEARNED.md**: Cross-feature knowledge and best practices
- **[FEATURE]_DEVELOPMENT_LOG.md**: Archived logs for completed features

### 🔄 Workflow Process
1. **Feature Start**: Log in ACTIVE_DEVELOPMENT.md
2. **During Development**: Track all changes, decisions, and feedback in ACTIVE_DEVELOPMENT.md
3. **Feature Complete**: 
   - Archive to `[FEATURE]_DEVELOPMENT_LOG.md`
   - Extract lessons to LESSONS_LEARNED.md
   - Update CLAUDE.md status
   - Reset ACTIVE_DEVELOPMENT.md

### 📊 Current Tracking Status
- **Active Development**: Ready for new feature assignment
- **Completed Features**: None yet (project setup phase)
- **Lessons Learned**: Initial technical insights documented

---

**🔄 FOR NEXT AGENT/SESSION**: 
1. **Start Here**: Read CLAUDE.md for project overview
2. **CRITICAL**: Read LESSONS_LEARNED.md to avoid repeating mistakes
3. **Check Current Work**: Review ACTIVE_DEVELOPMENT.md for ongoing tasks  
4. **Follow Process**: Use the MANDATORY pre-work methodology
5. **Track Everything**: Document all changes and decisions in ACTIVE_DEVELOPMENT.md

### 🚨 MANDATORY PRE-WORK METHODOLOGY
**BEFORE WRITING ANY CODE:**
1. **Check Versions**: Read `package.json` for framework versions
2. **Study Patterns**: Examine existing working code for similar functionality  
3. **Verify Compatibility**: WebSearch for breaking changes if needed
4. **Copy Working Solutions**: Use existing patterns as templates
5. **Test Early**: Run `npm run build` after core implementation
6. **Document Lessons**: Add discoveries to LESSONS_LEARNED.md

### 🎯 AGENT METHODOLOGY STEPS
1. Think deeply and create initial plan
2. **EXECUTE PRE-WORK CHECKLIST** (see LESSONS_LEARNED.md)
3. Leverage MCP servers for optimal results  
4. Review MCP capabilities and refine plan
5. Break down to step-by-step bullets
5. Share plan and get user approval
6. Implement only after approval
7. Break complex tasks into simple steps