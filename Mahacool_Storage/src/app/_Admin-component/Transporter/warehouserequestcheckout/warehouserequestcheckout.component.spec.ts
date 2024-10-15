import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouserequestcheckoutComponent } from './warehouserequestcheckout.component';

describe('WarehouserequestcheckoutComponent', () => {
  let component: WarehouserequestcheckoutComponent;
  let fixture: ComponentFixture<WarehouserequestcheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouserequestcheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouserequestcheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
