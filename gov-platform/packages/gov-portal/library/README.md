# Gov Portal — Library

Lightweight component library and utilities used by the gov-portal application in this monorepo.

This package provides reusable UI components, design tokens, and small helpers intended for building consistent pages in the gov-portal application.

## Contents

- Components (React)
- Design tokens (CSS / SCSS / tokens)
- TypeScript types
- Utility helpers

## Quick start

From the repository root (pnpm is used in this monorepo; replace with npm/yarn if needed):

Install dependencies
```
pnpm install
```

Use the package locally in another workspace package (dependent packages should reference the workspace package name, e.g. `@gov-portal/library`).

## Usage

Import components in your application code:

```tsx
import { Button, Header } from '@gov-portal/library';

export default function Page() {
    return (
        <div>
            <Header title="Service title" />
            <main>
                <Button variant="primary">Continue</Button>
            </main>
        </div>
    );
}
```

Import styles / tokens as needed:

```scss
@use '@gov-portal/library/tokens' as tokens;

:root {
    --brand-color: tokens.$brand-color;
}
```

## Development

Run the package in isolation or together with app examples.

Start a local Storybook (preview components):
```
pnpm --filter @gov-portal/library storybook
```

Run a development build (if available):
```
pnpm --filter @gov-portal/library dev
```

Build for production:
```
pnpm --filter @gov-portal/library build
```

Run tests and linters:
```
pnpm --filter @gov-portal/library test
pnpm --filter @gov-portal/library lint
pnpm --filter @gov-portal/library format
```

## API & Types

This package is authored in TypeScript. Types are exported along with components. Refer to component JSDoc and the Storybook stories for usage examples and available props.

## Folder layout (typical)
- src/
    - components/       — React components
    - styles/           — tokens, global styles, SCSS
    - utils/            — helper functions
    - index.ts          — package entry
- stories/            — Storybook stories
- tests/              — unit and integration tests

## Contributing

- Follow existing code style and ESLint rules.
- Add unit tests for new components and edge cases.
- Update Storybook stories with visual examples.
- Run `pnpm build`, `pnpm test` and `pnpm lint` before submitting PRs.

## Publishing

This package is managed by the monorepo release process. Release via the repository's release tooling (semantic-release, changesets, or CI pipeline) — do not publish manually unless instructed.

## License

Specify your license here (e.g. MIT). Update package.json/license to match.

## Maintainers

List the team or contact point for this package in the repository.
## Maintainers

- Gov Portal UI Team — ui-team@example.gov
- @gov-portal/library maintainers on GitHub — github.com/gov-portal

## DynamicForm — usage & API

A lightweight configurable form component for simple CRUD and service pages. Supply a fields schema and handlers; the component manages rendering, basic validation and submit lifecycle.

Basic example:

```tsx
import { DynamicForm } from '@gov-portal/library';

const fields = [
    { name: 'serviceName', label: 'Service name', type: 'text', validation: { required: true } },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'category', label: 'Category', type: 'select', options: [
            { value: 'a', label: 'Category A' },
            { value: 'b', label: 'Category B' }
        ], validation: { required: true } 
    },
    { name: 'terms', label: 'Accept terms', type: 'checkbox', default: false, validation: { required: true } }
];

export default function Page() {
    return (
        <DynamicForm
            fields={fields}
            initialValues={{ serviceName: '', category: 'a' }}
            submitLabel="Save"
            showCancel
            onSubmit={(values) => { console.log('submit', values); }}
            onCancel={() => { console.log('cancelled'); }}
        />
    );
}
```

Field schema (common props)
- name: string — field key (required)
- label: string — visible label
- type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'email' | 'password'
- options?: Array<{ value: string; label: string }> — for select/radio
- default?: any
- placeholder?: string
- validation?: { required?: boolean; pattern?: string; minLength?: number; maxLength?: number; custom?: (value) => string | null }
- props?: Record<string, any> — passthrough HTML/input props

Component props
- fields: Field[] — required
- initialValues?: Record<string, any>
- submitLabel?: string (default: "Submit")
- cancelLabel?: string (default: "Cancel")
- showCancel?: boolean
- disabled?: boolean
- onSubmit: (values: Record<string, any>) => void | Promise<void>
- onCancel?: () => void
- onChange?: (values: Record<string, any>) => void
- validateOnChange?: boolean

Validation behavior
- Runs basic validations from the field schema.
- Shows inline error messages.
- Supports a custom validator function per field (return null for success or an error message).
- onSubmit is blocked until validations pass.

Accessibility & styling
- Labels are associated with inputs.
- Error text uses aria-invalid / aria-describedby.
- The component emits class names and supports theming via the library's tokens — override with your app styles when needed.

Notes
- Keep schema small and declarative for maintainability.
- For complex dynamic behavior (conditional fields, async validation) wrap DynamicForm and manage state externally or extend with a custom field component.
- Refer to Storybook stories for live examples and edge-case patterns.
- For TypeScript typing, import Field and DynamicFormProps from the package if available:
    import type { Field, DynamicFormProps } from '@gov-portal/library';
- If you need additional field types or behaviours, open an issue or PR in the monorepo.