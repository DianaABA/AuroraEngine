# Aurora Engine - AAA Design System

## Overview

The Aurora Engine now features a comprehensive, AAA-accessible design system that provides excellent usability across all devices and for all users.

## Key Features

### 1. AAA Accessibility Compliance

- **High Contrast Ratios**: All text meets WCAG AAA standards (7:1 for normal text, 4.5:1 for large text)
- **Focus Indicators**: Visible 3px outlines with proper color contrast (#22d3ee cyan)
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Keyboard Navigation**: Full keyboard support with visible focus states
- **Screen Reader Support**: Proper ARIA labels and semantic HTML

### 2. Comprehensive Responsive Design

#### Breakpoints

- **Small Mobile** (0-480px): Full-width buttons, optimized spacing
- **Mobile** (481px-768px): Flexible layouts, adaptive components
- **Tablet** (769px-1024px): Centered content, balanced spacing
- **Desktop** (1025px+): Maximum width constraints, optimal reading
- **Large Desktop** (1440px+): Enhanced spacing for large screens

### 3. Modern CSS Features

- **CSS Custom Properties**: Centralized design tokens
- **Fluid Typography**: clamp() for responsive text sizing
- **Container Queries Ready**: Future-proof responsive design
- **CSS Grid & Flexbox**: Modern layout techniques
- **Backdrop Filters**: Enhanced glass-morphism effects

## Design Tokens

### Typography

```css
--font-family: System font stack for optimal performance
--font-mono: Monospace fonts for code

--text-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)
--text-sm: clamp(0.875rem, 0.8rem + 0.3vw, 1rem)
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)
--text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.375rem)
--text-xl: clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem)
--text-2xl: clamp(1.5rem, 1.3rem + 0.8vw, 2.25rem)
```

### Spacing System

8-point grid system for consistent rhythm:

```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-5: 1.25rem (20px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-10: 2.5rem (40px)
--space-12: 3rem (48px)
```

### Color Palette

#### Backgrounds
- `--bg-primary`: #050814 - Main background
- `--bg-secondary`: #0b1020 - Panels and cards
- `--bg-tertiary`: #0f172a - Input backgrounds

#### Text (AAA Compliant)
- `--text-primary`: #f1f5f9 - Primary text
- `--text-secondary`: #cbd5e1 - Secondary text
- `--text-muted`: #94a3b8 - Muted text
- `--text-accent`: #bfdbfe - Accent text

#### Brand Colors
- `--accent-primary`: #8b5cf6 - Primary brand (violet)
- `--accent-secondary`: #22d3ee - Secondary brand (cyan)

#### Semantic Colors
- `--color-success`: #4ade80 - Success states
- `--color-warning`: #fbbf24 - Warning states
- `--color-error`: #f87171 - Error states
- `--color-info`: #60a5fa - Info states

### Borders & Shadows

```css
--border-subtle: rgba(255, 255, 255, 0.1)
--border-default: rgba(255, 255, 255, 0.15)
--border-strong: rgba(255, 255, 255, 0.2)

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4)
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.5)
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.6)
--shadow-glow: Branded glow effect
```

### Border Radius

```css
--radius-sm: 0.375rem (6px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-full: 9999px (fully rounded)
```

### Transitions

```css
--transition-fast: 150ms ease-in-out
--transition-base: 250ms ease-in-out
--transition-slow: 350ms ease-in-out
```

## Component Patterns

### Buttons

Three styles available:

1. **Primary Button**: Default, high-emphasis actions
   - Background: `--accent-primary`
   - Hover: Elevated with glow effect
   - Focus: 3px cyan outline

2. **Secondary Button**: `.secondary` class, medium-emphasis
   - Background: `--bg-tertiary`
   - Border: `--border-default`

3. **Disabled State**: Reduced opacity, no interaction

### Form Elements

All inputs follow consistent patterns:

- Minimum 44px touch targets
- Clear focus states with cyan outline
- Placeholder text in muted color
- Smooth transitions on interaction

### Accessibility Features

#### Reduced Motion
Users who prefer reduced motion see minimal animations:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations are minimized */
}
```

#### High Contrast Mode
Automatic border enhancement for users needing higher contrast:

```css
@media (prefers-contrast: high) {
  /* Borders doubled for clarity */
}
```

## Usage Guidelines

### Do's ✓

- Use spacing tokens consistently
- Maintain minimum 44px touch targets
- Test all interactive states (hover, focus, active, disabled)
- Ensure text meets AAA contrast ratios
- Use semantic HTML elements
- Test with keyboard navigation
- Verify screen reader compatibility

### Don'ts ✗

- Don't use arbitrary spacing values
- Don't create touch targets smaller than 44px
- Don't rely solely on color to convey information
- Don't use motion without reduced-motion fallbacks
- Don't skip focus states

## Testing Checklist

- [ ] All text passes AAA contrast (7:1)
- [ ] Interactive elements are 44x44px minimum
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators are visible
- [ ] Works on 320px viewport (small mobile)
- [ ] Works on 2560px viewport (large desktop)
- [ ] Reduced motion preference is respected
- [ ] High contrast mode is supported
- [ ] Screen readers announce content properly
- [ ] Touch targets don't overlap

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Android 90+

## Future Enhancements

- [ ] CSS Container Queries for component-level responsiveness
- [ ] Light mode theme variant
- [ ] Additional color themes
- [ ] Enhanced animation library
- [ ] Advanced focus management utilities

## Resources

- [WCAG 2.1 AAA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**Version**: 1.0.0
**Last Updated**: December 2025
**Maintainer**: Aurora Engine Team
