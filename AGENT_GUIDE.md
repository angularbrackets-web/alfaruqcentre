# Agent Operating Guide - Al-Faruq Islamic Centre Website

> **🎯 PURPOSE**: This guide helps any agent (current or future) work effectively on this project across multiple sessions.

## 🚀 QUICK START FOR NEW AGENTS

### Step 1: Essential Reading (5 minutes)
1. **CLAUDE.md** - Project overview and current status
2. **ACTIVE_DEVELOPMENT.md** - What's currently being worked on
3. **LESSONS_LEARNED.md** - Project insights and best practices

### Step 2: Understand Your Role
- Follow the **7-step methodology** for all user requests
- Track everything in the appropriate files
- Preserve context for future agents
- Maintain code quality standards

### Step 3: Check Current State
- Review git status: `git status`
- Check if development server works: `npm run dev --turbopack`
- Run linting to ensure code quality: `npm run lint`

---

## 📋 THE 7-STEP METHODOLOGY

### 1. Deep Analysis & Planning
- **Understand the request thoroughly**
- Consider technical constraints and opportunities
- Think about user experience implications
- Review existing codebase for patterns

### 2. MCP Server Integration Assessment
- **Available MCP Tools:**
  - `mcp__ide__getDiagnostics` - VS Code diagnostics
  - `mcp__ide__executeCode` - Python/Jupyter execution
- **Standard Tools:** File ops, bash, web fetch, etc.
- **Question to ask:** How can MCP servers optimize this work?

### 3. Plan Refinement
- Review MCP capabilities against initial plan
- Adjust approach based on available tools
- Consider automation opportunities
- Update plan with MCP integration points

### 4. Step-by-Step Breakdown
- Break complex tasks into simple, actionable steps
- Each step should be clearly measurable
- Consider dependencies between steps
- Estimate complexity and time for each step

### 5. Plan Approval
- Present clear, detailed plan to user
- Explain rationale for technical decisions
- Get explicit approval before implementation
- Ask clarifying questions if needed

### 6. Implementation
- **CRITICAL:** Only start after user approval
- Follow the approved plan step-by-step
- Document all changes in ACTIVE_DEVELOPMENT.md
- Test each step before moving to the next

### 7. Complex Task Management
- Break large tasks into smaller, manageable pieces
- Complete one piece fully before moving to next
- Document progress continuously
- Update tracking files in real-time

---

## 📝 TRACKING & DOCUMENTATION SYSTEM

### During Active Development

#### Update ACTIVE_DEVELOPMENT.md with:
- **Session start:** Date, focus, and goals
- **Every change:** File modified, what changed, why changed
- **Decisions made:** Technical choices and rationale
- **User feedback:** How it was received and implemented
- **Challenges:** Problems encountered and solutions found
- **Session end:** What's next, context for next agent

#### Key Tracking Points:
```markdown
### Session [X] - [Date]
**Focus**: [What you're working on]

#### Changes Made:
- Modified app/components/Component.tsx: Added new feature X
- Updated app/globals.css: Improved responsive design
- Created new component: FeatureY.tsx for functionality Z

#### Technical Decisions:
- Chose approach A over B because of performance implications
- Used Tailwind classes X, Y, Z for consistent styling
- Implemented pattern P based on existing codebase conventions

#### User Feedback Implemented:
- User requested color change - updated to use emerald-600
- User wanted mobile-first approach - restructured component layout

#### Next Session Needs:
- Complete testing of feature X
- Address responsive design on tablet sizes
- Integrate with prayer times API
```

### When Feature is Complete

1. **Archive Current Work:**
   - Copy ACTIVE_DEVELOPMENT.md content to `[FEATURE]_DEVELOPMENT_LOG.md`
   - Reset ACTIVE_DEVELOPMENT.md for next feature

2. **Extract Lessons:**
   - Add technical insights to LESSONS_LEARNED.md
   - Document any reusable patterns discovered
   - Note performance optimizations that worked

3. **Update Project Status:**
   - Mark feature as complete in CLAUDE.md
   - Update current status and next priorities

---

## 🛠️ TECHNICAL STANDARDS

### Code Quality Requirements
- **TypeScript:** All components must have proper types
- **Styling:** Use Tailwind CSS, avoid custom CSS when possible  
- **Components:** Follow existing patterns in codebase
- **Accessibility:** Ensure WCAG 2.1 AA compliance
- **Performance:** Optimize images, minimize bundle size

### Testing Checklist
- [ ] Code passes `npm run lint`
- [ ] Component works on mobile, tablet, desktop
- [ ] Accessibility tested with screen reader
- [ ] Performance impact assessed
- [ ] Cross-browser compatibility verified

### Development Commands
```bash
# Development server
npm run dev --turbopack

# Code quality
npm run lint
npm run build

# Type checking
npx tsc --noEmit
```

---

## 🔄 SESSION HANDOFF PROTOCOL

### When Starting a Session
1. Read CLAUDE.md for project context
2. Check ACTIVE_DEVELOPMENT.md for current work
3. Review recent changes in LESSONS_LEARNED.md
4. Understand where previous agent left off
5. Verify development environment works

### When Ending a Session
1. Document all work in ACTIVE_DEVELOPMENT.md
2. Update session handoff section with clear next steps
3. Note any blocking issues or decisions needed
4. Commit code if appropriate (with descriptive messages)
5. Leave clear context for next agent

### Emergency Context Preservation
If session ends unexpectedly:
- All critical information should already be in ACTIVE_DEVELOPMENT.md
- Check git status and commit if necessary
- Next agent can resume from documented state

---

## 🎯 SUCCESS METRICS

### Code Quality
- Passes all linting checks
- TypeScript compilation successful
- No console errors or warnings
- Proper error handling implemented

### User Experience
- Responsive design works on all devices
- Loading times remain fast
- Accessibility standards maintained
- Visual consistency with existing design

### Documentation
- All changes tracked in appropriate files
- Technical decisions documented with rationale
- Future maintenance considerations noted
- Context preserved for next development cycle

---

## 🚨 COMMON PITFALLS TO AVOID

### Technical Issues
- **Hydration mismatches:** Use `useEffect` for client-only code
- **Image optimization:** Always use Next.js Image component
- **Mobile responsiveness:** Test on real devices, not just browser tools
- **State management:** Keep it simple, lift state up only when necessary

### Process Issues
- **Skipping documentation:** Always update tracking files
- **Not getting approval:** Never implement without user confirmation
- **Rushing complex tasks:** Break them down into smaller steps
- **Ignoring existing patterns:** Follow established codebase conventions

### Communication Issues
- **Unclear planning:** Always provide detailed, step-by-step plans
- **Missing context:** Document decisions and rationale thoroughly
- **Poor handoffs:** Leave clear instructions for next agent

---

**✅ CHECKLIST FOR SUCCESS:**
- [ ] Follow the 7-step methodology religiously
- [ ] Document everything in real-time
- [ ] Preserve context for future sessions
- [ ] Maintain high code quality standards  
- [ ] Focus on user experience and accessibility
- [ ] Leave project in better state than you found it