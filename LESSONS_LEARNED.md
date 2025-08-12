# Project-Wide Lessons & Best Practices

> **📚 PURPOSE**: This file preserves cross-feature knowledge, insights, and best practices that apply across the entire Al-Faruq Islamic Centre website project.

## 🚨 CRITICAL INCIDENT: Railway Misinformation
**Date**: 2025-08-12
**Error**: Recommended Railway as having a "free tier" without verification
**Reality**: Railway costs $5/month minimum (no free tier exists)
**Root Cause**: Relied on outdated training data instead of real-time search verification
**Impact**: Wasted user time creating false deployment setup instructions

### ✅ Prevention Measures Implemented:
- Created VERIFICATION_PROTOCOLS.md with mandatory search requirements
- Updated all project memory files with verification warnings  
- Established "WebSearch first" policy for all platform/service recommendations
- Added MCP servers for enhanced real-time information access

### 🎯 Key Lesson:
**NEVER trust training data for platform pricing, features, or availability. Always verify with WebSearch/WebFetch before recommending.**

## 🏗️ TECHNICAL ARCHITECTURE INSIGHTS

### What Works Well
- **Next.js 15 + React 19**: Excellent performance with the new compiler
- **Tailwind CSS**: Rapid styling with consistent design system
- **Framer Motion**: Smooth animations that enhance user experience
- **TypeScript**: Catches issues early, improves code quality

### Performance Optimizations
- **Image Optimization**: Next.js Image component with proper sizing attributes
- **Component Patterns**: Client components only when needed, server components by default
- **Bundle Optimization**: Turbopack for fast development builds

### Common Pitfalls to Avoid
- **Hydration Issues**: Always use `useEffect` for client-only operations
- **Animation Performance**: Prefer `transform` and `opacity` for smooth animations
- **Mobile Responsiveness**: Test on actual devices, not just browser dev tools

---

## 🎨 DESIGN SYSTEM LEARNINGS

### Color Palette Strategy
- **Islamic Aesthetics**: Emerald greens, sky blues work well for the community
- **Accessibility**: Ensure sufficient contrast ratios (WCAG 2.1 AA)
- **Consistency**: Use Tailwind's semantic color system

### Typography Hierarchy
- **Headings**: Clear hierarchy helps with both design and accessibility
- **Font Sizing**: Responsive text sizing using Tailwind's responsive prefixes
- **Line Heights**: Adequate spacing improves readability

### Component Design Patterns
- **Card Components**: Consistent shadow, border-radius, and padding
- **Buttons**: Clear states (hover, focus, active) for better UX
- **Form Elements**: Proper labeling and error states

---

## 🛠️ DEVELOPMENT WORKFLOW INSIGHTS

### Effective Approaches
- **Component Composition**: Small, reusable components are easier to maintain
- **Props Interface Design**: Clear TypeScript interfaces prevent confusion
- **Error Boundaries**: Graceful error handling improves user experience

### Code Organization
- **File Structure**: Keep related components together
- **Import Organization**: Group imports logically (React, Next.js, components, utilities)
- **Component Naming**: Descriptive names that indicate purpose

### Testing Strategies
- **Cross-Browser Testing**: Safari sometimes behaves differently
- **Mobile-First**: Start with mobile design, then scale up
- **Accessibility Testing**: Screen reader compatibility is crucial

---

## 🎯 USER EXPERIENCE INSIGHTS

### What Resonates with Users
- **Islamic Visual Elements**: Geometric patterns and appropriate imagery
- **Prayer Times**: Clear, prominent display is essential
- **Community Focus**: Programs and events should be easily discoverable
- **Donation Integration**: Simple, trusted donation flows

### Navigation Patterns
- **Mobile Menu**: Hamburger menu works well for mobile
- **Breadcrumbs**: Help users understand their location
- **Call-to-Actions**: Clear, action-oriented button text

### Content Strategy
- **Hierarchy**: Most important information should be prominent
- **Readability**: Break up large text blocks with headings and lists
- **Visual Balance**: Mix text, images, and white space effectively

---

## 🔧 DEVELOPMENT TOOLS & COMMANDS

### Essential Commands
```bash
# Development
npm run dev --turbopack

# Quality Checks
npm run lint
npm run build

# Type Checking
npx tsc --noEmit
```

### Useful Development Patterns
- **Component Development**: Start with props interface, then implement
- **Styling Approach**: Use Tailwind utilities, avoid custom CSS when possible
- **State Management**: Local state first, lift up only when necessary

---

## 📊 PERFORMANCE BENCHMARKS

### Loading Speed Targets
- **First Contentful Paint**: < 2 seconds
- **Largest Contentful Paint**: < 4 seconds
- **Cumulative Layout Shift**: < 0.1

### Optimization Techniques That Work
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Dynamic imports for heavy components
- **Caching Strategy**: Proper Next.js caching headers

---

## 🚀 DEPLOYMENT & HOSTING INSIGHTS

### Build Optimization
- **Static Generation**: Pre-render pages when possible
- **API Routes**: Keep them lightweight and focused
- **Error Handling**: Proper 404 and error pages

### SEO Considerations
- **Meta Tags**: Proper title, description, and Open Graph tags
- **Structured Data**: Schema.org markup for Islamic center information
- **Sitemap**: Auto-generated sitemap for better indexing

---

## 🔄 MAINTENANCE & UPDATES

### Regular Tasks
- **Dependency Updates**: Keep packages current for security
- **Content Updates**: Prayer times and program information
- **Performance Monitoring**: Regular checks on site speed

### Future-Proofing
- **Accessibility Standards**: Stay current with WCAG guidelines
- **Browser Support**: Test with latest browser versions
- **Mobile Compatibility**: New device sizes and capabilities

---

**📝 UPDATE INSTRUCTIONS**: Add insights here as they're discovered during development. Focus on knowledge that will help future development sessions and other features.