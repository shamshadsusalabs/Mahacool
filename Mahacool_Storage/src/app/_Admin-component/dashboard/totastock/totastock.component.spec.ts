import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotastockComponent } from './totastock.component';

describe('TotastockComponent', () => {
  let component: TotastockComponent;
  let fixture: ComponentFixture<TotastockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotastockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotastockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
