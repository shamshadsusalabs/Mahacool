import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfimRequestedWarehouseComponent } from './confim-requested-warehouse.component';

describe('ConfimRequestedWarehouseComponent', () => {
  let component: ConfimRequestedWarehouseComponent;
  let fixture: ComponentFixture<ConfimRequestedWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfimRequestedWarehouseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfimRequestedWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
