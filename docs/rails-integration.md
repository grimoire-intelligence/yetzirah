# Rails Integration Guide

Integrate Yetzirah Web Components with Ruby on Rails applications using Import Maps and Hotwire/Turbo.

## Quick Start

Add Yetzirah to your Rails 7+ app with Import Maps:

```bash
# Pin the packages
bin/importmap pin @grimoire/yetzirah-core
bin/importmap pin @grimoire/yetzirah-alpine
bin/importmap pin alpinejs
```

Then in `app/javascript/application.js`:

```js
import Alpine from 'alpinejs'
import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
import '@grimoire/yetzirah-core'

Alpine.plugin(yetzirahPlugin)
Alpine.start()
```

Use components in any ERB template:

```erb
<ytz-button>Hello from Rails!</ytz-button>
```

## Installation

### Option 1: Import Maps (Recommended for Rails 7+)

Import Maps are Rails 7's default for JavaScript. Pin Yetzirah directly from CDN:

```bash
bin/importmap pin @grimoire/yetzirah-core
bin/importmap pin @grimoire/yetzirah-alpine
bin/importmap pin alpinejs
```

This adds entries to `config/importmap.rb`:

```ruby
# config/importmap.rb
pin "@grimoire/yetzirah-core", to: "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"
pin "@grimoire/yetzirah-alpine", to: "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-alpine@latest/dist/index.js"
pin "alpinejs", to: "https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"
```

### Option 2: esbuild/Vite

For apps using jsbundling-rails with esbuild or Vite:

```bash
# With npm
npm install @grimoire/yetzirah-core @grimoire/yetzirah-alpine alpinejs

# With yarn
yarn add @grimoire/yetzirah-core @grimoire/yetzirah-alpine alpinejs
```

### Option 3: CDN Only

For the simplest setup, add directly to your layout:

```erb
<%# app/views/layouts/application.html.erb %>
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
    Alpine.start()
  </script>
</head>
```

## Hotwire/Turbo Compatibility

Yetzirah components work seamlessly with Hotwire because custom elements self-initialize when added to the DOM.

### Turbo Drive

No special configuration needed. When Turbo Drive navigates between pages, custom elements automatically initialize:

```erb
<%# app/views/products/index.html.erb %>
<ytz-tabs>
  <ytz-tab-list>
    <ytz-tab value="all">All Products</ytz-tab>
    <ytz-tab value="featured">Featured</ytz-tab>
  </ytz-tab-list>
  <ytz-tab-panel value="all">
    <%= render @products %>
  </ytz-tab-panel>
  <ytz-tab-panel value="featured">
    <%= render @featured_products %>
  </ytz-tab-panel>
</ytz-tabs>
```

### Turbo Frames

Yetzirah components work inside Turbo Frames for partial page updates:

```erb
<%# app/views/products/show.html.erb %>
<%= turbo_frame_tag "product_details" do %>
  <h1><%= @product.name %></h1>

  <div x-data="{ showDetails: false }">
    <ytz-button @click="showDetails = !showDetails">
      Toggle Details
    </ytz-button>

    <ytz-disclosure x-ytz-disclosure="showDetails">
      <p><%= @product.description %></p>
    </ytz-disclosure>
  </div>
<% end %>
```

### Turbo Streams

Update components dynamically with Turbo Streams:

```erb
<%# app/views/notifications/create.turbo_stream.erb %>
<%= turbo_stream.append "notifications" do %>
  <ytz-snackbar open duration="5000">
    <%= @notification.message %>
  </ytz-snackbar>
<% end %>
```

## Alpine.js + Yetzirah Patterns

### Basic Two-Way Binding

Use `x-ytz:model` for form components:

```erb
<%# app/views/settings/_form.html.erb %>
<%= form_with model: @settings do |f| %>
  <div x-data="{ volume: <%= @settings.volume %> }">
    <label>Volume</label>
    <ytz-slider x-ytz:model="volume" min="0" max="100"></ytz-slider>
    <%= f.hidden_field :volume, "x-bind:value": "volume" %>
  </div>

  <div x-data="{ enabled: <%= @settings.notifications_enabled %> }">
    <label>Notifications</label>
    <ytz-toggle x-ytz:model="enabled"></ytz-toggle>
    <%= f.hidden_field :notifications_enabled, "x-bind:value": "enabled" %>
  </div>

  <%= f.submit "Save", data: { "ytz-button": true } %>
<% end %>
```

### Component Directives

Use specific directives for more control:

```erb
<div x-data="{ selectedTab: '<%= params[:tab] || 'overview' %>' }">
  <ytz-tabs x-ytz-tabs="selectedTab">
    <ytz-tab-list>
      <ytz-tab value="overview">Overview</ytz-tab>
      <ytz-tab value="details">Details</ytz-tab>
      <ytz-tab value="reviews">Reviews</ytz-tab>
    </ytz-tab-list>
    <ytz-tab-panel value="overview">
      <%= render "overview" %>
    </ytz-tab-panel>
    <ytz-tab-panel value="details">
      <%= render "details" %>
    </ytz-tab-panel>
    <ytz-tab-panel value="reviews">
      <%= render "reviews" %>
    </ytz-tab-panel>
  </ytz-tabs>
</div>
```

### $ytz Magic Methods

Use `$ytz` for programmatic control:

```erb
<div x-data>
  <ytz-button @click="$ytz.open('#settings-drawer')">
    Open Settings
  </ytz-button>

  <ytz-button @click="$ytz.toggleTheme()">
    Toggle Theme
  </ytz-button>

  <ytz-drawer id="settings-drawer" position="right">
    <%= render "settings/panel" %>
  </ytz-drawer>
</div>
```

## Common Patterns

### Modal Dialog

```erb
<%# app/views/shared/_dialog.html.erb %>
<% content_for :modals do %>
  <div x-data="{ open: false }">
    <ytz-button @click="open = true"><%= trigger_text %></ytz-button>

    <ytz-dialog x-ytz-dialog="open">
      <h2><%= title %></h2>
      <%= yield %>
      <div class="dialog-actions">
        <ytz-button variant="text" @click="open = false">Cancel</ytz-button>
        <ytz-button @click="open = false">Confirm</ytz-button>
      </div>
    </ytz-dialog>
  </div>
<% end %>
```

Usage:

```erb
<%= render "shared/dialog", trigger_text: "Delete Item", title: "Confirm Delete" do %>
  <p>Are you sure you want to delete this item?</p>
<% end %>
```

### Form with Select

```erb
<%# app/views/orders/_form.html.erb %>
<%= form_with model: @order do |f| %>
  <div x-data="{ country: '<%= @order.country %>' }">
    <label>Country</label>
    <ytz-select x-ytz:model="country">
      <ytz-option value="">Select a country</ytz-option>
      <% Country.all.each do |country| %>
        <ytz-option value="<%= country.code %>"><%= country.name %></ytz-option>
      <% end %>
    </ytz-select>
    <%= f.hidden_field :country, "x-bind:value": "country" %>
  </div>

  <%= f.submit "Save Order" %>
<% end %>
```

### Navigation Drawer with Turbo Frames

```erb
<%# app/views/layouts/_sidebar.html.erb %>
<div x-data="{ drawerOpen: false }">
  <ytz-button class="md:hidden" @click="drawerOpen = true">
    Menu
  </ytz-button>

  <ytz-drawer x-ytz-drawer="drawerOpen" position="left">
    <nav>
      <% @navigation_items.each do |item| %>
        <%= turbo_frame_tag "nav_#{item.id}" do %>
          <%= link_to item.name, item.path,
              data: { turbo_frame: "main_content" },
              "@click": "drawerOpen = false" %>
        <% end %>
      <% end %>
    </nav>
  </ytz-drawer>

  <%= turbo_frame_tag "main_content" do %>
    <%= yield %>
  <% end %>
</div>
```

### Snackbar Notifications from Flash

```erb
<%# app/views/layouts/application.html.erb %>
<body>
  <%= yield %>

  <% flash.each do |type, message| %>
    <% variant = type == "alert" ? "error" : "success" %>
    <ytz-snackbar open duration="5000" variant="<%= variant %>">
      <%= message %>
    </ytz-snackbar>
  <% end %>
</body>
```

### Autocomplete with Server Search

```erb
<%# app/views/search/_autocomplete.html.erb %>
<div x-data="{
  query: '',
  results: [],
  async search() {
    if (this.query.length < 2) return
    const response = await fetch(`/search?q=${encodeURIComponent(this.query)}`)
    this.results = await response.json()
  }
}">
  <ytz-autocomplete
    x-ytz:model="query"
    @input.debounce.300ms="search()"
    placeholder="Search...">
    <template x-for="result in results" :key="result.id">
      <ytz-option :value="result.id" x-text="result.name"></ytz-option>
    </template>
  </ytz-autocomplete>
</div>
```

## ViewComponent Integration

Wrap Yetzirah components in ViewComponents for reusability:

```ruby
# app/components/dialog_component.rb
class DialogComponent < ViewComponent::Base
  def initialize(title:, trigger_text:)
    @title = title
    @trigger_text = trigger_text
  end
end
```

```erb
<%# app/components/dialog_component.html.erb %>
<div x-data="{ open: false }">
  <ytz-button @click="open = true"><%= @trigger_text %></ytz-button>

  <ytz-dialog x-ytz-dialog="open">
    <h2><%= @title %></h2>
    <%= content %>
    <ytz-button @click="open = false">Close</ytz-button>
  </ytz-dialog>
</div>
```

Usage:

```erb
<%= render DialogComponent.new(title: "Settings", trigger_text: "Open Settings") do %>
  <p>Dialog content here</p>
<% end %>
```

## Stimulus Integration

For teams using Stimulus alongside Alpine, use `x-ytz-init` for interop:

```erb
<div data-controller="slider" x-data>
  <ytz-slider
    x-ytz-init="$dispatch('slider:ready')"
    data-slider-target="input"
    data-action="change->slider#update">
  </ytz-slider>
</div>
```

```js
// app/javascript/controllers/slider_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]

  update(event) {
    console.log("Slider value:", event.target.value)
  }
}
```

## Troubleshooting

### Components not initializing after Turbo navigation

Custom elements self-initialize, but if you see issues:

1. Ensure Alpine is started after Turbo loads
2. Check that `application.js` is loaded via `javascript_importmap_tags`

```erb
<%# app/views/layouts/application.html.erb %>
<head>
  <%= javascript_importmap_tags %>
</head>
```

### Alpine state lost on Turbo Frame update

Use `x-data` on elements outside the Turbo Frame, or use Alpine's `$persist` plugin:

```erb
<div x-data="{ count: $persist(0) }">
  <%= turbo_frame_tag "content" do %>
    <p x-text="count"></p>
  <% end %>
</div>
```

### Import map not resolving

Verify your `config/importmap.rb` pins are correct:

```bash
bin/importmap audit
```

---

See also:
- [CDN Usage Guide](./cdn-usage.md) - CDN loading strategies
- [Alpine.js Plugin](../packages/alpine/README.md) - Full directive reference
- [Vanilla Patterns](./vanilla-patterns.md) - Progressive enhancement patterns
