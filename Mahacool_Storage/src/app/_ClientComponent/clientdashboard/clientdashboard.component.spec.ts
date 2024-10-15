import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientdashboardComponent } from './clientdashboard.component';

describe('ClientdashboardComponent', () => {
  let component: ClientdashboardComponent;
  let fixture: ComponentFixture<ClientdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
