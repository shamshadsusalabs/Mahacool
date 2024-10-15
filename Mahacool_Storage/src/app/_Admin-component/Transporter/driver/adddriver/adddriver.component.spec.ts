import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddriverComponent } from './adddriver.component';

describe('AdddriverComponent', () => {
  let component: AdddriverComponent;
  let fixture: ComponentFixture<AdddriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdddriverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdddriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
