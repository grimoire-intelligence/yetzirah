import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core'
import { DataGridComponent } from './datagrid.component'

describe('DataGridComponent', () => {
  let component: DataGridComponent
  let fixture: ComponentFixture<DataGridComponent>

  const sampleData = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ]

  const sampleColumns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' }
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(DataGridComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default empty data array', () => {
    expect(component.data).toEqual([])
  })

  it('should have default empty columns array', () => {
    expect(component.columns).toEqual([])
  })

  it('should have default rowHeight of 40', () => {
    expect(component.rowHeight).toBe(40)
  })

  it('should have default virtualScroll of true', () => {
    expect(component.virtualScroll).toBe(true)
  })

  it('should accept data input', () => {
    component.data = sampleData
    fixture.detectChanges()
    expect(component.data).toEqual(sampleData)
  })

  it('should accept columns input', () => {
    component.columns = sampleColumns
    fixture.detectChanges()
    expect(component.columns).toEqual(sampleColumns)
  })

  it('should emit sort event', () => {
    const sortSpy = jest.spyOn(component.sort, 'emit')
    const mockEvent = new CustomEvent('sort', {
      detail: { field: 'name', direction: 'asc' }
    })

    component['sortHandler'](mockEvent)

    expect(sortSpy).toHaveBeenCalled()
  })

  it('should emit rowClick event', () => {
    const rowClickSpy = jest.spyOn(component.rowClick, 'emit')
    const mockEvent = new CustomEvent('rowselect', {
      detail: { row: sampleData[0], index: 0 }
    })

    component['rowClickHandler'](mockEvent)

    expect(rowClickSpy).toHaveBeenCalled()
  })

  it('should respond to data changes', () => {
    const syncDataSpy = jest.spyOn(component as any, 'syncData')

    component.ngOnChanges({
      data: new SimpleChange(null, sampleData, false)
    })

    expect(syncDataSpy).toHaveBeenCalled()
  })

  it('should respond to rowHeight changes', () => {
    const syncRowHeightSpy = jest.spyOn(component as any, 'syncRowHeight')

    component.ngOnChanges({
      rowHeight: new SimpleChange(40, 48, false)
    })

    expect(syncRowHeightSpy).toHaveBeenCalled()
  })
})
