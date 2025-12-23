import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MenuComponent } from './menu.component'

describe('MenuComponent', () => {
  let component: MenuComponent
  let fixture: ComponentFixture<MenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(MenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default open value of false', () => {
    expect(component.open).toBe(false)
  })

  it('should have default placement value of bottom-start', () => {
    expect(component.placement).toBe('bottom-start')
  })

  it('should emit openEvent on open', () => {
    const openSpy = jest.spyOn(component.openEvent, 'emit')
    const mockEvent = new CustomEvent('open')

    component['openHandler'](mockEvent)

    expect(openSpy).toHaveBeenCalledWith(mockEvent)
  })

  it('should emit closeEvent on close', () => {
    const closeSpy = jest.spyOn(component.closeEvent, 'emit')
    const mockEvent = new CustomEvent('close')

    component['closeHandler'](mockEvent)

    expect(closeSpy).toHaveBeenCalledWith(mockEvent)
  })

  it('should accept open input', () => {
    component.open = true
    fixture.detectChanges()
    expect(component.open).toBe(true)
  })

  it('should accept placement input', () => {
    component.placement = 'top-end'
    fixture.detectChanges()
    expect(component.placement).toBe('top-end')
  })
})
