import { Component } from '@angular/core';
import { Client, ClientService } from '../../_Service/client.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  clientDetails: Client | null = null;
  error: string | null = null;

  updatedDetails: any = {
    _id: '',
    name: '',
    password: '',
    bussinessName: '',
    email: '',
    mobile: '',
    address: '',
    gstNumber: '',
    image: ''
  };
  imagePreview: string | ArrayBuffer | null = null;
  isModalOpen = false;
  defaultImage = 'logo/Admin.png'; // Path to a default image if needed

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    // Retrieve ID from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const clientId = user._id; // Assuming `_id` is the ID in your user object

    if (clientId) {
      this.clientService.getClientDetails(clientId).subscribe(
        (data: Client) => {
          console.log(data);
          this.clientDetails = data;
          this.updatedDetails = { ...data }; // Initialize updatedDetails with fetched data
        },
        (error) => {
          console.error('Error fetching client details:', error);
          this.error = 'Failed to load client details. Please try again later.';
        }
      );
    } else {
      this.error = 'User ID not found in local storage.';
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.imagePreview = this.clientDetails?.image || this.defaultImage;
    this.updatedDetails = { ...this.clientDetails  } || this.updatedDetails; // Populate form with clientDetails or keep default
  }

  closeModal() {
    this.isModalOpen = false;
  }

  selectedFile: File | null = null; // Declare a property to hold the selected file

  onImageChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
          this.selectedFile = input.files[0]; // Store the selected file
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
              const result = e.target?.result;
              if (result) {
                  this.imagePreview = result as string | ArrayBuffer; // Display the image preview
              }
          };
          reader.readAsDataURL(this.selectedFile);
      }
  }

  onSubmit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const clientId = user._id; // Assuming `_id` is the ID in your user object

    const formData = new FormData();

    // Append updated details to FormData
    Object.keys(this.updatedDetails).forEach(key => {
      formData.append(key, this.updatedDetails[key]);
    });

    // Append the selected image file directly to FormData
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name); // Add the file directly
    }

    // Show SweetAlert loader while request is in progress
    Swal.fire({
      title: 'Updating...',
      text: 'Please wait while we update your details.',
      allowOutsideClick: false, // Disable clicking outside to close the alert
      didOpen: () => {
        Swal.showLoading(); // Show loading spinner
      }
    });

    // Perform the update request to your backend
    this.clientService.updateClientDetails(clientId, formData).subscribe(
      (data: any) => {
        Swal.close(); // Close the loader once response is received

        // Show SweetAlert success message
        Swal.fire({
          title: 'Success!',
          text: 'Your details have been successfully updated.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        this.closeModal();
        this.ngOnInit();
      },
      (error: any) => {
        Swal.close(); // Close the loader in case of an error

        // Show SweetAlert error message
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue updating your details. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });

        console.error(error);
      }
    );
  }
}
