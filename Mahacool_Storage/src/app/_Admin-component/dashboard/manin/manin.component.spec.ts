import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManinComponent } from './manin.component';

describe('ManinComponent', () => {
  let component: ManinComponent;
  let fixture: ComponentFixture<ManinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
