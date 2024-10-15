import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGunnyBagComponent } from './add-gunny-bag.component';

describe('AddGunnyBagComponent', () => {
  let component: AddGunnyBagComponent;
  let fixture: ComponentFixture<AddGunnyBagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGunnyBagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGunnyBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
