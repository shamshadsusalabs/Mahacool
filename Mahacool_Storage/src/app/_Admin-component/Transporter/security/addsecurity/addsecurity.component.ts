import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Security, SecurityService } from '../../../../_Service/security.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-addsecurity',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './addsecurity.component.html',
  styleUrl: './addsecurity.component.css'
})
export class AddsecurityComponent {
  @Output() close = new EventEmitter<void>();
  @Output() managerAdded = new EventEmitter<void>(); // Emit this event when a manager is added

  securitys: Security [] = [];
  securityForm: FormGroup;

  constructor(private fb: FormBuilder,private securityService:SecurityService) {
    this.  securityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  ngOnInit(): void {
    this.getSecurity();
  }

  onSubmit() {
    if (this.securityForm.valid) {
      Swal.fire({
        title: 'Please wait...',
        text: 'Submitting your request',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      this.securityService.addManager(this.securityForm.value).subscribe(
        response => {
          Swal.close();
          console.log('Manager added successfully', response);
          this.closeModal();
          this.managerAdded.emit(); // Emit event to notify parent component
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Manager added successfully',
            confirmButtonText: 'OK'
          });
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

  getSecurity() {
    this.securityService.getSecurity().subscribe(
      data => {
        this.securitys= data;
        console.log('Fetched   securitys:', this.securitys);
      },
      error => {
        console.error('There was an error fetching   securitys!', error);
      }
    );
  }

  closeModal() {
    this.close.emit(); // Emit the close event
  }}
