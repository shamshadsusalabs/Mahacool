import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckINhistoryComponent } from './check-inhistory.component';

describe('CheckINhistoryComponent', () => {
  let component: CheckINhistoryComponent;
  let fixture: ComponentFixture<CheckINhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckINhistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckINhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
