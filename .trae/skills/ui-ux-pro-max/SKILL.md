---
name: "ui-ux-pro-max"
description: "AI design intelligence for professional UI/UX. Generates tailored design systems, color palettes, typography pairings, and UX guidelines. Invoke when user asks for UI design, specific styles (e.g., 'glassmorphism'), or design systems."
---

# UI UX Pro Max

**Skill ID:** ui-ux-pro-max-skill
**Version:** 2.2.1
**Purpose:** Provide design intelligence for building professional UI/UX across multiple platforms.

## Capabilities

This skill provides comprehensive design recommendations including:
1.  **Intelligent Design System Generation**: Complete design systems tailored to the project.
2.  **Style Search**: Recommendations for styles like Glassmorphism, Neumorphism, Minimalism, etc.
3.  **Color Palettes**: Domain-specific palettes (SaaS, E-commerce, Healthcare, etc.).
4.  **Typography**: Font pairings with Google Fonts and implementation details.
5.  **UX Guidelines**: Best practices and anti-patterns.
6.  **Tech Stack Support**: React, Vue, Svelte, Tailwind, Flutter, SwiftUI, etc.

## Usage

**Invoke this skill when:**
- User asks to "design a [type] app" or "generate a design system".
- User asks for specific UI styles (e.g., "give me a glassmorphism look").
- User needs color palettes or font pairings.
- User asks for UX best practices.

**Simulation Mode:**
Since the underlying python scripts (`src/ui-ux-pro-max/scripts/search.py`) are not available in this environment, you (the AI) MUST **simulate** the behavior of the tool by generating the output directly based on your training data and the format below.

## Output Format: Design System Generator

When asked to generate a design system, strictly follow this ASCII/Markdown format:

```text
+----------------------------------------------------------------------------------------+
|  TARGET: [Project Name] - RECOMMENDED DESIGN SYSTEM                                    |
+----------------------------------------------------------------------------------------+
|                                                                                        |
|  PATTERN: [Design Pattern Name] (e.g., Hero-Centric + Social Proof)                    |
|     Conversion: [Strategy]                                                             |
|     CTA: [Placement Strategy]                                                          |
|     Sections:                                                                          |
|       1. [Section 1]                                                                   |
|       2. [Section 2]                                                                   |
|       ...                                                                              |
|                                                                                        |
|  STYLE: [Style Name] (e.g., Soft UI Evolution)                                         |
|     Keywords: [Keywords]                                                               |
|     Best For: [Target Audience/Industry]                                               |
|     Performance: Excellent | Accessibility: WCAG AA                                    |
|                                                                                        |
|  COLORS:                                                                               |
|     Primary:    [Hex] (Name)                                                           |
|     Secondary:  [Hex] (Name)                                                           |
|     CTA:        [Hex] (Name)                                                           |
|     Background: [Hex] (Name)                                                           |
|     Text:       [Hex] (Name)                                                           |
|     Notes: [Color Psychology Notes]                                                    |
|                                                                                        |
|  TYPOGRAPHY: [Header Font] / [Body Font]                                               |
|     Mood: [Mood Descriptors]                                                           |
|     Best For: [Usage Context]                                                          |
|     Google Fonts: [Link]                                                               |
|                                                                                        |
|  KEY EFFECTS:                                                                          |
|     [Description of shadows, transitions, border-radius, etc.]                          |
|                                                                                        |
|  AVOID (Anti-patterns):                                                                |
|     [List of things to avoid]                                                          |
|                                                                                        |
|  PRE-DELIVERY CHECKLIST:                                                               |
|     [ ] No emojis as icons (use SVG: Heroicons/Lucide)                                 |
|     [ ] cursor-pointer on all clickable elements                                       |
|     [ ] Hover states with smooth transitions (150-300ms)                               |
|     [ ] Light mode: text contrast 4.5:1 minimum                                        |
|     [ ] Focus states visible for keyboard nav                                          |
|     [ ] prefers-reduced-motion respected                                               |
|     [ ] Responsive: 375px, 768px, 1024px, 1440px                                       |
|                                                                                        |
+----------------------------------------------------------------------------------------+
```

## Commands (Simulated)

If the user tries to run CLI commands, interpret them as natural language requests:

- `uipro init` -> Initialize a new design system for the project.
- `search.py "query" --domain style` -> Search for styles matching "query".
- `search.py "query" --domain color` -> Search for color palettes.

## Example: Style Search Output

If user asks for "Glassmorphism":

**Glassmorphism**
- **Characteristics**: Translucency, vivid backgrounds, light borders.
- **CSS**:
  ```css
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  ```
- **Best For**: Dashboards, modern landing pages, cards.
