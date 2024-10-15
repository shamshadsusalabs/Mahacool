import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyClinetInviiceFormComponent } from './monthly-clinet-inviice-form.component';

describe('MonthlyClinetInviiceFormComponent', () => {
  let component: MonthlyClinetInviiceFormComponent;
  let fixture: ComponentFixture<MonthlyClinetInviiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyClinetInviiceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyClinetInviiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
