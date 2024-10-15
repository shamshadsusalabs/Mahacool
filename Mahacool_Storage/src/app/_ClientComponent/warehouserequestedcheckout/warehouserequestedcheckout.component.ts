import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseCheckoutrequestService } from '../../_Service/warehouse-checkoutrequest.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-warehouserequestedcheckout',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './warehouserequestedcheckout.component.html',
  styleUrl: './warehouserequestedcheckout.component.css'
})
export class WarehouserequestedcheckoutComponent {
  checkoutForm: FormGroup;
  customerData: any = {};
  dryFruitOptions: string[] = [
    'Almonds', 'Cashews', 'Raisins', 'Walnuts', 'Pistachios',
    'Dried Apricots', 'Dates', 'Figs', 'Prunes', 'Brazil Nuts',
    'Pecans', 'Hazelnuts', 'Sunflower Seeds', 'Pumpkin Seeds',
    'Chia Seeds'
  ];

  constructor(
    private fb: FormBuilder,
    private checkoutService: WarehouseCheckoutrequestService
  ) {
    this.checkoutForm = this.fb.group({
      dryFruitName: ['', Validators.required],
      cityName: ['', Validators.required],
      warehouseName: ['', Validators.required],
      weight: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Safely handle localStorage data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.customerData = JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
        this.customerData = {};
      }
    }

    this.customerData = {
      customerId: this.customerData.customerID || '',
      name: this.customerData.name || '',
      email: this.customerData.email || '',
      mobile: this.customerData.mobile || ''
    };
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const formData = {
        ...this.customerData, // Spread existing customer data
        ...this.checkoutForm.value // Add form values
      };

      this.checkoutService.checkout(formData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Data submitted successfully!',
            confirmButtonText: 'OK'
          });
        },
        error: (error) => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'There was an error submitting the data. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        confirmButtonText: 'OK'
      });
    }
  }
}
