import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CinvoicesComponent } from './cinvoices.component';

describe('CinvoicesComponent', () => {
  let component: CinvoicesComponent;
  let fixture: ComponentFixture<CinvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CinvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
