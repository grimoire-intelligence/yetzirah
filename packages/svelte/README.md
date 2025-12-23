# @yetzirah/svelte

Svelte wrappers for Yetzirah Web Components.

## Installation

```bash
pnpm add @yetzirah/svelte @yetzirah/core
```

## Usage

Svelte has excellent Web Component support out of the box. These wrappers provide:
- TypeScript definitions
- Svelte-idiomatic component APIs
- Reactive property bindings

### Direct Web Component Usage

You can use Yetzirah Web Components directly in Svelte:

```svelte
<script>
  import '@yetzirah/core/button'
</script>

<ytz-button on:click={() => console.log('clicked')}>
  Click me
</ytz-button>
```

### Using Svelte Wrappers

Or use the Svelte wrappers for better type safety:

```svelte
<script>
  import { Button } from '@yetzirah/svelte'
</script>

<Button on:click={() => console.log('clicked')}>
  Click me
</Button>
```

## Why Thin Wrappers?

Svelte's compiler has first-class Web Component support:
- Automatic event forwarding
- Two-way data binding with custom elements
- No runtime overhead

Our wrappers are intentionally minimal, primarily providing TypeScript definitions and following Svelte conventions.

## Components

Component wrappers will be added in subsequent PRs. The core Web Components are available now via `@yetzirah/core`.

## Development

```bash
# Build the package
pnpm build

# Watch for changes
pnpm dev
```

## License

ISC
