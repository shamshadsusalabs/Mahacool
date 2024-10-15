import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseRequestedComponent } from './warehouse-requested.component';

describe('WarehouseRequestedComponent', () => {
  let component: WarehouseRequestedComponent;
  let fixture: ComponentFixture<WarehouseRequestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseRequestedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
