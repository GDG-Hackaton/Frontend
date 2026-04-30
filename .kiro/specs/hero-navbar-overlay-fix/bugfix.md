# Bugfix Requirements Document

## Introduction

This bugfix addresses styling issues with the hero section and navbar on the landing page. Currently, the navbar's fixed positioning creates unwanted space at the top of the hero section, preventing it from being truly full-screen. Additionally, the navbar styling doesn't integrate visually with the hero design. This fix will make the navbar overlay the hero section with absolute positioning and update button styling to create a cohesive, full-viewport hero experience.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the landing page loads THEN the hero section starts below the navbar instead of at the top of the viewport (0px from top)

1.2 WHEN the landing page loads THEN a spacer div (`<div className="h-16 md:h-20" />`) at the bottom of MainHeader.jsx pushes content down by 64px/80px

1.3 WHEN the user scrolls the page THEN the navbar displays a white/blurred background (`backdrop-blur-xl`) that doesn't integrate with the hero design

1.4 WHEN viewing navbar buttons THEN they have default styling (solid backgrounds, borders) that doesn't visually integrate with the hero section

1.5 WHEN the navbar is rendered THEN it uses `fixed` positioning which reserves space in the document flow and prevents the hero from reaching the top

### Expected Behavior (Correct)

2.1 WHEN the landing page loads THEN the hero section SHALL start at the very top of the viewport (0px from top) and be full viewport height

2.2 WHEN the landing page loads THEN the spacer div SHALL be removed so no artificial spacing pushes content down

2.3 WHEN the user scrolls the page THEN the navbar SHALL maintain its overlay appearance without obstructing the hero video background visibility

2.4 WHEN viewing navbar buttons THEN they SHALL have transparent/clear styling with white text and no borders to integrate with the hero design

2.5 WHEN the navbar is rendered THEN it SHALL use `absolute` positioning to overlay the hero section without affecting document flow

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the user scrolls past the hero section THEN the navbar SHALL CONTINUE TO provide the backdrop-blur effect for readability over other content

3.2 WHEN the navbar is in mobile view THEN it SHALL CONTINUE TO function with the mobile menu toggle and slide-out menu

3.3 WHEN the user interacts with navbar dropdowns (Reconnect, Language, Profile) THEN they SHALL CONTINUE TO open and close correctly

3.4 WHEN the user navigates to other pages THEN the navbar SHALL CONTINUE TO function normally with its existing styling

3.5 WHEN the navbar buttons are hovered or clicked THEN they SHALL CONTINUE TO provide appropriate visual feedback

3.6 WHEN the user is authenticated or not authenticated THEN the navbar SHALL CONTINUE TO display the appropriate buttons (Sign in/Join Reunite vs Profile/Logout)

3.7 WHEN the navbar logo is clicked THEN it SHALL CONTINUE TO navigate to the home page

3.8 WHEN the page is scrolled THEN the navbar SHALL CONTINUE TO apply the `isScrolled` state for conditional styling
