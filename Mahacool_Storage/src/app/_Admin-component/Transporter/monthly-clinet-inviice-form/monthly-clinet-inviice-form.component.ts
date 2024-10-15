import { Component } from '@angular/core';
import { InvoiceService } from '../../../_Service/invoice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-monthly-clinet-inviice-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './monthly-clinet-inviice-form.component.html',
  styleUrls: ['./monthly-clinet-inviice-form.component.css']
})
export class MonthlyClinetInviiceFormComponent {
  customerId: string = '';
  paidAmount: number | null = null;

  constructor(private invoiceService: InvoiceService) { }

  onSubmit() {
    if (this.customerId && this.paidAmount) {
      // Show loading alert
      Swal.fire({
        title: 'Updating...',
        text: 'Please wait while we update the payment.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        }
      });

      this.invoiceService.updatePaidTotals(this.customerId, this.paidAmount).subscribe({
        next: (response) => {
          // Close the loading alert
          Swal.close();
          // Display success alert
          Swal.fire({
            icon: 'success',
            title: 'Payment Updated',
            text: 'The payment was successfully updated!',
          });
          this.customerId = '';
          this.paidAmount = null;
          console.log(response);
        },
        error: (error) => {
          // Close the loading alert
          Swal.close();
          // Display error alert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update the payment. Please try again.',
          });
          console.error('Error updating payment', error);
        }
      });
    } else {
      // Display validation error alert
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill out all fields before submitting.',
      });
    }
  }
}
