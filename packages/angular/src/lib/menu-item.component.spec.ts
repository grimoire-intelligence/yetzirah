import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MenuItemComponent } from './menu-item.component'

describe('MenuItemComponent', () => {
  let component: MenuItemComponent
  let fixture: ComponentFixture<MenuItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(MenuItemComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default disabled value of false', () => {
    expect(component.disabled).toBe(false)
  })

  it('should emit select event', () => {
    const selectSpy = jest.spyOn(component.select, 'emit')
    const mockEvent = new CustomEvent('select', { detail: { value: 'test' } })

    component['selectHandler'](mockEvent)

    expect(selectSpy).toHaveBeenCalledWith(mockEvent)
  })

  it('should accept value input', () => {
    component.value = 'edit'
    fixture.detectChanges()
    expect(component.value).toBe('edit')
  })

  it('should accept disabled input', () => {
    component.disabled = true
    fixture.detectChanges()
    expect(component.disabled).toBe(true)
  })
})
