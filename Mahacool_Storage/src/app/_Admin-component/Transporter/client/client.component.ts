import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddclientComponent } from './addclient/addclient.component';
import { Client, ClientService } from '../../../_Service/client.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-client',
  standalone: true,
  imports: [FormsModule,CommonModule,AddclientComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {
  clients: Client[] = [];

constructor(
  private clientService: ClientService,
  private router: Router
){

}


ngOnInit(): void {
  this.getClients();
}
  searchTerm: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;

  // Define the options for items per page
  itemsPerPageOptions: number[] = [5, 10, 15, 20];

  get filteredClients() {
    // Apply filtering first
    const filteredClients = this.clients.filter(client =>
      client.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Calculate the starting index for the current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    // Slice the filtered array for pagination
    return filteredClients.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    // Use filtered clients length for total page calculation
    return Math.ceil(this.clients.filter(client =>
      client.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
    ).length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  goToClientDetails(clientId: string) {
    this.router.navigate(['/Admin/client-details'], { queryParams: { id: clientId } });
  }



  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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
    // Show confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        this.clientService.deleteClient(clientId).subscribe(
          () => {
            Swal.fire('Deleted!', 'The client has been deleted.', 'success');
            this.getClients(); // Refresh the client list after deletion
          },
          error => {
            Swal.fire('Error!', 'There was a problem deleting the client.', 'error');
            console.error('There was an error deleting the client!', error);
          }
        );
      }
    });
  }
}
