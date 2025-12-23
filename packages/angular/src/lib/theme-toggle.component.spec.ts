import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ThemeToggleComponent } from './theme-toggle.component'

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent
  let fixture: ComponentFixture<ThemeToggleComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(ThemeToggleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default theme value of light', () => {
    expect(component.theme).toBe('light')
  })

  it('should accept theme input', () => {
    component.theme = 'dark'
    fixture.detectChanges()
    expect(component.theme).toBe('dark')
  })

  it('should emit themeChange event', () => {
    const themeChangeSpy = jest.spyOn(component.themeChange, 'emit')
    const mockEvent = new CustomEvent('themechange', {
      detail: { theme: 'dark', isDark: true }
    })

    component['themeChangeHandler'](mockEvent)

    expect(themeChangeSpy).toHaveBeenCalled()
  })

  it('should emit correct event detail', () => {
    let emittedEvent: CustomEvent | null = null
    component.themeChange.subscribe((e: CustomEvent) => {
      emittedEvent = e
    })

    const mockEvent = new CustomEvent('themechange', {
      detail: { theme: 'dark', isDark: true }
    })

    component['themeChangeHandler'](mockEvent)

    expect(emittedEvent).toBeTruthy()
    expect((emittedEvent as any).detail.theme).toBe('dark')
    expect((emittedEvent as any).detail.isDark).toBe(true)
  })
})
