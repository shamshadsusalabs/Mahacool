import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Manager, ManagerService } from '../../../../_Service/manager.service';
@Component({
  selector: 'app-addmanager',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './addmanager.component.html',
  styleUrl: './addmanager.component.css'
})
export class AddmanagerComponent {

  @Output() close = new EventEmitter<void>();
  @Output() managerAdded = new EventEmitter<void>(); // Emit this event when a manager is added
  ManagerForm: FormGroup;
  managers: Manager[] = [];

  constructor(private fb: FormBuilder, private managerService: ManagerService) {
    this.ManagerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  ngOnInit(): void {
    this.getManager();
  }

  onSubmit() {
    if (this.ManagerForm.valid) {
      Swal.fire({
        title: 'Please wait...',
        text: 'Submitting your request',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      this.managerService.addManager(this.ManagerForm.value).subscribe(
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

  getManager() {
    this.managerService.getManager().subscribe(
      data => {
        this.managers = data;
        console.log('Fetched managers:', this.managers);
      },
      error => {
        console.error('There was an error fetching managers!', error);
      }
    );
  }

  closeModal() {
    this.close.emit(); // Emit the close event
  }}
