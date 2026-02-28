# Energy Check-in: Disability & Condition Adaptations

## How This Component Adapts

| Need / condition | What we do |
|------------------|------------|
| **Screen reader** | Each option has `aria-label` with full meaning (e.g. "Low energy: Chillin', take it easy"). Emoji are `aria-hidden`. Group is labeled via `aria-labelledby` to the visible heading. |
| **Keyboard** | Radix RadioGroup: Tab to group, arrow keys between options, Enter/Space to select. Focus ring 3px, 3:1 contrast (WCAG 2.4.11). |
| **Reduced motion** | `useReducedMotion()` disables hover scale, tap bounce, and pulse. Global `prefers-reduced-motion` shortens all animations. |
| **Motor / touch** | Whole card is the control; min 44×44px touch target. Large hit area for tap/click. |
| **Low vision / contrast** | Text: **#1a1f2e** (primary) and **#334155** (subtext) for ≥4.5:1 on all tints. Borders: **#0f766e** (map-teal-dark) for 3:1 (WCAG 1.4.11). Container: glass (#faf8f5 @ 95%) or solid when user prefers. |
| **High contrast / reduced transparency** | `prefers-contrast: high` or `prefers-reduced-transparency: reduce` switches container to solid warm beige and removes blur so contrast is guaranteed. |
| **Cognitive / ADHD** | Short copy, three clear options, reassurance (“No wrong answers!”). No judgmental language. |

## Glass vs Solid Container

- **Default (normal):** Container uses mid-transparent blurred map-beige + 12px blur. Contrast cannot be guaranteed when the background depends on what’s behind the component (e.g. 3D scene).
- Option cards stay **solid** (map blue/yellow/green tints); card text ≥4.5:1 contrast.
- **When user needs it:** `prefers-contrast: high` or `prefers-reduced-transparency: reduce` → solid #faf8f5, no blur.
- **Color scheme:** All from 3D map palette (teal, beige, soft blue, yellow, green).

## Optional Future Adaptations

- **Dyslexia font**: Apply `font-dyslexia` (OpenDyslexic) when the user enables it in the Accessibility Toolbar (Zustand).
- **High-contrast theme**: Use a global theme that forces darker text and stronger borders; this component already uses semantic tokens so it can be themed.
- **Skip link**: Ensure a “Skip to content” or “Skip to energy check-in” link exists when the check-in is not at the top of the page.
