import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../_Service/client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-request',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-request.component.html',
  styleUrls: ['./password-request.component.css']
})
export class PasswordRequestComponent implements OnInit {
  resetRequests: any[] = [];
  clients: any[] = [];
  paginatedClients: any[] = [];
  filteredClients: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 15, 20];
  totalPages: number = 1;
  isLoading: boolean = false;

  isModalOpen: boolean = false; // To control modal visibility
  selectedClientId: string | null = null; // Store the ID of the client being edited
  newPassword: string = ''; // Store the new password


  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.getResetRequests();
  }

  getResetRequests(): void {
    this.clientService.getAllResetRequests().subscribe(
      (data: any[]) => {
        this.resetRequests = data;
        console.log(data);
        const clientIds = data.map(request => request.clientId);
        this.fetchClientDataForRequests(clientIds);
      },
      (error) => {
        console.error('Error fetching reset requests:', error);
        // Optionally, show an error message to the user here
      }
    );
  }

  fetchClientDataForRequests(clientIds: string[]): void {
    this.clientService.getClientData(clientIds).subscribe(
      (clientsData: any[]) => {
        this.clients = clientsData;
        this.filterClients(); // Ensure clients are filtered and paginated
      },
      (error) => {
        console.error('Error fetching client data:', error);
        // Optionally, show an error message to the user here
      }
    );
  }

  filterClients(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.mobile.includes(term)
    );
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedClients = this.filteredClients.slice(start, end);
    this.totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
  }

  changeItemsPerPage(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openModal(clientId: string): void {
    this.selectedClientId = clientId;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.newPassword = '';
    this.selectedClientId = null;
  }

  updatePassword(): void {
    if (this.selectedClientId && this.newPassword) {
      const updateData = { password: this.newPassword };

      // First update the password
      this.clientService.updateClientPassword(this.selectedClientId, updateData).subscribe(
        (response) => {
          console.log('Password updated successfully:', response);

          // Show success message
          Swal.fire({
            title: 'Success!',
            text: 'Password has been updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Then mark the password as updated in the reset request
            this.clientService.markPasswordUpdated(this.selectedClientId!).subscribe(
              () => {
                console.log('Password reset request marked as updated');
                this.closeModal();
                this.filterClients(); // Refresh the client list
              },
              (error) => {
                console.error('Error marking password reset request as updated:', error);
              }
            );
          });
        },
        (error) => {
          console.error('Error updating password:', error);
        }
      );
    }
  }
}
