import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UplodgunnyboxComponent } from './uplodgunnybox.component';

describe('UplodgunnyboxComponent', () => {
  let component: UplodgunnyboxComponent;
  let fixture: ComponentFixture<UplodgunnyboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UplodgunnyboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UplodgunnyboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
