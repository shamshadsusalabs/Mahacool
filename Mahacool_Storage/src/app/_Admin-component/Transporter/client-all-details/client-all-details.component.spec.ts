import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAllDetailsComponent } from './client-all-details.component';

describe('ClientAllDetailsComponent', () => {
  let component: ClientAllDetailsComponent;
  let fixture: ComponentFixture<ClientAllDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAllDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAllDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
