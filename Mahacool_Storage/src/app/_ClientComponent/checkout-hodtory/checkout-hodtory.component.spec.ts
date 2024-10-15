import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutHodtoryComponent } from './checkout-hodtory.component';

describe('CheckoutHodtoryComponent', () => {
  let component: CheckoutHodtoryComponent;
  let fixture: ComponentFixture<CheckoutHodtoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutHodtoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutHodtoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
