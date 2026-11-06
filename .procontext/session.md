# Taekwondo App — Session State

**Date**: 2026-04-23  
**Current Sprint**: General improvements  
**Team**: Active development

---

## 🎯 Current Objectives

- [x] Connect theory (gup-9) to taekwondo-api via react-query
- [x] Connect all exam theory lessons (grid + ExamDetail + TheoryBlock)
- [ ] Improve README with screenshots and setup instructions
- [ ] Add comprehensive test coverage for core flows
- [ ] Document authentication strategy
- [ ] Expand Taekwondo domain knowledge base

---

## 📝 Active TODOs

### High Priority
- [ ] Migrate remaining theory blocks from consts to API
- [ ] Complete README.md (currently shows "SOON...")
- [ ] Add Playwright tests for Exams flow
- [ ] Add Playwright tests for Tules learning path
- [ ] Document backend/API strategy (if needed)

### Medium Priority
- [ ] Populate `knowledge/architecture/` with component architecture
- [ ] Document auth provider choice in ADR-002
- [ ] Create feature specs for upcoming releases
- [ ] Improve mobile UX (viewport optimizations in progress)

### Low Priority
- [ ] Expand Taekwondo terminology glossary
- [ ] Document external APIs in `knowledge/apis/`
- [ ] Create performance benchmarks

---

## 🚧 Blockers

None currently. Development is progressing smoothly.

---

## 💡 Session Notes

### Recent Work

**API connection (2026-11-06)**:
- Added `@tanstack/react-query` + `QueryClientProvider` in `App.tsx`
- HTTP client in `src/api/client.ts` (`credentials: 'include'`, `VITE_BASE_URL`)
- Theory API/services: `src/api/theory.ts`, `src/services/theory.ts`
- Theory grid, TheoryBlock and ExamDetail all use API lessons (`examId` 1:1)
- Hardcoded `theoryContent.ts` remains only for unused `TheoryStudy`

**Focus areas** (last 3 months):
- UI/UX improvements (auto-scroll, transitions, mobile viewport)
- Testing infrastructure (Playwright E2E setup)
- Video component optimization (8 recent modifications)
- Account management features
- Video source updated to local `test.mp4` in `public/videos/` for all tul players
- Video framing adjusted in player using `object-position` + zoom to keep aggressive framing without left black edge gaps
- Added bottom video timeline (YouTube-style) with draggable seek control and current/total time
- Added second local angle video (`test back.mp4`) and improved angle switching to preserve exact playback timeline between sources
- Added per-angle framing so `test back.mp4` is shifted further left than the main angle
- Replaced both angle videos with the two latest files from `Downloads` while keeping app filenames (`test.mp4` and `test back.mp4`)
- Shifted the primary angle further left for improved framing (`object-position` adjusted)

**Hotspots** (most active files):
- `src/App.tsx` — Main layout evolution
- `src/common/Video.tsx` — Educational video player
- `src/pages/Account.tsx, Exams.tsx, Tules.tsx` — Core features

### Technical Observations

**Stack strengths**:
- ✅ Modern stack (React 19, Vite 8, Tailwind 4)
- ✅ Type-safe (TypeScript strict + Zod validation)
- ✅ Fast tooling (Oxlint/Oxfmt in Rust)
- ✅ PWA-enabled (offline-capable)

**Areas to address**:
- 🟡 Test coverage unknown (expand Playwright tests)
- 🟡 Backend/API undefined (define strategy)
- 🟡 README needs content (current placeholder)

---

## 📅 Next Steps

**This week**:
1. Update README with proper documentation
2. Add Playwright tests for main user flows
3. Document architectural decisions in ADRs

**Next sprint**:
- Define and implement backend strategy
- Expand knowledge base with Taekwondo domain
- Performance optimization based on metrics

---

**Last Updated**: 2026-10-27  
**Status**: ✅ Active development, no blockers
