import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdddriverComponent } from './adddriver/adddriver.component';
import Swal from 'sweetalert2';
import { Driver, DriverService } from '../../../_Service/driver.service';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [FormsModule,CommonModule,AdddriverComponent],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.css'
})
export class DriverComponent {
  drivers: Driver[] = [];

constructor(private driverservice:DriverService){

}
  searchTerm: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;

  // Define the options for items per page
  itemsPerPageOptions: number[] = [5, 10, 15, 20];

  get filtereddrivers() {
    // Apply filtering first
    const filtereddrivers = this.drivers.filter(driver =>
      driver.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Calculate the starting index for the current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    // Slice the filtered array for pagination
    return filtereddrivers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    // Use filtered drivers length for total page calculation
    return Math.ceil(this.drivers.filter(driver =>
      driver.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(this.searchTerm.toLowerCase())
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


  ngOnInit(): void {
    this.getDriver();
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }



  getDriver() {
    this.driverservice.getDriver().subscribe(
      data => {
        this.drivers = data;
        console.log('Fetched driverss:', this.drivers);
      },
      error => {
        console.error('There was an error fetching driverss!', error);
      }
    );
  }

  deleteDriver(managerId: string) {
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
        this.driverservice.deleteDriver(managerId).subscribe(
          () => {
            Swal.fire('Deleted!', 'The manager has been deleted.', 'success');
            this.getDriver(); // Refresh the manager list after deletion
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
