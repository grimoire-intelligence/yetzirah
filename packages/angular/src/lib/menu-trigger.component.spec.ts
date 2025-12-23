import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MenuTriggerComponent } from './menu-trigger.component'

describe('MenuTriggerComponent', () => {
  let component: MenuTriggerComponent
  let fixture: ComponentFixture<MenuTriggerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuTriggerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(MenuTriggerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
