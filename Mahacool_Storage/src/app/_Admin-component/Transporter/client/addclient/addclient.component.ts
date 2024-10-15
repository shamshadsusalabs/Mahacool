import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client, ClientService } from '../../../../_Service/client.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-addclient',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './addclient.component.html',
  styleUrl: './addclient.component.css'
})
export class AddclientComponent {
  @Output() close = new EventEmitter<void>();
  @Output() clientAdded = new EventEmitter<void>();
  clientForm: FormGroup;
  clients: Client[] = [];

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      bussinessName:['', [Validators.required, Validators.minLength(3)]],
      email: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gstNumber:[''],
      address:['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.getClients();
  }

  onSubmit() {
    if (this.clientForm.valid) {
      Swal.fire({
        title: 'Please wait...',
        text: 'Submitting your request',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.clientService.addClient(this.clientForm.value).subscribe(
        response => {
          Swal.close(); // Close the loader
          console.log('Client added successfully', response);
          this.closeModal();
          this.clientAdded.emit(); // Refresh the client list after adding a new client

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Client added successfully',
            confirmButtonText: 'OK'
          });
        },
        error => {
          Swal.close(); // Close the loader
          console.error('There was an error!', error);

          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.error?.msg || 'There was a problem with your request. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please fill out all required fields correctly.',
        confirmButtonText: 'OK'
      });
    }
  }

getClients() {
  this.clientService.getClients().subscribe(
    data => {
      this.clients = data;
      console.log('Fetched clients:', this.clients);
    },
    error => {
      console.error('There was an error fetching clients!', error);
    }
  );
}

deleteClient(clientId: string) {
  this.clientService.deleteClient(clientId).subscribe(
    () => {
      console.log('Client deleted successfully');
      this.getClients(); // Refresh the client list after deletion
    },
    error => {
      console.error('There was an error deleting the client!', error);
    }
  );
}

  closeModal() {
    this.close.emit(); // Emit the close event
  }}
