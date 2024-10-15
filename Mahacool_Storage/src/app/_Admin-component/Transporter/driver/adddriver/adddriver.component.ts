import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Driver, DriverService } from '../../../../_Service/driver.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-adddriver',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './adddriver.component.html',
  styleUrl: './adddriver.component.css'
})
export class AdddriverComponent {


  @Output() close = new EventEmitter<void>();
  @Output() driverAdded = new EventEmitter<void>(); // Emit this event when a manager is added
drivers: Driver[] = [];
  driverForm: FormGroup;

  constructor(private fb: FormBuilder,private driverservice:DriverService) {
    this.  driverForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }


  ngOnInit(): void {
    this.getDriver();
  }

  onSubmit() {
    if (this.  driverForm.valid) {
      Swal.fire({
        title: 'Please wait...',
        text: 'Submitting your request',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      this.driverservice.addDriver(this.  driverForm.value).subscribe(
        response => {
          Swal.close();
          console.log('Manager added successfully', response);
        // Emit event to notify parent component
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Manager added successfully',
            confirmButtonText: 'OK'
          });
          this. driverAdded.emit();
          this.closeModal();

        },
        error => {
          Swal.close();
          console.error('There was an error!', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.error?.msg || 'There was a problem with your request. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }

  getDriver() {
    this.driverservice.getDriver().subscribe(
      data => {
        this.drivers = data;
        console.log('Fetched drivers:', this.drivers);
      },
      error => {
        console.error('There was an error fetching drivers!', error);
      }
    );
  }

  closeModal() {
    this.close.emit(); // Emit the close event
  }}


