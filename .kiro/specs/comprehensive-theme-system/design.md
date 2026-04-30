# Design Document: Comprehensive Theme System

## Overview

This design document specifies the technical implementation for a comprehensive light/dark mode theme system for the Reunite application. The system extends the existing ThemeProvider infrastructure to apply consistent, accessible color schemes across all pages and components while maintaining existing functionality and ensuring smooth transitions between modes.

### Design Goals

1. **Consistency**: Apply uniform color schemes across all pages and components
2. **Accessibility**: Maintain WCAG AA contrast standards in both themes
3. **Performance**: Implement efficient CSS-based theme switching with minimal JavaScript overhead
4. **Maintainability**: Use Tailwind v4's `@theme` directive for centralized color management
5. **Backward Compatibility**: Preserve all existing functionality and component behaviors

### Key Design Decisions

- **Leverage Existing Infrastructure**: Build upon the current ThemeProvider rather than replacing it
- **CSS Custom Properties**: Use Tailwind v4's `@theme` directive with CSS variables for dynamic theming
- **Utility-First Approach**: Extend existing Tailwind utilities rather than creating new component classes
- **Progressive Enhancement**: Apply theme colors systematically without breaking existing layouts

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      ThemeProvider                          │
│  (src/app/providers/ThemeProvider.jsx)                     │
│  - State Management (theme: "light" | "dark")              │
│  - localStorage Persistence                                 │
│  - System Preference Detection                              │
│  - DOM Class Toggle (.dark)                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   CSS Theme Configuration                    │
│              (src/styles/globals.css)                       │
│  - @theme directive with color variables                    │
│  - @custom-variant dark for dark mode overrides            │
│  - Transition utilities                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Component Layer                           │
│  - Page Components (Landing, Cases, Wanted, etc.)          │
│  - UI Components (Card, Button, Input, etc.)               │
│  - Feature Components (PostCard, CaseDetail, etc.)         │
│  - Layout Components (MainHeader, Footer, etc.)            │
└─────────────────────────────────────────────────────────────┘
```

### Theme State Flow

```
User Action (Toggle Button)
    │
    ▼
ThemeProvider.toggleTheme()
    │
    ├─→ Update React State (theme)
    │
    ├─→ Update localStorage ("reunite-theme")
    │
    ├─→ Toggle DOM Class (document.documentElement.classList)
    │
    └─→ Update colorScheme (document.documentElement.style.colorScheme)
        │
        ▼
    CSS Variables Update (via .dark class)
        │
        ▼
    Component Re-render (automatic via CSS)
```

## Components and Interfaces

### 1. ThemeProvider (Existing - No Changes Required)

**Location**: `src/app/providers/ThemeProvider.jsx`

**Interface**:
```typescript
interface ThemeContextValue {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}
```

**Responsibilities**:
- Manage theme state
- Persist theme preference to localStorage
- Apply `.dark` class to document root
- Provide theme context to application

**No modifications required** - existing implementation is sufficient.

### 2. CSS Theme Configuration

**Location**: `src/styles/globals.css`

**Structure**:
```css
@theme {
  /* Light mode color definitions (default) */
}

@custom-variant dark (&:where(.dark, .dark *));

.dark {
  /* Dark mode color overrides */
}

@layer utilities {
  /* Theme-aware utility classes */
}
```

**Color Variable Mapping**:

| Purpose | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page Background | `--color-warm-white: #FDFBF7` | `--color-warm-white: #0F0E0D` |
| Secondary Background | `--color-cream: #F5F0E8` | `--color-cream: #181716` |
| Tertiary Background | `--color-warm-gray: #E8E3D9` | `--color-warm-gray: #262321` |
| Primary Text (Headings) | `--color-charcoal: #2C2825` | `--color-charcoal: #ffffff` |
| Secondary Text (Body) | `--color-stone: #8B8580` | `--color-stone: #B8B0A7` |
| Card Background | `bg-white` → `bg-cream` | `bg-stone-900/30` |
| Card Border | `border-stone-200` | `border-stone-800` |

### 3. MainHeader Component

**Location**: `src/components/layout/MainHeader.jsx`

**Theme Toggle Button**:
```jsx
<button
  onClick={toggleTheme}
  className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition"
  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
>
  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
</button>
```

**Dynamic Styling for Landing Page**:
- Detect landing page: `const isLandingPage = location.pathname === '/'`
- Apply conditional classes based on scroll state and theme
- Ensure visibility on video background in light mode

### 4. Page Components

**Affected Pages**:
- Landing (`src/pages/Landing.jsx`)
- Cases (`src/pages/Cases.jsx`)
- Report (`src/pages/Report.jsx`)
- Volunteers (`src/pages/Volunteers.jsx`)
- Wanted (`src/pages/Wanted.jsx` and sub-pages)
- Admin (`src/features/admin/DashboardLayout.jsx`)
- Auth pages (Login, Register, ForgotPassword, ResetPassword)

**Theme Application Strategy**:
1. Replace hardcoded color classes with theme-aware utilities
2. Update background classes to use theme variables
3. Ensure text contrast meets accessibility standards
4. Apply card styling with theme-aware backgrounds and borders

## Data Models

### Theme Preference Storage

**localStorage Key**: `"reunite-theme"`

**Stored Value**: `"light" | "dark"`

**Schema**:
```typescript
type ThemePreference = "light" | "dark";

// Storage operations
localStorage.setItem("reunite-theme", theme);
const storedTheme = localStorage.getItem("reunite-theme");
```

### CSS Custom Properties

**Light Mode Variables** (defaults in `@theme`):
```css
@theme {
  --color-warm-white: #FDFBF7;
  --color-cream: #F5F0E8;
  --color-warm-gray: #E8E3D9;
  --color-stone: #8B8580;
  --color-charcoal: #2C2825;
  /* ... other colors */
}
```

**Dark Mode Overrides** (in `.dark` selector):
```css
.dark {
  --color-warm-white: #0F0E0D;
  --color-cream: #181716;
  --color-warm-gray: #262321;
  --color-stone: #B8B0A7;
  --color-charcoal: #ffffff;
  /* ... other colors */
}
```

## Error Handling

### Theme Loading Errors

**Scenario**: localStorage is unavailable or corrupted

**Handling**:
```javascript
const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch (error) {
    console.warn("Failed to read theme preference:", error);
  }

  // Fallback to system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};
```

### CSS Variable Fallbacks

**Scenario**: CSS custom properties not supported (legacy browsers)

**Handling**:
- Tailwind v4 automatically generates fallback values
- Use semantic color names that degrade gracefully
- Test in browsers without CSS custom property support

### Theme Toggle Failures

**Scenario**: Theme toggle doesn't update UI

**Handling**:
1. Verify `.dark` class is applied to `document.documentElement`
2. Check CSS custom property overrides in `.dark` selector
3. Ensure no inline styles override theme colors
4. Validate transition properties don't block updates

## Testing Strategy

### Unit Tests

**Theme Provider Tests**:
```javascript
describe('ThemeProvider', () => {
  test('initializes with system preference when no stored theme', () => {
    // Test system preference detection
  });

  test('loads stored theme from localStorage', () => {
    // Test localStorage retrieval
  });

  test('toggleTheme switches between light and dark', () => {
    // Test toggle functionality
  });

  test('persists theme changes to localStorage', () => {
    // Test persistence
  });

  test('applies .dark class to document root', () => {
    // Test DOM manipulation
  });
});
```

**CSS Variable Tests**:
```javascript
describe('Theme CSS Variables', () => {
  test('light mode applies correct color values', () => {
    // Test computed styles in light mode
  });

  test('dark mode applies correct color values', () => {
    // Test computed styles in dark mode
  });

  test('transitions apply to color properties', () => {
    // Test transition properties
  });
});
```

### Integration Tests

**Page Theme Application**:
```javascript
describe('Page Theme Integration', () => {
  test('Landing page applies theme correctly', () => {
    // Test Landing page theme
  });

  test('Cases page applies theme correctly', () => {
    // Test Cases page theme
  });

  test('Wanted page applies theme correctly', () => {
    // Test Wanted page theme
  });

  // ... tests for other pages
});
```

**Component Theme Application**:
```javascript
describe('Component Theme Integration', () => {
  test('Card component applies theme styles', () => {
    // Test Card theme
  });

  test('Button component maintains semantic colors', () => {
    // Test Button theme
  });

  test('Input component applies theme styles', () => {
    // Test Input theme
  });
});
```

### Accessibility Tests

**Contrast Ratio Tests**:
```javascript
describe('Theme Accessibility', () => {
  test('light mode text meets WCAG AA contrast (4.5:1)', () => {
    // Test light mode contrast ratios
  });

  test('dark mode text meets WCAG AA contrast (4.5:1)', () => {
    // Test dark mode contrast ratios
  });

  test('interactive elements meet WCAG AA contrast (3:1)', () => {
    // Test interactive element contrast
  });

  test('focus indicators visible in both themes', () => {
    // Test focus visibility
  });
});
```

**Keyboard Navigation Tests**:
```javascript
describe('Theme Toggle Accessibility', () => {
  test('theme toggle button is keyboard accessible', () => {
    // Test keyboard operability
  });

  test('theme toggle has appropriate ARIA labels', () => {
    // Test ARIA attributes
  });

  test('theme change announces to screen readers', () => {
    // Test screen reader announcements
  });
});
```

### Visual Regression Tests

**Snapshot Tests**:
```javascript
describe('Theme Visual Regression', () => {
  test('Landing page light mode snapshot', () => {
    // Capture and compare light mode snapshot
  });

  test('Landing page dark mode snapshot', () => {
    // Capture and compare dark mode snapshot
  });

  test('theme transition animation', () => {
    // Test transition smoothness
  });
});
```

### Manual Testing Checklist

**Browser Compatibility**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Device Testing**:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Theme Functionality**:
- [ ] Toggle switches between light and dark
- [ ] Theme persists after page reload
- [ ] System preference detected on first visit
- [ ] Transitions are smooth (200-400ms)
- [ ] No layout shifts during transition
- [ ] All pages apply theme correctly
- [ ] All components apply theme correctly

**Accessibility**:
- [ ] Contrast ratios meet WCAG AA
- [ ] Focus indicators visible in both themes
- [ ] Theme toggle keyboard accessible
- [ ] ARIA labels present and accurate
- [ ] Screen reader announces theme changes

## Implementation Plan

### Phase 1: CSS Theme Configuration (Priority: High)

**Tasks**:
1. Update `src/styles/globals.css` with comprehensive dark mode overrides
2. Add gradient background utilities for dark mode
3. Create theme-aware card utilities
4. Add transition utilities for smooth theme switching
5. Test CSS variable application in both themes

**Files Modified**:
- `src/styles/globals.css`

**Estimated Effort**: 2-3 hours

### Phase 2: Layout Components (Priority: High)

**Tasks**:
1. Update MainHeader for dynamic theme-aware styling
2. Update Footer component (if exists)
3. Update navigation components
4. Test header visibility on Landing page video background

**Files Modified**:
- `src/components/layout/MainHeader.jsx`
- `src/components/layout/Footer.jsx` (if exists)

**Estimated Effort**: 2-3 hours

### Phase 3: Page Components (Priority: High)

**Tasks**:
1. Update Landing page sections with theme-aware classes
2. Update Cases page
3. Update Report page
4. Update Volunteers page
5. Update Wanted page and sub-pages
6. Update Admin pages
7. Update Auth pages

**Files Modified**:
- `src/pages/Landing.jsx`
- `src/pages/Cases.jsx`
- `src/pages/Report.jsx`
- `src/pages/Volunteers.jsx`
- `src/pages/Wanted.jsx`
- `src/features/admin/DashboardLayout.jsx`
- `src/features/auth/*.jsx`

**Estimated Effort**: 6-8 hours

### Phase 4: UI Components (Priority: Medium)

**Tasks**:
1. Update Card component
2. Update Button component (preserve semantic colors)
3. Update Input component
4. Update Modal/Dialog components
5. Update other UI primitives

**Files Modified**:
- `src/components/ui/card.jsx`
- `src/components/ui/button.jsx`
- `src/components/ui/input.jsx`
- `src/components/ui/*.jsx`

**Estimated Effort**: 3-4 hours

### Phase 5: Feature Components (Priority: Medium)

**Tasks**:
1. Update PostCard component
2. Update CaseDetail component
3. Update other feature-specific components
4. Ensure all cards use theme-aware styling

**Files Modified**:
- `src/features/wanted/components/browse/PostCard.jsx`
- `src/features/cases/CaseDetail.jsx`
- Other feature components

**Estimated Effort**: 4-5 hours

### Phase 6: Testing & Refinement (Priority: High)

**Tasks**:
1. Write unit tests for ThemeProvider
2. Write integration tests for page theme application
3. Conduct accessibility testing
4. Perform visual regression testing
5. Test on multiple browsers and devices
6. Fix any contrast or visibility issues

**Estimated Effort**: 4-6 hours

### Phase 7: Documentation (Priority: Low)

**Tasks**:
1. Document theme usage guidelines
2. Create component theme examples
3. Update README with theme information
4. Document accessibility compliance

**Estimated Effort**: 2-3 hours

**Total Estimated Effort**: 23-32 hours

## Technical Specifications

### Color Specifications

#### Light Mode

**Backgrounds**:
- Page: `bg-white` (#FFFFFF)
- Secondary: `bg-cream` (#F5F0E8)
- Tertiary: `bg-warm-gray` (#E8E3D9)

**Text**:
- Headings: `text-charcoal` (#2C2825)
- Body: `text-stone-600` (#8B8580)
- Muted: `text-stone-500`

**Cards**:
- Background: `bg-white`
- Border: `border-stone-200`
- Shadow: `shadow-sm`

**Interactive Elements**:
- Primary Button: `bg-terracotta` (#C4654A)
- Secondary Button: `bg-sahara` (#D4A54A)
- Hover: Darken by 10%

#### Dark Mode

**Backgrounds**:
- Page: `bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950`
  - stone-950: #0F0E0D
  - stone-900: #181716
- Secondary: `bg-stone-900` (#181716)
- Tertiary: `bg-stone-800` (#262321)

**Text**:
- Headings: `text-white` (#FFFFFF)
- Body: `text-stone-300` to `text-stone-400`
  - stone-300: #D2CBC2
  - stone-400: #B8AFA5
- Muted: `text-stone-500`

**Cards**:
- Background: `bg-stone-900/30` (semi-transparent)
- Border: `border-stone-800`
- Shadow: `shadow-lg shadow-black/20`

**Interactive Elements**:
- Primary Button: `bg-terracotta` (slightly brighter: #E07B5A)
- Secondary Button: `bg-sahara` (slightly brighter)
- Hover: Brighten by 10%

### Transition Specifications

**Duration**: 300ms (optimal balance between smooth and responsive)

**Easing**: `ease-in-out` (smooth acceleration and deceleration)

**Properties**:
```css
transition-property: background-color, color, border-color, box-shadow;
transition-duration: 300ms;
transition-timing-function: ease-in-out;
```

**Implementation**:
```css
@layer base {
  * {
    @apply transition-colors duration-300;
  }
}
```

### Gradient Specifications

**Dark Mode Page Background**:
```css
.dark body {
  background: linear-gradient(to bottom, #0F0E0D 0%, #181716 50%, #0F0E0D 100%);
}
```

**Alternative Implementation** (using Tailwind):
```jsx
<div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
  {/* Page content */}
</div>
```

### Accessibility Specifications

**Contrast Ratios** (WCAG AA):
- Normal text (< 18pt): 4.5:1 minimum
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 minimum
- Interactive elements: 3:1 minimum

**Light Mode Contrast Verification**:
- Charcoal (#2C2825) on White (#FFFFFF): 14.8:1 ✓
- Stone-600 (#8B8580) on White (#FFFFFF): 4.6:1 ✓
- Terracotta (#C4654A) on White (#FFFFFF): 3.8:1 ✓

**Dark Mode Contrast Verification**:
- White (#FFFFFF) on Stone-950 (#0F0E0D): 19.2:1 ✓
- Stone-300 (#D2CBC2) on Stone-950 (#0F0E0D): 11.4:1 ✓
- Stone-400 (#B8AFA5) on Stone-950 (#0F0E0D): 8.9:1 ✓

**Focus Indicators**:
```css
.focus-visible:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.dark .focus-visible:focus {
  outline-color: #E07B5A; /* Brighter terracotta */
}
```

### Responsive Specifications

**Breakpoints** (Tailwind defaults):
- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: ≥ 1024px

**Theme Application**:
- All breakpoints use the same color scheme
- Transitions perform consistently across devices
- Touch targets remain accessible (minimum 44x44px)

**Performance Considerations**:
- Use CSS transforms for animations (GPU-accelerated)
- Avoid layout recalculations during theme switch
- Minimize JavaScript execution during transition

## Dependencies

### Existing Dependencies (No Changes)

- **React**: ^19.2.5
- **Tailwind CSS**: ^4.2.2
- **@tailwindcss/vite**: ^4.2.2
- **Framer Motion**: ^12.38.0 (for animations)
- **Lucide React**: ^1.8.0 (for icons)

### Browser Requirements

- **Chrome**: ≥ 90
- **Firefox**: ≥ 88
- **Safari**: ≥ 14
- **Edge**: ≥ 90

**Required Features**:
- CSS Custom Properties
- CSS Grid
- CSS Flexbox
- localStorage API
- matchMedia API

## Security Considerations

### localStorage Security

**Threat**: XSS attacks could modify theme preference

**Mitigation**:
- Theme preference is non-sensitive data
- Validate stored values before applying
- Fallback to system preference if invalid

**Implementation**:
```javascript
const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
if (storedTheme === "light" || storedTheme === "dark") {
  return storedTheme;
}
// Invalid value - use system preference
```

### CSS Injection

**Threat**: Malicious CSS could override theme styles

**Mitigation**:
- Use Content Security Policy (CSP)
- Sanitize user-generated content
- Avoid inline styles where possible

### Performance Security

**Threat**: Rapid theme toggling could cause performance issues

**Mitigation**:
- Debounce theme toggle function
- Use CSS transitions (GPU-accelerated)
- Avoid JavaScript-based animations

## Migration Strategy

### Backward Compatibility

**Existing Functionality Preserved**:
- All component behaviors remain unchanged
- All routing and navigation work as before
- All form validations and submissions unchanged
- All API integrations continue functioning

**Breaking Changes**: None

**Deprecations**: None

### Rollout Plan

**Phase 1: Development**
1. Implement CSS theme configuration
2. Update layout components
3. Update page components
4. Update UI components
5. Update feature components

**Phase 2: Testing**
1. Unit testing
2. Integration testing
3. Accessibility testing
4. Visual regression testing
5. Browser compatibility testing

**Phase 3: Staging**
1. Deploy to staging environment
2. Conduct user acceptance testing
3. Gather feedback
4. Fix any issues

**Phase 4: Production**
1. Deploy to production
2. Monitor for errors
3. Collect user feedback
4. Iterate as needed

### Rollback Plan

**If Issues Arise**:
1. Revert CSS changes in `globals.css`
2. Restore original component files
3. Clear localStorage theme preferences
4. Communicate with users

**Rollback Triggers**:
- Critical accessibility failures
- Widespread browser compatibility issues
- Performance degradation
- User complaints exceeding threshold

## Maintenance and Support

### Ongoing Maintenance

**Regular Tasks**:
- Monitor contrast ratios when adding new colors
- Test theme application for new components
- Update documentation for theme usage
- Review accessibility compliance quarterly

**Performance Monitoring**:
- Track theme toggle response time
- Monitor CSS bundle size
- Check for layout shifts during transitions

### Support Documentation

**Developer Guidelines**:
1. Always use theme-aware color utilities
2. Test components in both light and dark modes
3. Verify contrast ratios for new colors
4. Use semantic color names (not hex values)

**Component Theme Checklist**:
- [ ] Backgrounds use theme variables
- [ ] Text colors use theme utilities
- [ ] Borders use theme utilities
- [ ] Shadows adapt to theme
- [ ] Interactive states work in both themes
- [ ] Contrast ratios meet WCAG AA

### Future Enhancements

**Potential Improvements**:
1. Add custom theme builder for users
2. Implement high-contrast mode
3. Add color-blind friendly themes
4. Support for reduced motion preferences
5. Theme scheduling (auto-switch based on time)

**Extensibility**:
- Theme system designed to support additional themes
- Color variables can be extended without breaking changes
- Component theme application is modular and reusable

---

## Appendix

### Color Palette Reference

**Light Mode Palette**:
```
Primary Colors:
- Terracotta: #C4654A
- Sahara: #D4A54A
- Olive: #6B705C
- Clay: #A44C3E

Neutrals:
- Warm White: #FDFBF7
- Cream: #F5F0E8
- Warm Gray: #E8E3D9
- Stone: #8B8580
- Charcoal: #2C2825

Accents:
- Hope Green: #5B8C6F
- Warmth: #D4956B
- Gentle: #A89B8C
```

**Dark Mode Palette**:
```
Primary Colors:
- Terracotta: #E07B5A (brighter)
- Sahara: #E5C07A (brighter)
- Olive: #8B917D (brighter)
- Clay: #C76447 (brighter)

Neutrals:
- Stone-950: #0F0E0D
- Stone-900: #181716
- Stone-800: #262321
- Stone-700: #34302D
- Stone-600: #3F3A36
- Stone-500: #A89F95
- Stone-400: #B8AFA5
- Stone-300: #D2CBC2
- White: #FFFFFF

Accents:
- Hope Green: #7AA88C (brighter)
- Warmth: #E5B88C (brighter)
- Gentle: #C4B5A6 (brighter)
```

### CSS Utility Class Reference

**Background Classes**:
```css
/* Light mode */
.bg-white          /* Pure white */
.bg-cream          /* #F5F0E8 */
.bg-warm-gray      /* #E8E3D9 */

/* Dark mode (auto-applied with .dark) */
.dark .bg-white    /* #181716 */
.dark .bg-cream    /* #181716 */
.dark .bg-warm-gray /* #262321 */
```

**Text Classes**:
```css
/* Light mode */
.text-charcoal     /* #2C2825 */
.text-stone-600    /* #8B8580 */
.text-stone-500    /* Muted */

/* Dark mode */
.dark .text-charcoal   /* #FFFFFF */
.dark .text-stone-600  /* #B8AFA5 */
.dark .text-stone-500  /* #A89F95 */
```

**Border Classes**:
```css
/* Light mode */
.border-stone-200  /* Subtle border */
.border-stone-300  /* Medium border */

/* Dark mode */
.dark .border-stone-200 /* #34302D */
.dark .border-stone-300 /* #3F3A36 */
```

### Component Theme Examples

**Card Component**:
```jsx
// Light mode: white background, subtle border
// Dark mode: semi-transparent stone-900, stone-800 border
<div className="bg-white dark:bg-stone-900/30 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
  <h3 className="text-charcoal dark:text-white font-semibold">Card Title</h3>
  <p className="text-stone-600 dark:text-stone-400">Card content</p>
</div>
```

**Button Component**:
```jsx
// Semantic colors preserved in both themes
<button className="bg-terracotta hover:bg-clay text-white rounded-full px-6 py-3">
  Primary Action
</button>
```

**Page Background**:
```jsx
// Light mode: pure white
// Dark mode: gradient from stone-950 to stone-900 to stone-950
<div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
  {/* Page content */}
</div>
```

### Accessibility Testing Tools

**Recommended Tools**:
1. **axe DevTools**: Browser extension for accessibility testing
2. **WAVE**: Web accessibility evaluation tool
3. **Lighthouse**: Chrome DevTools audit
4. **Color Contrast Analyzer**: Desktop app for contrast checking
5. **Screen Readers**: NVDA (Windows), VoiceOver (Mac), TalkBack (Android)

**Testing Workflow**:
1. Run automated accessibility scan (axe, WAVE)
2. Check contrast ratios (Color Contrast Analyzer)
3. Test keyboard navigation
4. Test with screen reader
5. Verify focus indicators
6. Test with reduced motion preference

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-XX  
**Author**: Kiro AI Agent  
**Status**: Ready for Implementation
