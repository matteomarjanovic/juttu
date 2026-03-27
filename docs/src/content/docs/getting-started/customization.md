---
title: Customization
description: Customize the look and feel of the Juttu widget.
sidebar:
  order: 3
---

Juttu uses CSS custom properties (variables) for all visual styling. You can override any of them to match your site's design.

## Default behavior

By default, Juttu uses a **transparent background** so it blends seamlessly into your site. Text and border colors adapt automatically based on whether your site uses a light or dark color scheme.

## Overriding CSS variables

To customize the widget, define your overrides on the `.juttu-comments` selector. Your styles take precedence over the defaults:

```css
.juttu-comments {
  --juttu-accent-color: #6366f1; /* Indigo accent */
  --juttu-radius: 12px; /* Rounder corners */
}
```

### Available variables

| Variable | Default (light) | Default (dark) | Description |
|----------|-----------------|----------------|-------------|
| `--juttu-font-family` | system-ui, … | same | Font stack for UI elements |
| `--juttu-comment-font-family` | inherits `--juttu-font-family` | same | Font stack for comment text |
| `--juttu-font-size` | `14px` | same | Base font size |
| `--juttu-comment-font-size` | inherits `--juttu-font-size` | same | Font size for comment text |
| `--juttu-bg` | `transparent` | `transparent` | Widget background |
| `--juttu-surface` | `rgba(0,0,0,0.03)` | `rgba(255,255,255,0.05)` | Input fields, cards |
| `--juttu-border-color` | `#e1e8ed` | `#38444d` | Borders and dividers |
| `--juttu-text` | `#0f1419` | `#ffffff` | Primary text color |
| `--juttu-text-muted` | `#536471` | `#8b98a5` | Secondary text color |
| `--juttu-accent-color` | `#1d9bf0` | same | Links, buttons, focus rings |
| `--juttu-like-color` | `#e0245e` | same | Like button active state |
| `--juttu-repost-color` | `#17bf63` | same | Repost button active state |
| `--juttu-avatar-size` | `32px` | same | Avatar dimensions |
| `--juttu-radius` | `8px` | same | Border radius |
| `--juttu-autocomplete-bg` | `#ffffff` | `#1e2d3d` | Background of the @mention autocomplete dropdown |

## Examples

### Opaque background

If you prefer the widget to have its own background rather than being transparent:

```css
.juttu-comments[data-juttu-theme="light"] {
  --juttu-bg: #ffffff;
  --juttu-surface: #f7f9f9;
}

.juttu-comments[data-juttu-theme="dark"] {
  --juttu-bg: #15202b;
  --juttu-surface: #1e2732;
}
```

### Serif comment text

Use a serif typeface for comment bodies while keeping the UI (handles, buttons, etc.) in sans-serif:

```css
.juttu-comments {
  --juttu-comment-font-family: Georgia, 'Times New Roman', serif;
}
```

### Custom accent color

```css
.juttu-comments {
  --juttu-accent-color: #8b5cf6; /* Purple */
}
```

### Match a specific design system

```css
.juttu-comments {
  --juttu-font-family: 'Inter', sans-serif;
  --juttu-accent-color: #2563eb;
  --juttu-radius: 4px;
  --juttu-border-color: #d1d5db;
}
```
