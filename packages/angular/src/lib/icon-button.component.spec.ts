import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { IconButtonComponent } from './icon-button.component'

describe('IconButtonComponent', () => {
  let component: IconButtonComponent
  let fixture: ComponentFixture<IconButtonComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(IconButtonComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default empty label', () => {
    expect(component.label).toBe('')
  })

  it('should have default disabled value of false', () => {
    expect(component.disabled).toBe(false)
  })

  it('should accept label input', () => {
    component.label = 'Close'
    expect(component.label).toBe('Close')
  })

  it('should emit buttonClick event when clicked', () => {
    const clickSpy = jest.spyOn(component.buttonClick, 'emit')
    const mockEvent = new MouseEvent('click')

    component.onNativeClick(mockEvent)

    expect(clickSpy).toHaveBeenCalledWith(mockEvent)
  })

  it('should not emit buttonClick when disabled', () => {
    component.disabled = true
    const clickSpy = jest.spyOn(component.buttonClick, 'emit')
    const mockEvent = new MouseEvent('click')

    component.onNativeClick(mockEvent)

    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('should accept href input', () => {
    component.href = '/home'
    expect(component.href).toBe('/home')
  })
})
