import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ChipComponent } from './chip.component'

describe('ChipComponent', () => {
  let component: ChipComponent
  let fixture: ComponentFixture<ChipComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(ChipComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default deletable value of false', () => {
    expect(component.deletable).toBe(false)
  })

  it('should have default disabled value of false', () => {
    expect(component.disabled).toBe(false)
  })

  it('should emit delete event', () => {
    const deleteSpy = jest.spyOn(component.delete, 'emit')
    const mockEvent = new CustomEvent('delete', { detail: { chip: {} } })

    component['deleteHandler'](mockEvent)

    expect(deleteSpy).toHaveBeenCalled()
  })

  it('should accept deletable input', () => {
    component.deletable = true
    fixture.detectChanges()
    expect(component.deletable).toBe(true)
  })

  it('should accept disabled input', () => {
    component.disabled = true
    fixture.detectChanges()
    expect(component.disabled).toBe(true)
  })
})
