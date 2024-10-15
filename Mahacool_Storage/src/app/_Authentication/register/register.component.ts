import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../_Service/client.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder, private clientService: ClientService,private router:Router) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: [''],
      password: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      gstNumber: ['',Validators.required],
      bussinessName:['',Validators.required]
    });
  }

  onRegister(): void {
    console.log(this.registrationForm.value);

    if (this.registrationForm.invalid) {
      const invalidField = Object.keys(this.registrationForm.controls).find(field => this.registrationForm.get(field)?.invalid);

      if (invalidField) {
        const fieldName = invalidField.charAt(0).toUpperCase() + invalidField.slice(1);
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: `${fieldName} is required`,
        });
      }

      return;
    }

    this.clientService.register(this.registrationForm.value).subscribe({
      next: (response) => {
        // Extract the customerID from the response
        const customerID = response.customerID;

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          html: `<p>Your account has been created successfully!</p><p>Please note down or take a screenshot of your Customer ID: <strong>${customerID}</strong></p>`,
          showCloseButton: true,  // Show close button
          timer: 30000,  // 30 seconds timer
          timerProgressBar: true,
        }).then(() => {
          this.router.navigate(['']);  // Navigate after the alert is closed or timed out
        });
      },
      error: (err) => {
        console.error('Registration error:', err);

        let errorMessage = 'Something went wrong, please try again.';

        // Handle different error structures
        if (err.error?.errors?.length) {
          // Validation errors array from server
          errorMessage = err.error.errors[0].msg;
        } else if (err.error?.msg) {
          // General error message from server
          errorMessage = err.error.msg;
        } else if (err.message) {
          // Fallback to general HTTP error message
          errorMessage = err.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: `Error: ${errorMessage}`,
        });
      }
    });
  }
}
