import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouserequestedcheckoutComponent } from './warehouserequestedcheckout.component';

describe('WarehouserequestedcheckoutComponent', () => {
  let component: WarehouserequestedcheckoutComponent;
  let fixture: ComponentFixture<WarehouserequestedcheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouserequestedcheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouserequestedcheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
