import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddsecurityComponent } from './addsecurity/addsecurity.component';
import { Security, SecurityService } from '../../../_Service/security.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-security',
  standalone: true,
  imports: [FormsModule,CommonModule,AddsecurityComponent ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css'
})
export class SecurityComponent {
  securitys: Security [] = [];

  constructor(private securityService:SecurityService){

  }
  searchTerm: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;

  // Define the options for items per page
  itemsPerPageOptions: number[] = [5, 10, 15, 20];

  get filteredsecuritys(){
    // Apply filtering first
    const filteredsecuritys = this. securitys.filter(security =>
      security.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      security.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Calculate the starting index for the current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    // Slice the filtered array for pagination
    return filteredsecuritys.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    // Use filtered  securitys length for total page calculation
    return Math.ceil(this. securitys.filter(security =>
      security.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      security.email.toLowerCase().includes(this.searchTerm.toLowerCase())
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



  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }



  ngOnInit(): void {
    this.getSecurity() ;
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


  deleteSecurity(managerId: string) {
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
        this.securityService.deleteSecurity(managerId).subscribe(
          () => {
            Swal.fire('Deleted!', 'The manager has been deleted.', 'success');
            this.getSecurity(); // Refresh the manager list after deletion
          },
          error => {
            Swal.fire('Error!', 'There was a problem deleting the manager.', 'error');
            console.error('There was an error deleting the manager!', error);
          }
        );
      }
    });
  }

}
