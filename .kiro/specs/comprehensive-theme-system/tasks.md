# Implementation Plan: Comprehensive Theme System

## Overview

This implementation plan breaks down the comprehensive theme system into discrete coding tasks. The system extends the existing ThemeProvider to apply consistent light/dark mode color schemes across all pages and components. Implementation follows a bottom-up approach: CSS foundation → Layout components → Page components → UI components → Feature components → Testing.

## Tasks

- [ ] 1. Set up CSS theme configuration with Tailwind v4
  - Update `src/styles/globals.css` with `@theme` directive and comprehensive color variables
  - Add dark mode overrides using `@custom-variant dark` and `.dark` selector
  - Define light mode colors: warm-white (#FDFBF7), cream (#F5F0E8), charcoal (#2C2825), stone-600 (#8B8580)
  - Define dark mode colors: stone-950 (#0F0E0D), stone-900 (#181716), stone-800 (#262321), white (#FFFFFF), stone-300/400
  - Add gradient background utilities for dark mode (stone-950 → stone-900 → stone-950)
  - Add theme-aware card utilities (white bg with stone-200 border for light, stone-900/30 bg with stone-800 border for dark)
  - Add transition utilities for smooth theme switching (300ms duration, ease-in-out timing)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 5.3, 5.4_

- [ ] 2. Update layout components for theme support
  - [ ] 2.1 Update MainHeader component with theme-aware styling
    - Add dynamic styling based on theme state and scroll position
    - Ensure header visibility on Landing page video background in both themes
    - Update navigation links with theme-aware text colors (charcoal in light, white in dark)
    - Update mobile menu with theme-aware backgrounds and borders
    - Verify theme toggle button displays correct icon (sun for dark mode, moon for light mode)
    - _Requirements: 4.6, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [ ] 2.2 Update MainFooter component with theme-aware styling
    - Apply theme-aware background colors (cream in light, stone-900 in dark)
    - Update footer text colors (stone-600 in light, stone-400 in dark)
    - Update footer links with theme-aware hover states
    - Update footer borders with theme-aware colors
    - _Requirements: 4.6_

- [ ] 3. Checkpoint - Verify layout components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Update page components with theme application
  - [ ] 4.1 Update Landing page with theme-aware styling
    - Apply theme-aware page background (white in light, gradient in dark)
    - Update hero section with theme-aware text colors (charcoal headings in light, white in dark)
    - Update hero section body text (stone-600 in light, stone-300/400 in dark)
    - Update feature cards with theme-aware backgrounds and borders
    - Update statistics section with theme-aware styling
    - Update call-to-action sections with theme-aware backgrounds
    - _Requirements: 3.1, 4.1, 4.2, 4.3_

  - [ ] 4.2 Update Cases page with theme-aware styling
    - Apply theme-aware page background
    - Update page heading and subheading colors
    - Update case list cards with theme-aware backgrounds and borders
    - Update filter controls with theme-aware styling
    - Update empty state messaging with theme-aware text colors
    - _Requirements: 3.2, 4.1, 4.2, 4.3_

  - [ ] 4.3 Update Report page with theme-aware styling
    - Apply theme-aware page background
    - Update form container with theme-aware background and border
    - Update form labels and helper text with theme-aware colors
    - Update section headings with theme-aware colors
    - _Requirements: 3.3, 4.1, 4.2, 4.3_

  - [ ] 4.4 Update Volunteers page with theme-aware styling
    - Apply theme-aware page background
    - Update volunteer opportunity cards with theme-aware backgrounds and borders
    - Update page headings and descriptions with theme-aware colors
    - Update call-to-action sections with theme-aware styling
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [ ] 4.5 Update Wanted pages with theme-aware styling
    - Apply theme-aware page background to main Wanted page
    - Update PostCard components with theme-aware backgrounds and borders
    - Update post detail page with theme-aware styling
    - Update browse page filters with theme-aware styling
    - Update create post page with theme-aware form styling
    - Update claims page with theme-aware card styling
    - Update profile page with theme-aware styling
    - _Requirements: 3.5, 4.1, 4.2, 4.3_

  - [ ] 4.6 Update Admin pages with theme-aware styling
    - Apply theme-aware page background to DashboardLayout
    - Update admin sidebar with theme-aware background and borders
    - Update admin content area with theme-aware styling
    - Update analytics dashboard cards with theme-aware backgrounds
    - Update scraper config page with theme-aware form styling
    - _Requirements: 3.6, 4.1, 4.2, 4.3_

  - [ ] 4.7 Update authentication pages with theme-aware styling
    - Apply theme-aware page background to LoginPage
    - Apply theme-aware page background to RegisterPage
    - Apply theme-aware page background to ForgotPasswordPage
    - Apply theme-aware page background to ResetPasswordPage
    - Update auth form containers with theme-aware backgrounds and borders
    - Update auth form labels and helper text with theme-aware colors
    - Update auth page headings with theme-aware colors
    - _Requirements: 3.7, 4.1, 4.2, 4.3_

- [ ] 5. Checkpoint - Verify page components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Update UI components with theme support
  - [ ] 6.1 Update Card component with theme-aware styling
    - Apply theme-aware background (white in light, stone-900/30 in dark)
    - Apply theme-aware border (stone-200 in light, stone-800 in dark)
    - Apply theme-aware shadow (shadow-sm in light, shadow-lg shadow-black/20 in dark)
    - Ensure card content text inherits theme-aware colors
    - _Requirements: 4.3, 7.1, 7.2, 7.3_

  - [ ] 6.2 Update Button component with theme-aware styling
    - Preserve semantic colors for primary buttons (terracotta)
    - Preserve semantic colors for secondary buttons (sahara)
    - Ensure button text maintains sufficient contrast in both themes
    - Update button hover states to work in both themes
    - Update button focus indicators for both themes
    - _Requirements: 4.4, 7.3, 7.4, 7.5_

  - [ ] 6.3 Update Input component with theme-aware styling
    - Apply theme-aware background (white in light, stone-900/50 in dark)
    - Apply theme-aware border (stone-300 in light, stone-700 in dark)
    - Apply theme-aware text color (charcoal in light, white in dark)
    - Apply theme-aware placeholder color (stone-500 in both themes)
    - Update focus states with theme-aware ring colors
    - _Requirements: 4.5, 7.1, 7.2, 7.5_

  - [ ] 6.4 Update Textarea component with theme-aware styling
    - Apply same theme-aware styling as Input component
    - Ensure consistent appearance with Input component
    - _Requirements: 4.5, 7.1, 7.2, 7.5_

  - [ ] 6.5 Update Modal/Dialog components with theme-aware styling
    - Apply theme-aware modal background (white in light, stone-900 in dark)
    - Apply theme-aware modal border (stone-200 in light, stone-800 in dark)
    - Apply theme-aware overlay background (black/50 in light, black/70 in dark)
    - Update modal header and content text with theme-aware colors
    - _Requirements: 4.7, 7.1, 7.2_

  - [ ] 6.6 Update remaining UI primitives with theme-aware styling
    - Update Badge component with theme-aware backgrounds
    - Update Alert component with theme-aware styling
    - Update Tabs component with theme-aware styling
    - Update Progress component with theme-aware styling
    - Update ScrollArea component with theme-aware scrollbar styling
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 7. Update feature components with theme support
  - [ ] 7.1 Update PostCard component with theme-aware styling
    - Apply theme-aware card background and border
    - Update post title with theme-aware color (charcoal in light, white in dark)
    - Update post metadata with theme-aware color (stone-600 in light, stone-400 in dark)
    - Update post description with theme-aware color
    - _Requirements: 4.3, 7.1, 7.2_

  - [ ] 7.2 Update CaseDetail component with theme-aware styling
    - Apply theme-aware container background
    - Update case title and headings with theme-aware colors
    - Update case metadata and labels with theme-aware colors
    - Update case description and content with theme-aware colors
    - Update case status badges with theme-aware styling
    - _Requirements: 4.3, 7.1, 7.2_

  - [ ] 7.3 Update AI Assistant components with theme-aware styling
    - Update AIAssistant modal with theme-aware background
    - Update chat messages with theme-aware backgrounds and text colors
    - Update input area with theme-aware styling
    - Update confidence badges with theme-aware colors
    - _Requirements: 4.3, 7.1, 7.2_

  - [ ] 7.4 Update Map components with theme-aware styling
    - Update map controls with theme-aware backgrounds
    - Update map markers with theme-aware colors
    - Update map info windows with theme-aware styling
    - Update quick sighting form with theme-aware styling
    - _Requirements: 4.3, 7.1, 7.2_

  - [ ] 7.5 Update remaining feature components with theme-aware styling
    - Update VolunteerDashboard cards with theme-aware styling
    - Update AnalyticsDashboard charts with theme-aware colors
    - Update NetworkHub components with theme-aware styling
    - Update SearchStrategyView with theme-aware styling
    - _Requirements: 4.3, 7.1, 7.2_

- [ ] 8. Checkpoint - Verify all components
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 9. Write unit tests for theme functionality
  - [ ]* 9.1 Write unit tests for ThemeProvider
    - Test theme initialization with system preference
    - Test theme initialization with stored preference
    - Test toggleTheme function switches between light and dark
    - Test theme persistence to localStorage
    - Test .dark class application to document root
    - Test colorScheme style property updates
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.6, 8.7_

  - [ ]* 9.2 Write unit tests for CSS variable application
    - Test light mode applies correct color values
    - Test dark mode applies correct color values
    - Test transition properties are applied
    - Test gradient background in dark mode
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3_

- [ ]* 10. Write integration tests for theme application
  - [ ]* 10.1 Write integration tests for page theme application
    - Test Landing page applies theme correctly in both modes
    - Test Cases page applies theme correctly in both modes
    - Test Report page applies theme correctly in both modes
    - Test Volunteers page applies theme correctly in both modes
    - Test Wanted page applies theme correctly in both modes
    - Test Admin page applies theme correctly in both modes
    - Test Auth pages apply theme correctly in both modes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 10.2 Write integration tests for component theme application
    - Test Card component applies theme styles correctly
    - Test Button component maintains semantic colors in both themes
    - Test Input component applies theme styles correctly
    - Test Modal component applies theme styles correctly
    - Test PostCard component applies theme styles correctly
    - Test CaseDetail component applies theme styles correctly
    - _Requirements: 4.3, 4.4, 4.5, 4.7_

  - [ ]* 10.3 Write integration tests for theme transitions
    - Test theme toggle triggers transition animations
    - Test transitions complete without layout shifts
    - Test transitions apply to all color properties
    - Test transition duration is within 200-400ms range
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 10.4 Write integration tests for theme persistence
    - Test theme preference is stored in localStorage on toggle
    - Test stored theme preference is retrieved on page load
    - Test stored theme preference is applied before render
    - Test system preference is used when no stored preference exists
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 10.5 Write integration tests for existing functionality preservation
    - Test all ThemeProvider functionality remains intact
    - Test component behaviors are preserved after theme toggle
    - Test routing and navigation work correctly in both themes
    - Test form validation and submission work in both themes
    - Test no JavaScript errors occur during theme toggle
    - Test application state is preserved during theme toggle
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ]* 11. Write accessibility tests for theme compliance
  - [ ]* 11.1 Write contrast ratio tests for light mode
    - Test heading text meets WCAG AA contrast (4.5:1 minimum)
    - Test body text meets WCAG AA contrast (4.5:1 minimum)
    - Test large text meets WCAG AA contrast (3:1 minimum)
    - Test interactive elements meet WCAG AA contrast (3:1 minimum)
    - _Requirements: 7.1, 7.3_

  - [ ]* 11.2 Write contrast ratio tests for dark mode
    - Test heading text meets WCAG AA contrast (4.5:1 minimum)
    - Test body text meets WCAG AA contrast (4.5:1 minimum)
    - Test large text meets WCAG AA contrast (3:1 minimum)
    - Test interactive elements meet WCAG AA contrast (3:1 minimum)
    - _Requirements: 7.2, 7.3_

  - [ ]* 11.3 Write accessibility tests for theme toggle
    - Test theme toggle button is keyboard accessible
    - Test theme toggle button has appropriate ARIA labels
    - Test theme toggle button announces state changes to screen readers
    - Test focus indicators are visible in both themes
    - _Requirements: 7.5, 9.5, 9.6_

  - [ ]* 11.4 Write accessibility tests for semantic color preservation
    - Test error states remain distinguishable in both themes
    - Test success states remain distinguishable in both themes
    - Test warning states remain distinguishable in both themes
    - Test semantic colors maintain sufficient contrast
    - _Requirements: 7.4_

- [ ]* 12. Write responsive theme tests
  - [ ]* 12.1 Write tests for mobile viewport theme application
    - Test theme applies correctly on mobile (320px-767px)
    - Test theme transitions perform smoothly on mobile
    - Test touch targets remain accessible in both themes
    - _Requirements: 10.1, 10.4_

  - [ ]* 12.2 Write tests for tablet viewport theme application
    - Test theme applies correctly on tablet (768px-1023px)
    - Test theme transitions perform smoothly on tablet
    - _Requirements: 10.2, 10.4_

  - [ ]* 12.3 Write tests for desktop viewport theme application
    - Test theme applies correctly on desktop (1024px+)
    - Test theme transitions perform smoothly on desktop
    - _Requirements: 10.3, 10.4_

  - [ ]* 12.4 Write tests for responsive layout preservation
    - Test responsive layouts work correctly in light mode
    - Test responsive layouts work correctly in dark mode
    - Test layout behaviors are maintained during theme toggle
    - _Requirements: 10.5_

- [ ] 13. Final checkpoint - Comprehensive verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Implementation follows bottom-up approach: CSS foundation first, then components
- All theme colors are defined in CSS variables for maintainability
- Existing ThemeProvider functionality is preserved without modifications
- Theme transitions use CSS for performance (GPU-accelerated)
- Accessibility compliance (WCAG AA) is verified through automated tests
- Responsive behavior is tested across mobile, tablet, and desktop viewports
