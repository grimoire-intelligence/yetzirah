# Laravel Integration Guide

Integrate Yetzirah Web Components with Laravel applications using Vite and Livewire.

## Quick Start

Install via npm with Laravel's Vite setup:

```bash
npm install @grimoire/yetzirah-core @grimoire/yetzirah-alpine alpinejs
```

In `resources/js/app.js`:

```js
import Alpine from 'alpinejs'
import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
import '@grimoire/yetzirah-core'

Alpine.plugin(yetzirahPlugin)
window.Alpine = Alpine
Alpine.start()
```

Use components in any Blade template:

```blade
<ytz-button>Hello from Laravel!</ytz-button>
```

## Installation

### Option 1: Vite (Recommended)

Laravel uses Vite by default for asset bundling:

```bash
npm install @grimoire/yetzirah-core @grimoire/yetzirah-alpine alpinejs
```

Configure `resources/js/app.js`:

```js
import Alpine from 'alpinejs'
import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
import '@grimoire/yetzirah-core'

Alpine.plugin(yetzirahPlugin)
window.Alpine = Alpine
Alpine.start()
```

Ensure Vite processes your JS in `vite.config.js`:

```js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
  ],
})
```

Include in your layout:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    {{ $slot }}
</body>
</html>
```

### Option 2: CDN

For simpler projects without a build step:

```blade
{{-- resources/views/layouts/app.blade.php --}}
<head>
    <script type="importmap">
    {
        "imports": {
            "@grimoire/yetzirah-core": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js",
            "@grimoire/yetzirah-alpine": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-alpine@latest/dist/index.js",
            "alpinejs": "https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"
        }
    }
    </script>
    <script type="module">
        import Alpine from 'alpinejs'
        import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
        import '@grimoire/yetzirah-core'

        Alpine.plugin(yetzirahPlugin)
        window.Alpine = Alpine
        Alpine.start()
    </script>
</head>
```

## Livewire Integration

Yetzirah components work with Livewire 3.x's DOM morphing.

### Basic Livewire Component

```php
// app/Livewire/VolumeControl.php
namespace App\Livewire;

use Livewire\Component;

class VolumeControl extends Component
{
    public int $volume = 50;

    public function render()
    {
        return view('livewire.volume-control');
    }
}
```

```blade
{{-- resources/views/livewire/volume-control.blade.php --}}
<div x-data="{ volume: @entangle('volume') }">
    <ytz-slider x-ytz:model="volume" min="0" max="100"></ytz-slider>
    <p>Volume: <span x-text="volume"></span></p>
</div>
```

### Using @entangle for State Sync

The `@entangle` directive syncs Alpine state with Livewire properties:

```blade
<div x-data="{ isOpen: @entangle('showModal') }">
    <ytz-button @click="isOpen = true">Open Modal</ytz-button>

    <ytz-dialog x-ytz-dialog="isOpen">
        <h2>Server-Synced Modal</h2>
        <p>This state is synced with Livewire.</p>
        <ytz-button @click="isOpen = false">Close</ytz-button>
    </ytz-dialog>
</div>
```

### wire:model vs x-ytz:model

Use `x-ytz:model` with `@entangle` for Yetzirah components:

```blade
{{-- DON'T: wire:model doesn't work with custom elements --}}
<ytz-select wire:model="country">...</ytz-select>

{{-- DO: Use Alpine as the bridge --}}
<div x-data="{ country: @entangle('country') }">
    <ytz-select x-ytz:model="country">
        @foreach($countries as $code => $name)
            <ytz-option value="{{ $code }}">{{ $name }}</ytz-option>
        @endforeach
    </ytz-select>
</div>
```

### Livewire Actions with Yetzirah

Trigger Livewire actions from Yetzirah events:

```blade
<div x-data="{ selected: @entangle('selectedItem') }">
    <ytz-listbox x-ytz:model="selected" @change="$wire.itemSelected(selected)">
        @foreach($items as $item)
            <ytz-option value="{{ $item->id }}">{{ $item->name }}</ytz-option>
        @endforeach
    </ytz-listbox>
</div>
```

## Blade Component Patterns

### Creating Reusable Components

Wrap Yetzirah in Blade components for consistent usage:

```blade
{{-- resources/views/components/dialog.blade.php --}}
@props(['title', 'trigger'])

<div x-data="{ open: false }">
    <ytz-button @click="open = true">{{ $trigger }}</ytz-button>

    <ytz-dialog x-ytz-dialog="open">
        <h2>{{ $title }}</h2>
        {{ $slot }}
        <div class="dialog-actions">
            {{ $actions ?? '' }}
            <ytz-button variant="text" @click="open = false">Close</ytz-button>
        </div>
    </ytz-dialog>
</div>
```

Usage:

```blade
<x-dialog title="Confirm Action" trigger="Delete Item">
    <p>Are you sure you want to delete this item?</p>

    <x-slot:actions>
        <ytz-button variant="danger" wire:click="delete">Delete</ytz-button>
    </x-slot:actions>
</x-dialog>
```

### Anonymous Components

For simple wrappers, use anonymous components:

```blade
{{-- resources/views/components/toggle-field.blade.php --}}
@props(['label', 'model'])

<div x-data="{ enabled: @entangle($model) }" {{ $attributes->class(['toggle-field']) }}>
    <label>{{ $label }}</label>
    <ytz-toggle x-ytz:model="enabled"></ytz-toggle>
</div>
```

Usage:

```blade
<x-toggle-field label="Enable notifications" model="notificationsEnabled" />
```

### Passing Slots to Yetzirah

Blade slots map to Yetzirah component slots:

```blade
{{-- resources/views/components/tabs.blade.php --}}
@props(['default' => null])

<div x-data="{ activeTab: '{{ $default }}' }">
    <ytz-tabs x-ytz-tabs="activeTab">
        <ytz-tab-list>
            {{ $tabs }}
        </ytz-tab-list>
        {{ $slot }}
    </ytz-tabs>
</div>
```

Usage:

```blade
<x-tabs default="overview">
    <x-slot:tabs>
        <ytz-tab value="overview">Overview</ytz-tab>
        <ytz-tab value="details">Details</ytz-tab>
    </x-slot:tabs>

    <ytz-tab-panel value="overview">Overview content</ytz-tab-panel>
    <ytz-tab-panel value="details">Details content</ytz-tab-panel>
</x-tabs>
```

## Common Patterns

### Modal Dialog

```blade
{{-- resources/views/components/modal.blade.php --}}
@props(['id', 'title', 'maxWidth' => 'md'])

<div x-data="{ open: false }" x-on:open-modal.window="if ($event.detail === '{{ $id }}') open = true">
    <ytz-dialog x-ytz-dialog="open" class="max-w-{{ $maxWidth }}">
        <header>
            <h2>{{ $title }}</h2>
            <ytz-button variant="text" @click="open = false">&times;</ytz-button>
        </header>
        <div class="modal-body">
            {{ $slot }}
        </div>
        @if(isset($footer))
            <footer>{{ $footer }}</footer>
        @endif
    </ytz-dialog>
</div>
```

Trigger from anywhere:

```blade
<ytz-button @click="$dispatch('open-modal', 'confirm-delete')">
    Delete
</ytz-button>

<x-modal id="confirm-delete" title="Confirm Delete">
    <p>Are you sure?</p>
    <x-slot:footer>
        <ytz-button wire:click="delete">Confirm</ytz-button>
    </x-slot:footer>
</x-modal>
```

### Form with Validation

```blade
{{-- resources/views/livewire/contact-form.blade.php --}}
<form wire:submit="submit">
    <div x-data="{ subject: @entangle('subject') }">
        <label>Subject</label>
        <ytz-select x-ytz:model="subject">
            <ytz-option value="">Select a subject</ytz-option>
            <ytz-option value="support">Support</ytz-option>
            <ytz-option value="sales">Sales</ytz-option>
            <ytz-option value="other">Other</ytz-option>
        </ytz-select>
        @error('subject')
            <span class="error">{{ $message }}</span>
        @enderror
    </div>

    <div>
        <label>Message</label>
        <textarea wire:model="message"></textarea>
        @error('message')
            <span class="error">{{ $message }}</span>
        @enderror
    </div>

    <ytz-button type="submit">Send</ytz-button>
</form>
```

### Navigation Drawer

```blade
{{-- resources/views/layouts/app.blade.php --}}
<div x-data="{ sidebarOpen: false }">
    <ytz-button class="lg:hidden" @click="sidebarOpen = true">
        Menu
    </ytz-button>

    <ytz-drawer x-ytz-drawer="sidebarOpen" position="left">
        <nav>
            @foreach($navigation as $item)
                <a href="{{ $item['url'] }}"
                   @click="sidebarOpen = false"
                   @class(['active' => request()->is($item['pattern'])])>
                    {{ $item['label'] }}
                </a>
            @endforeach
        </nav>
    </ytz-drawer>

    <main>
        {{ $slot }}
    </main>
</div>
```

### Toast Notifications

```blade
{{-- resources/views/components/toast-container.blade.php --}}
<div x-data="{ toasts: [] }"
     x-on:toast.window="toasts.push($event.detail); setTimeout(() => toasts.shift(), 5000)">
    <template x-for="(toast, index) in toasts" :key="index">
        <ytz-snackbar open :variant="toast.type" x-text="toast.message"></ytz-snackbar>
    </template>
</div>
```

Trigger from Livewire:

```php
// In your Livewire component
$this->dispatch('toast', ['message' => 'Item saved!', 'type' => 'success']);
```

### Session Flash Messages

```blade
{{-- resources/views/layouts/app.blade.php --}}
@if(session('success'))
    <ytz-snackbar open duration="5000" variant="success">
        {{ session('success') }}
    </ytz-snackbar>
@endif

@if(session('error'))
    <ytz-snackbar open duration="5000" variant="error">
        {{ session('error') }}
    </ytz-snackbar>
@endif
```

### Autocomplete with API

```blade
<div x-data="{
    query: '',
    results: [],
    async search() {
        if (this.query.length < 2) {
            this.results = []
            return
        }
        const response = await fetch(`/api/search?q=${encodeURIComponent(this.query)}`)
        this.results = await response.json()
    }
}">
    <ytz-autocomplete
        x-ytz:model="query"
        @input.debounce.300ms="search()"
        placeholder="Search users...">
        <template x-for="user in results" :key="user.id">
            <ytz-option :value="user.id" x-text="user.name"></ytz-option>
        </template>
    </ytz-autocomplete>
</div>
```

## Folio Integration

For Laravel Folio page-based routing:

```blade
{{-- resources/views/pages/settings.blade.php --}}
<?php
use function Livewire\Volt\{state, mount};

state(['theme' => 'light', 'notifications' => true]);
?>

<x-layouts.app>
    <h1>Settings</h1>

    <div x-data="{ theme: @entangle('theme') }">
        <label>Theme</label>
        <ytz-select x-ytz:model="theme">
            <ytz-option value="light">Light</ytz-option>
            <ytz-option value="dark">Dark</ytz-option>
            <ytz-option value="system">System</ytz-option>
        </ytz-select>
    </div>

    <div x-data="{ enabled: @entangle('notifications') }">
        <label>Notifications</label>
        <ytz-toggle x-ytz:model="enabled"></ytz-toggle>
    </div>
</x-layouts.app>
```

## Troubleshooting

### Livewire morphing breaks component state

Ensure your Yetzirah components have stable wrappers:

```blade
{{-- Add wire:key to prevent unnecessary re-renders --}}
<div wire:key="dialog-{{ $item->id }}" x-data="{ open: false }">
    <ytz-dialog x-ytz-dialog="open">...</ytz-dialog>
</div>
```

### Alpine not initializing with Livewire

Ensure Alpine starts after Livewire:

```js
// resources/js/app.js
import Alpine from 'alpinejs'
import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
import '@grimoire/yetzirah-core'

Alpine.plugin(yetzirahPlugin)
window.Alpine = Alpine

// Livewire v3 auto-starts Alpine, but if manually starting:
document.addEventListener('livewire:init', () => {
    Alpine.start()
})
```

### Custom elements not recognized

Check that Vite is processing your JS:

```bash
npm run build
# or for development
npm run dev
```

Verify the `@vite` directive is in your layout.

### @entangle not syncing

Ensure the property is public in your Livewire component and matches the entangled name exactly.

---

See also:
- [CDN Usage Guide](./cdn-usage.md) - CDN loading strategies
- [Alpine.js Plugin](../packages/alpine/README.md) - Full directive reference
- [Vanilla Patterns](./vanilla-patterns.md) - Progressive enhancement patterns
