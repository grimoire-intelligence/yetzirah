import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/**
 * YetzirahModule provides Angular integration for Yetzirah Web Components.
 *
 * This module uses CUSTOM_ELEMENTS_SCHEMA to support Web Components in Angular templates.
 * It follows Angular 16+ standalone component patterns but also provides a traditional
 * NgModule for apps that haven't migrated to standalone components.
 *
 * @example
 * // Import in your Angular module
 * import { YetzirahModule } from '@yetzirah/angular';
 *
 * @NgModule({
 *   imports: [YetzirahModule]
 * })
 * export class AppModule { }
 *
 * @example
 * // For standalone components, import the schema directly
 * import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 *
 * @Component({
 *   selector: 'app-root',
 *   standalone: true,
 *   schemas: [CUSTOM_ELEMENTS_SCHEMA],
 *   template: `<ytz-button>Click me</ytz-button>`
 * })
 * export class AppComponent { }
 */
@NgModule({
  imports: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class YetzirahModule {
  constructor() {
    // Ensure Web Components are loaded
    // The actual component definitions come from @yetzirah/core
    // which should be imported in your application's main.ts or index.html
    if (typeof window !== 'undefined' && !customElements.get('ytz-button')) {
      console.warn(
        '@yetzirah/angular: Web Components not detected. ' +
        'Make sure to import @yetzirah/core in your application:\n' +
        'import "@yetzirah/core";\n' +
        'Or include the CDN bundle in your index.html'
      );
    }
  }
}

/**
 * Standalone helper function for apps using Angular 16+ standalone components.
 * Returns the CUSTOM_ELEMENTS_SCHEMA for use in standalone component schemas.
 *
 * @example
 * import { Component } from '@angular/core';
 * import { provideYetzirah } from '@yetzirah/angular';
 *
 * @Component({
 *   selector: 'app-root',
 *   standalone: true,
 *   schemas: [provideYetzirah()],
 *   template: `<ytz-button>Click me</ytz-button>`
 * })
 * export class AppComponent { }
 */
export function provideYetzirah() {
  return CUSTOM_ELEMENTS_SCHEMA;
}
