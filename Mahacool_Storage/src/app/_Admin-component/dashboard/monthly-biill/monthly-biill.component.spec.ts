import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyBiillComponent } from './monthly-biill.component';

describe('MonthlyBiillComponent', () => {
  let component: MonthlyBiillComponent;
  let fixture: ComponentFixture<MonthlyBiillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyBiillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyBiillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
