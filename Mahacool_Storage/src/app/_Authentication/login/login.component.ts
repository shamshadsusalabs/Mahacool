import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminService } from '../../_Service/admin.service';
import { ClientService } from '../../_Service/client.service';
import { ManagerService } from '../../_Service/manager.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private clientService: ClientService,
    private managerService: ManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailOrMobile: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['superadmin', [Validators.required]], // Set 'superadmin' as the default value
      remember: [false]
    });
  }


  onLogin(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      const selectedRole = loginData.role;
      this.isLoading = true;

      // Show a loading alert
      Swal.fire({
        title: 'Please wait',
        text: 'Logging in...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      let loginObservable;

      // Determine whether to use email, mobile, or customerID for login
      let email;
      let mobile;
      let customerID;

      if (selectedRole === 'client') {
        if (/^\d{10}$/.test(loginData.emailOrMobile)) {
          mobile = loginData.emailOrMobile; // 10-digit number as mobile
        } else if (/^\d{6}$/.test(loginData.emailOrMobile)) {
          customerID = loginData.emailOrMobile; // 6-digit number as customerID
        } else {
          email = loginData.emailOrMobile; // If not number, assume it's email
        }
      } else {
        email = loginData.emailOrMobile.includes('@') ? loginData.emailOrMobile : undefined;
        mobile = !email ? loginData.emailOrMobile : undefined;
      }

      // Determine which service to use based on the role
      switch (selectedRole) {
        case 'superadmin':
          loginObservable = this.adminService.login(loginData.password, email, mobile);
          break;
        case 'manager':
          loginObservable = this.managerService.login(loginData.password, email, mobile);
          break;
        case 'client':
          loginObservable = this.clientService.login(loginData.password, email, mobile, customerID);
          break;
        default:
          this.isLoading = false;
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Role not recognized',
            text: 'Please select a valid role.',
            confirmButtonText: 'OK'
          });
          return;
      }

      // Perform the login request
      loginObservable.subscribe(
        response => {
          console.log('Login successful', response);

          this.isLoading = false;
          Swal.close();

          // Save response to localStorage
          localStorage.setItem('user', JSON.stringify(response));

          // Show success alert
          Swal.fire({
            icon: 'success',
            title: 'Logged in successfully!',
            showConfirmButton: false,
            timer: 1500
          });

          // Navigate to the appropriate page based on the role
          let redirectUrl = '';
          switch (selectedRole) {
            case 'superadmin':
              redirectUrl = '/Admin';
              break;
            case 'manager':
              redirectUrl = '/Admin';
              break;
            case 'client':
              redirectUrl = '/Client';
              break;
          }

          this.router.navigate([redirectUrl]);
        },
        error => {
          console.error('Login failed', error);

          this.isLoading = false;
          Swal.close();

          // Show error alert
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: 'Invalid credentials. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      console.log('Form is invalid');

      // Show validation error alert
      Swal.fire({
        icon: 'warning',
        title: 'Invalid form',
        text: 'Please fill out the form correctly before submitting.',
        confirmButtonText: 'OK'
      });
    }
  }


  showResetModal = false;
  resetEmailOrMobile: string = '';
  openResetModal(): void {
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
  }

  onResetRequest(): void {
    let email: string | undefined;
    let mobile: string | undefined;
    let customerID: string | undefined;

    if (this.resetEmailOrMobile) {
      // Check if the input is an email (contains '@')
      if (this.resetEmailOrMobile.includes('@')) {
        email = this.resetEmailOrMobile;
        console.log('Email entered:', email);
      }
      // Check if the input is a 10-digit number (Mobile)
      else if (/^\d{10}$/.test(this.resetEmailOrMobile)) {
        mobile = this.resetEmailOrMobile;
        console.log('Mobile number entered:', mobile);
      }
      // Check if the input is a 6-digit number (Customer ID)
      else if (/^\d{6}$/.test(this.resetEmailOrMobile)) {
        customerID = this.resetEmailOrMobile;
        console.log('Customer ID entered:', customerID);
      }
      // If the input doesn't match any of the above conditions
      else {
        console.log('Invalid input:', this.resetEmailOrMobile);
        return; // Exit the method if the input is invalid
      }

      // Call the service method with the appropriate parameter
      this.clientService.passwordresetRequest(email, mobile, customerID).subscribe(
        (response: any) => {
          console.log('Response:', response);

          // Extract the _id from the response
          const clientId = response._id;

          if (clientId) {
            // Call the requestPasswordReset method with the extracted clientId
            this.clientService.requestPasswordReset(clientId).subscribe(
              () => {
                // Show SweetAlert success message
                Swal.fire({
                  title: 'Success!',
                  text: 'Your reset password request has been successfully sent. Please wait for an admin response. The admin will contact you soon.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
              },
              (error) => {
                console.log('Error during password reset request:', error);
                // Show SweetAlert error message
                Swal.fire({
                  title: 'Error!',
                  text: 'There was an error processing your password reset request. Please try again later.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            );
          } else {
            console.log('No client ID returned from the initial request');
            // Show SweetAlert error message if no client ID is returned
            Swal.fire({
              title: 'Error!',
              text: 'Failed to retrieve client ID. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        },
        (error) => {
          console.log('Error during initial request:', error);
          // Show SweetAlert error message
          Swal.fire({
            title: 'Error!',
            text: 'There was an error sending your reset password request. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      console.log('No input provided');
      // Show SweetAlert warning message for missing input
      Swal.fire({
        title: 'Warning!',
        text: 'Please provide an email, mobile number, or customer ID.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }

    // Close the modal after handling the input
    this.closeResetModal();
  }
}
