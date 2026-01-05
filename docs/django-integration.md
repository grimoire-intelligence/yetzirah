# Django Integration Guide

Integrate Yetzirah Web Components with Django applications using HTMX for dynamic interactions.

## Quick Start

Add Yetzirah via CDN in your base template:

```html
{% load static %}
<!DOCTYPE html>
<html>
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
<body>
    {% block content %}{% endblock %}
</body>
</html>
```

Use components in any template:

```html
<ytz-button>Hello from Django!</ytz-button>
```

## Installation

### Option 1: CDN (Recommended)

The simplest approach - no build step required:

```html
{# templates/base.html #}
{% load static %}
<!DOCTYPE html>
<html>
<head>
    <script type="importmap">
    {
        "imports": {
            "@grimoire/yetzirah-core": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js",
            "@grimoire/yetzirah-alpine": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-alpine@latest/dist/index.js",
            "alpinejs": "https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js",
            "htmx.org": "https://cdn.jsdelivr.net/npm/htmx.org@2/dist/htmx.min.js"
        }
    }
    </script>
    <script type="module">
        import Alpine from 'alpinejs'
        import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
        import '@grimoire/yetzirah-core'
        import 'htmx.org'

        Alpine.plugin(yetzirahPlugin)
        window.Alpine = Alpine
        Alpine.start()
    </script>
</head>
<body hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
    {% block content %}{% endblock %}
</body>
</html>
```

### Option 2: Self-Hosted via collectstatic

Download and serve from your static files:

```bash
# Download to your static directory
mkdir -p static/js/vendor
curl -o static/js/vendor/yetzirah-core.js https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js
curl -o static/js/vendor/yetzirah-alpine.js https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-alpine@latest/dist/index.js
curl -o static/js/vendor/alpine.js https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js
```

Update your template:

```html
{% load static %}
<script type="importmap">
{
    "imports": {
        "@grimoire/yetzirah-core": "{% static 'js/vendor/yetzirah-core.js' %}",
        "@grimoire/yetzirah-alpine": "{% static 'js/vendor/yetzirah-alpine.js' %}",
        "alpinejs": "{% static 'js/vendor/alpine.js' %}"
    }
}
</script>
```

### Option 3: npm + Bundler

For projects using a bundler (webpack, Vite, etc.):

```bash
npm install @grimoire/yetzirah-core @grimoire/yetzirah-alpine alpinejs htmx.org
```

```js
// static/js/app.js
import Alpine from 'alpinejs'
import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
import '@grimoire/yetzirah-core'
import 'htmx.org'

Alpine.plugin(yetzirahPlugin)
window.Alpine = Alpine
Alpine.start()
```

### WhiteNoise for Production

For production with WhiteNoise:

```python
# settings.py
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # ...
]
```

## HTMX Integration

HTMX provides server-driven interactivity that pairs well with Yetzirah components.

### Basic HTMX Setup

Add HTMX and configure CSRF:

```html
{# templates/base.html #}
<body hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
    {% block content %}{% endblock %}
</body>
```

### Partial Updates with Components

```html
{# templates/products/list.html #}
<div id="product-list">
    {% for product in products %}
        <div class="product-card">
            <h3>{{ product.name }}</h3>
            <ytz-button
                hx-get="{% url 'product_detail' product.id %}"
                hx-target="#product-modal-content"
                hx-trigger="click"
                @click="$ytz.open('#product-modal')">
                View Details
            </ytz-button>
        </div>
    {% endfor %}
</div>

<div x-data="{ open: false }">
    <ytz-dialog id="product-modal" x-ytz-dialog="open">
        <div id="product-modal-content">
            <!-- Content loaded via HTMX -->
        </div>
        <ytz-button @click="open = false">Close</ytz-button>
    </ytz-dialog>
</div>
```

```python
# views.py
def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'products/detail_partial.html', {'product': product})
```

### hx-swap with Custom Elements

Use `innerHTML` swap for updating component content:

```html
{# templates/notifications/list.html #}
<div id="notifications"
     hx-get="{% url 'notifications_list' %}"
     hx-trigger="every 30s"
     hx-swap="innerHTML">
    {% for notification in notifications %}
        <ytz-chip removable>{{ notification.message }}</ytz-chip>
    {% endfor %}
</div>
```

### Server-Controlled Dialog State

Open dialogs from server responses using HTMX events:

```html
{# templates/components/dialog.html #}
<div x-data="{ open: false }"
     @open-dialog.window="if ($event.detail.id === '{{ dialog_id }}') open = true">
    <ytz-dialog x-ytz-dialog="open">
        {% block content %}{% endblock %}
    </ytz-dialog>
</div>
```

```python
# views.py
from django.http import HttpResponse

def create_item(request):
    # ... create item ...
    response = HttpResponse()
    response['HX-Trigger'] = json.dumps({'open-dialog': {'id': 'success-dialog'}})
    return response
```

### Out-of-Band Swaps for Notifications

Update multiple areas with a single response:

```html
{# templates/items/create_response.html #}
{# Main content swap #}
<div id="item-list">
    {% for item in items %}
        <div>{{ item.name }}</div>
    {% endfor %}
</div>

{# Out-of-band notification #}
<ytz-snackbar id="notification" hx-swap-oob="true" open duration="5000">
    Item created successfully!
</ytz-snackbar>
```

## Common Patterns

### Modal Dialog

```html
{# templates/components/modal.html #}
{% load yetzirah_tags %}

<div x-data="{ open: {{ open|yesno:'true,false' }} }">
    {% if trigger %}
        <ytz-button @click="open = true">{{ trigger }}</ytz-button>
    {% endif %}

    <ytz-dialog x-ytz-dialog="open">
        <header>
            <h2>{{ title }}</h2>
            <ytz-button variant="text" @click="open = false">&times;</ytz-button>
        </header>
        <div class="modal-body">
            {% block content %}{% endblock %}
        </div>
        {% block footer %}{% endblock %}
    </ytz-dialog>
</div>
```

Usage with inclusion tag:

```python
# templatetags/yetzirah_tags.py
from django import template

register = template.Library()

@register.inclusion_tag('components/modal.html')
def modal(title, trigger=None, open=False):
    return {'title': title, 'trigger': trigger, 'open': open}
```

```html
{% load yetzirah_tags %}
{% modal title="Confirm Delete" trigger="Delete Item" %}
    {% block content %}
        <p>Are you sure you want to delete this item?</p>
    {% endblock %}
    {% block footer %}
        <ytz-button hx-delete="{% url 'delete_item' item.id %}">
            Confirm
        </ytz-button>
    {% endblock %}
{% endmodal %}
```

### Form with HTMX Submission

```html
{# templates/contacts/form.html #}
<form hx-post="{% url 'contact_create' %}"
      hx-target="#form-container"
      hx-swap="outerHTML">
    {% csrf_token %}

    <div x-data="{ subject: '{{ form.subject.value|default:'' }}' }">
        <label>Subject</label>
        <ytz-select x-ytz:model="subject" name="subject">
            <ytz-option value="">Select a subject</ytz-option>
            <ytz-option value="support">Support</ytz-option>
            <ytz-option value="sales">Sales</ytz-option>
            <ytz-option value="other">Other</ytz-option>
        </ytz-select>
        <input type="hidden" name="subject" x-bind:value="subject">
        {% if form.subject.errors %}
            <span class="error">{{ form.subject.errors.0 }}</span>
        {% endif %}
    </div>

    <div>
        <label>Message</label>
        <textarea name="message">{{ form.message.value|default:'' }}</textarea>
        {% if form.message.errors %}
            <span class="error">{{ form.message.errors.0 }}</span>
        {% endif %}
    </div>

    <ytz-button type="submit">Send</ytz-button>
</form>
```

### Search Autocomplete with HTMX Backend

```html
{# templates/search/autocomplete.html #}
<div x-data="{ query: '', showResults: false }">
    <ytz-autocomplete
        x-ytz:model="query"
        hx-get="{% url 'search_autocomplete' %}"
        hx-trigger="input changed delay:300ms"
        hx-target="#search-results"
        hx-vals='js:{q: document.querySelector("[x-ytz\\:model=query]").value}'
        @focus="showResults = true"
        @blur="setTimeout(() => showResults = false, 200)"
        placeholder="Search...">
    </ytz-autocomplete>

    <div id="search-results" x-show="showResults && query.length >= 2">
        <!-- Results loaded via HTMX -->
    </div>
</div>
```

```python
# views.py
def search_autocomplete(request):
    query = request.GET.get('q', '')
    results = Product.objects.filter(name__icontains=query)[:10]
    return render(request, 'search/results_partial.html', {'results': results})
```

```html
{# templates/search/results_partial.html #}
{% for result in results %}
    <ytz-option value="{{ result.id }}">{{ result.name }}</ytz-option>
{% empty %}
    <div class="no-results">No results found</div>
{% endfor %}
```

### Sidebar Navigation with hx-boost

```html
{# templates/layouts/sidebar.html #}
<div x-data="{ sidebarOpen: false }">
    <ytz-button class="md:hidden" @click="sidebarOpen = true">
        Menu
    </ytz-button>

    <ytz-drawer x-ytz-drawer="sidebarOpen" position="left">
        <nav hx-boost="true">
            {% for item in navigation %}
                <a href="{{ item.url }}"
                   @click="sidebarOpen = false"
                   class="{% if request.path == item.url %}active{% endif %}">
                    {{ item.label }}
                </a>
            {% endfor %}
        </nav>
    </ytz-drawer>

    <main id="main-content">
        {% block content %}{% endblock %}
    </main>
</div>
```

### Django Messages as Snackbar Notifications

```html
{# templates/base.html #}
{% if messages %}
    {% for message in messages %}
        <ytz-snackbar open duration="5000"
                      variant="{% if message.tags == 'error' %}error{% elif message.tags == 'success' %}success{% else %}info{% endif %}">
            {{ message }}
        </ytz-snackbar>
    {% endfor %}
{% endif %}
```

### Tabs with URL State

```html
{# templates/products/detail.html #}
<div x-data="{ activeTab: '{{ request.GET.tab|default:'overview' }}' }">
    <ytz-tabs x-ytz-tabs="activeTab">
        <ytz-tab-list>
            <ytz-tab value="overview"
                     hx-get="{% url 'product_detail' product.id %}?tab=overview"
                     hx-target="#tab-content"
                     hx-push-url="true">
                Overview
            </ytz-tab>
            <ytz-tab value="specs"
                     hx-get="{% url 'product_detail' product.id %}?tab=specs"
                     hx-target="#tab-content"
                     hx-push-url="true">
                Specifications
            </ytz-tab>
            <ytz-tab value="reviews"
                     hx-get="{% url 'product_detail' product.id %}?tab=reviews"
                     hx-target="#tab-content"
                     hx-push-url="true">
                Reviews
            </ytz-tab>
        </ytz-tab-list>

        <div id="tab-content">
            {% include 'products/tabs/'|add:active_tab|add:'.html' %}
        </div>
    </ytz-tabs>
</div>
```

## Template Tags

Create custom template tags for common components:

```python
# templatetags/yetzirah_tags.py
from django import template
from django.utils.safestring import mark_safe
import json

register = template.Library()

@register.simple_tag
def ytz_button(text, **attrs):
    attr_str = ' '.join(f'{k}="{v}"' for k, v in attrs.items())
    return mark_safe(f'<ytz-button {attr_str}>{text}</ytz-button>')

@register.inclusion_tag('components/select.html')
def ytz_select(name, choices, value=None, placeholder=None):
    return {
        'name': name,
        'choices': choices,
        'value': value,
        'placeholder': placeholder,
    }

@register.simple_tag
def alpine_data(data):
    """Convert Python dict to Alpine x-data attribute."""
    return mark_safe(f"x-data='{json.dumps(data)}'")
```

```html
{# templates/components/select.html #}
<div x-data="{ selected: '{{ value|default:'' }}' }">
    <ytz-select x-ytz:model="selected">
        {% if placeholder %}
            <ytz-option value="">{{ placeholder }}</ytz-option>
        {% endif %}
        {% for choice_value, choice_label in choices %}
            <ytz-option value="{{ choice_value }}">{{ choice_label }}</ytz-option>
        {% endfor %}
    </ytz-select>
    <input type="hidden" name="{{ name }}" x-bind:value="selected">
</div>
```

Usage:

```html
{% load yetzirah_tags %}

{% ytz_button "Click Me" variant="primary" %}

{% ytz_select "country" countries value=form.country.value placeholder="Select country" %}
```

## Django Forms Integration

```python
# forms.py
class ContactForm(forms.Form):
    subject = forms.ChoiceField(choices=[
        ('', 'Select a subject'),
        ('support', 'Support'),
        ('sales', 'Sales'),
    ])
    priority = forms.IntegerField(min_value=1, max_value=5, initial=3)
    urgent = forms.BooleanField(required=False)
```

```html
{# templates/contact/form.html #}
<form method="post">
    {% csrf_token %}

    <div x-data="{ subject: '{{ form.subject.value|default:'' }}' }">
        <label>{{ form.subject.label }}</label>
        <ytz-select x-ytz:model="subject">
            {% for value, label in form.subject.field.choices %}
                <ytz-option value="{{ value }}">{{ label }}</ytz-option>
            {% endfor %}
        </ytz-select>
        <input type="hidden" name="subject" x-bind:value="subject">
    </div>

    <div x-data="{ priority: {{ form.priority.value|default:3 }} }">
        <label>{{ form.priority.label }}: <span x-text="priority"></span></label>
        <ytz-slider x-ytz:model="priority" min="1" max="5"></ytz-slider>
        <input type="hidden" name="priority" x-bind:value="priority">
    </div>

    <div x-data="{ urgent: {{ form.urgent.value|yesno:'true,false' }} }">
        <label>{{ form.urgent.label }}</label>
        <ytz-toggle x-ytz:model="urgent"></ytz-toggle>
        <input type="hidden" name="urgent" x-bind:value="urgent">
    </div>

    <ytz-button type="submit">Submit</ytz-button>
</form>
```

## Troubleshooting

### CSRF token not sent with HTMX requests

Add the token to the body element:

```html
<body hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
```

Or use a meta tag:

```html
<meta name="csrf-token" content="{{ csrf_token }}">
<script>
document.body.addEventListener('htmx:configRequest', (e) => {
    e.detail.headers['X-CSRFToken'] = document.querySelector('meta[name="csrf-token"]').content
})
</script>
```

### Components not updating after HTMX swap

Custom elements automatically initialize. If issues persist, trigger a re-process:

```html
<div hx-get="/content" hx-swap="innerHTML" hx-on::after-swap="htmx.process(this)">
</div>
```

### Alpine state lost after HTMX swap

Keep `x-data` on elements outside the swap target:

```html
<div x-data="{ open: false }">
    <div id="swap-target" hx-get="/content">
        <!-- This content will be swapped, but Alpine state persists -->
    </div>
    <ytz-dialog x-ytz-dialog="open">...</ytz-dialog>
</div>
```

### Import map not working in older browsers

Add the es-module-shims polyfill:

```html
<script async src="https://ga.jspm.io/npm:es-module-shims@1.10.0/dist/es-module-shims.js"></script>
<script type="importmap">
{...}
</script>
```

---

See also:
- [CDN Usage Guide](./cdn-usage.md) - CDN loading strategies
- [Alpine.js Plugin](../packages/alpine/README.md) - Full directive reference
- [Vanilla Patterns](./vanilla-patterns.md) - Progressive enhancement patterns
