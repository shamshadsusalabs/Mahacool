import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaghistoryComponent } from './baghistory.component';

describe('BaghistoryComponent', () => {
  let component: BaghistoryComponent;
  let fixture: ComponentFixture<BaghistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaghistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaghistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
