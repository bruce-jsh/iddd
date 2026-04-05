# Step 2: Visual Design Contract

This reference details how to detect the frontend stack and establish design tokens. The lead agent executes this step conversationally with the user.

---

## Inputs

| File | Purpose |
|------|---------|
| `specs/ui-structure.md` | Finalized screen inventory from Step 1 |
| `specs/entity-catalog.md` | Entity attributes for widget-to-token mapping |
| `docs/business-rules.md` | BR-xxx rules for validation message templates |

---

## Framework Detection

Scan the project root to detect the existing frontend stack. Check each indicator in order:

| Detect Target | File Patterns | Result |
|--------------|---------------|--------|
| React | `package.json` contains `react`, `*.jsx`/`*.tsx` files | React detected |
| Vue | `package.json` contains `vue`, `*.vue` files | Vue detected |
| Svelte | `package.json` contains `svelte`, `*.svelte` files | Svelte detected |
| Next.js | `next.config.*`, `app/` or `pages/` directory | Next.js detected |
| Nuxt | `nuxt.config.*` | Nuxt detected |
| Tailwind CSS | `tailwind.config.*` | Tailwind detected |
| shadcn/ui | `components.json`, `@/components/ui/` directory | shadcn detected |
| Radix UI | `@radix-ui/*` in package.json dependencies | Radix detected |
| MUI | `@mui/*` in package.json dependencies | MUI detected |
| None | No frontend files found | Greenfield |

### User Confirmation

After detection, confirm with the user:
- **Detected stack:** "React + Tailwind + shadcn/ui detected. Proceed with this stack?"
- **Greenfield:** "No frontend stack detected. Please choose: (A) React + Tailwind + shadcn/ui, (B) Vue + Tailwind, (C) Svelte + Tailwind, (D) Specify your own"

Record the confirmed stack in the contract.

---

## 5 Design Token Areas

### 1. Spacing Scale

Default proposal: **8-point grid**

| Token | Value | Usage |
|-------|-------|-------|
| space-0.5 | 2px | Hairline gaps |
| space-1 | 4px | Inline padding, icon gaps |
| space-2 | 8px | Input padding, small gaps |
| space-3 | 12px | Card padding (compact) |
| space-4 | 16px | Section gaps, form field margins |
| space-6 | 24px | Card padding (standard) |
| space-8 | 32px | Section separators |
| space-12 | 48px | Page section gaps |
| space-16 | 64px | Major layout gaps |

**Rule:** All spacing values in the project MUST be multiples of the base unit (4px). Arbitrary pixel values are rejected by the 7-Pillar gate.

### 2. Typography Scale

Default proposal: **4-level hierarchy** with maximum 2 font weights.

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| display | 36px | 700 | 1.2 | Page titles, hero headings |
| heading | 24px | 600 | 1.3 | Section headings, card titles |
| body | 16px | 400 | 1.5 | Body text, form labels, table cells |
| caption | 14px | 400 | 1.4 | Help text, timestamps, metadata |
| mono | 14px | 400 | 1.4 | Code snippets, IDs, technical values |

**Rule:** Do not exceed 4 sizes and 2 weights. Additional variation creates visual noise. If more levels are needed, ask the user to justify.

### 3. Color System

Default proposal: **60/30/10 ratio**

| Token | Light Mode | Dark Mode | Ratio | Usage |
|-------|-----------|-----------|-------|-------|
| surface | #ffffff | #0a0a0b | 60% | Page backgrounds, card backgrounds |
| secondary | #6b7280 | #9ca3af | 30% | Borders, inactive text, dividers |
| accent | _(user choice)_ | _(user choice)_ | 10% | CTAs, active states, links, focus rings |

**Semantic Colors** (fixed):

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| success | #22c55e | #4ade80 | Confirmation, completed states |
| warning | #eab308 | #facc15 | Caution, pending states |
| error | #ef4444 | #f87171 | Validation errors, destructive actions |
| info | #3b82f6 | #60a5fa | Informational messages, tips |

**Rule:** Only one accent color. Using multiple accent colors dilutes focus. The 7-Pillar gate blocks contracts with more than 1 accent.

### 4. Copywriting Standards

Define text patterns for all common UI scenarios. Every user-facing string follows a template.

| Pattern | Template | Example |
|---------|----------|---------|
| CTA Primary | "Create [Entity]" | "Create User" |
| CTA Secondary | "Save [Entity]" | "Save User" |
| CTA Destructive | "Delete [Entity]" | "Delete User" |
| Empty State | "No [entities] yet. Create your first [entity]." | "No users yet. Create your first user." |
| Error Required | "[Field] is required." | "Email is required." |
| Error Format | "[Field] must be a valid [type]." | "Email must be a valid email address." |
| Error Unique | "[Field] already exists." | "Email already exists." |
| Danger Confirm | "This will permanently delete [entity]. This cannot be undone." | "This will permanently delete this user. This cannot be undone." |
| Success | "[Entity] [action] successfully." | "User created successfully." |
| Loading | "Loading [entities]..." | "Loading users..." |

**Tone:** Confirm with user -- Professional (formal), Friendly (casual), or Terse (minimal).

**Rule:** Generic labels like "Submit", "Click here", or "OK" are rejected by the 7-Pillar gate. Every CTA must use a specific verb + entity name.

### 5. Component Registry

Map each widget type (from Step 1's attribute-to-widget mapping) to a concrete framework component.

**Example (shadcn/ui):**

| Widget | Component | Import Path |
|--------|-----------|-------------|
| Text Input | `<Input />` | `@/components/ui/input` |
| Textarea | `<Textarea />` | `@/components/ui/textarea` |
| Select Dropdown | `<Select />` | `@/components/ui/select` |
| Toggle/Checkbox | `<Switch />` | `@/components/ui/switch` |
| Number Input | `<Input type="number" />` | `@/components/ui/input` |
| Date Picker | `<DatePicker />` | `@/components/ui/date-picker` |
| DateTime Picker | `<DateTimePicker />` | `@/components/ui/datetime-picker` |
| Autocomplete | `<Combobox />` | `@/components/ui/combobox` |
| Hidden/Read-only | _(not rendered)_ | -- |
| File Upload | `<FileUpload />` | `@/components/ui/file-upload` |
| Specialized Input | `<Input type="email" />` | `@/components/ui/input` |
| JSON Editor | `<Textarea />` or custom | `@/components/ui/textarea` |

**Example (MUI):**

| Widget | Component | Import Path |
|--------|-----------|-------------|
| Text Input | `<TextField />` | `@mui/material/TextField` |
| Select Dropdown | `<Select />` | `@mui/material/Select` |
| Toggle/Checkbox | `<Switch />` | `@mui/material/Switch` |
| ... | ... | ... |

**Example (plain HTML + Tailwind):**

| Widget | Component | CSS Classes |
|--------|-----------|-------------|
| Text Input | `<input type="text" />` | `border rounded px-3 py-2` |
| Textarea | `<textarea />` | `border rounded px-3 py-2 min-h-24` |
| ... | ... | ... |

**Rule:** Every widget from the attribute-to-widget mapping MUST have a corresponding component entry. Unmapped widgets are rejected by the 7-Pillar gate.

---

## Entity Attribute to Design Token Connection (IDDD Differentiator)

For each attribute in every entity, trace the full chain from information model to visual representation. This is what makes IDDD unique -- every visual decision is justified by the data model.

```
Entity: User
  Attribute: email (VARCHAR, NOT NULL, UNIQUE)
    -> Widget: Specialized Input (email type)         [from Attribute-to-Widget rule #12]
    -> Component: <Input type="email" />              [from Component Registry]
    -> Validation: required + unique check             [from NOT NULL + UNIQUE constraints]
    -> BR-003: "Email must be unique"                  [from business-rules.md]
    -> Spacing: mb-16px (token: space-4)               [from Spacing Scale]
    -> Typography: Body (16px/400)                     [from Typography Scale]
    -> Error Messages:
       - "Email is required."                          [from Copywriting: Error Required]
       - "Email already exists."                       [from Copywriting: Error Unique]
       - "Email must be a valid email address."        [from Copywriting: Error Format]
```

Document this chain for every attribute in the Per-Screen Design Spec section of the contract.

---

## Output: `specs/ui-design-contract.md`

Write the finalized design contract using this format:

```markdown
---
version: "1.0"
framework: "React + Next.js"
ui_library: "shadcn/ui"
css: "Tailwind CSS"
derived_from: "ui-structure.md v1.0"
---

# UI Design Contract

## Tech Stack
- **Framework:** React 19 + Next.js 15 (App Router)
- **UI Library:** shadcn/ui (Radix primitives)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React

## Design Tokens

### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Inline padding, icon gaps |
| space-2 | 8px | Input padding, small gaps |
| ...

### Typography
| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| display | 36px | 700 | 1.2 | Page titles |
| ...

### Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| surface | #ffffff | #0a0a0b | Backgrounds |
| accent | #3b82f6 | #60a5fa | CTAs, active states |
| ...

### Copywriting
| Pattern | Template | Example |
|---------|----------|---------|
| CTA Primary | "Create [Entity]" | "Create User" |
| ...

## Component Mapping
| Widget | Component | Import |
|--------|-----------|--------|
| Text Input | <Input /> | @/components/ui/input |
| ...

## Per-Screen Design Spec

### User List (/users)
| Attribute | Widget | Component | Tokens | Validation |
|-----------|--------|-----------|--------|------------|
| name | Text Input | <Input /> | body, space-4 | required |
| email | Specialized Input | <Input type="email" /> | body, space-4 | required, unique, BR-003 |
| ...
```

### Completeness Check

Before writing the file, verify:
- [ ] Tech stack is confirmed with user
- [ ] All 5 design token areas are populated
- [ ] Every widget from ui-structure.md has a component mapping
- [ ] Per-screen design spec covers all screens from ui-structure.md
- [ ] Entity-attribute-to-token chain is documented for every visible attribute
