import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NotificationService } from '../../../_Service/notification.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-push-notification',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './push-notification.component.html',
  styleUrl: './push-notification.component.css'
})
export class PushNotificationComponent {
  notificationForm!: FormGroup;
  dryFruitOptions: string[] = [
    'Almonds', 'Cashews', 'Raisins', 'Walnuts', 'Pistachios',
    'Dried Apricots', 'Dates', 'Figs', 'Prunes', 'Brazil Nuts',
    'Pecans', 'Hazelnuts', 'Sunflower Seeds', 'Pumpkin Seeds',
    'Chia Seeds'
  ];

  constructor(private fb: FormBuilder, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationForm = this.fb.group({
      customerID: ['', Validators.required],  // Add id field
      message: ['', Validators.required],
      weight: [null, [Validators.required, Validators.min(1)]],
      dryFruitName: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.notificationForm.valid) {
      const {  customerID, message, weight, dryFruitName } = this.notificationForm.value;
      this.notificationService.addNotification( customerID, message, weight, dryFruitName)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Notification added successfully!',
            }).then(() => {
              this.notificationForm.reset();
            });
          },
          error: (err) => {
            console.error('Error adding notification:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add notification.',
            });
          }
        });
    }
  }
}
