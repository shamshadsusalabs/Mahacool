import { Component } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PasswordResetService } from '../../_Service/password-reset.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  resetForm: FormGroup;
  otpSent: boolean = false;
  message: string = '';
  error: string = '';

  constructor(private passwordResetService: PasswordResetService, private fb: FormBuilder,private router:Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    // Disable OTP and newPassword fields initially
    this.resetForm.controls['otp'].disable();
    this.resetForm.controls['newPassword'].disable();
    this.resetForm.controls['confirmPassword'].disable();
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(formGroup: FormGroup) {
    const { newPassword, confirmPassword } = formGroup.controls;
    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
  }

  // Method to request OTP
  requestOtp() {
    const email = this.resetForm.value.email;

    // Show SweetAlert2 loader
    Swal.fire({
      title: 'Please wait...',
      text: 'Sending OTP to your email.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.passwordResetService.requestOtp(email).subscribe(
      response => {
        this.otpSent = true;
        this.message = 'OTP sent to your email.';
        this.error = '';
        Swal.close(); // Close loader
        // Enable OTP, newPassword, and confirmPassword fields
        this.resetForm.controls['otp'].enable();
        this.resetForm.controls['newPassword'].enable();
        this.resetForm.controls['confirmPassword'].enable();
      },
      err => {
        this.error = err.error.msg || 'Error sending OTP';
        this.message = '';
        Swal.close(); // Close loader
      }
    );
  }

  // Method to reset password
  resetPassword() {
    if (this.resetForm.invalid) {
      return;
    }

    const { email, otp, newPassword } = this.resetForm.value;

    // Show SweetAlert2 loader
    Swal.fire({
      title: 'Please wait...',
      text: 'Resetting your password.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.passwordResetService.resetPassword(email, otp, newPassword).subscribe(
     ( response:any) => {
        this.message = 'Password reset successful';
        this.error = '';
        this.resetForm.reset();  // Clear form after successful password reset
        this.otpSent = false; // Reset form state
        Swal.close();
        this.router.navigate(['']);  // Close loader
      },
      (err:any) => {
        this.error = err.error.msg || 'Error resetting password';
        this.message = '';
        Swal.close(); // Close loader
      }
    );
  }
}
