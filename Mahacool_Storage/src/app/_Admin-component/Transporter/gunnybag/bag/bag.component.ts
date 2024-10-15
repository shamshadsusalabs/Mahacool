import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GunnyBagService } from '../../../../_Service/gunny-bag.service';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AddGunnyBagComponent } from '../add-gunny-bag/add-gunny-bag.component';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import Swal from 'sweetalert2';

interface DryFruit {
  cityName: string;
  warehouseName: string;
  rackName: string;
  dateCheckIN: string;
  name: string;
  recordId: string;
  typeOfSack: string;
  weight: number;
  customerId: string;
  _id: string; // Added _id here
}

interface CheckInHistory {
  dryFruits: DryFruit[];
  _id: string;
}

interface Item {
  _id: string;
  checkInHistory: CheckInHistory[];
  checkOutHistory: any[];
  customerId: string;
  totalWeightByFruit: Record<string, number>;
}

@Component({
  selector: 'app-bag',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, RouterModule, AddGunnyBagComponent, QrCodeComponent],
  templateUrl: './bag.component.html',
  styleUrls: ['./bag.component.css']
})
export class BagComponent implements OnInit {
  items: Item[] = []; // All items fetched from the service
  filteredItems: DryFruit[] = []; // Items after filtering
  paginatedItems: DryFruit[] = []; // Items for the current page
  selectedDate: string | null = null; // Date picker value
  searchTerm: string = ''; // Search bar value
  currentPage: number = 1; // Current pagination page
  itemsPerPage: number = 10; // Items to show per page
  dryFruitsArray: DryFruit[] = []; // Store all dry fruits

  constructor(private gunnyBagService: GunnyBagService) {}

  ngOnInit() {
    this.fetchData(); // Fetch data on component initialization
  }

  fetchData() {
    Swal.fire({
      title: 'Fetching data...',
      text: 'Please wait while the data is being fetched.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.gunnyBagService.getAllCustomerHistories().subscribe({
      next: (data) => {
        this.items = data;
        console.log(this.items);
        this.processDryFruits(data); // Populate dryFruitsArray
        this.filteredItems = this.dryFruitsArray; // Set filtered items to dryFruitsArray
        this.updatePaginatedItems(); // Update pagination on fetch
        Swal.close();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Fetch Data',
          text: 'An error occurred while fetching the data. Please try again.',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  processDryFruits(data: Item[]) {
    const allDryFruits: DryFruit[] = [];

    // Extracting dry fruits from checkInHistory
    data.forEach(item => {
      item.checkInHistory.forEach((checkIn: CheckInHistory) => {
        checkIn.dryFruits.forEach(dryFruit => {
          allDryFruits.push({
            cityName: dryFruit.cityName,
            warehouseName: dryFruit.warehouseName,
            rackName: dryFruit.rackName,
            dateCheckIN: dryFruit.dateCheckIN,
            name: dryFruit.name,
            recordId: dryFruit.recordId,
            typeOfSack: dryFruit.typeOfSack,
            weight: dryFruit.weight,
            customerId: item.customerId,
            _id: dryFruit._id // Ensure _id is included
          });
        });
      });
    });

    // Sorting dry fruits by dateCheckIN (latest first)
    this.dryFruitsArray = allDryFruits.sort((a, b) =>
      new Date(b.dateCheckIN).getTime() - new Date(a.dateCheckIN).getTime()
    );
    this.filteredItems = this.dryFruitsArray;
    console.log(this.filteredItems);// Initialize filtered items
  }

  filterDataByDate() {
    if (this.selectedDate) {
      this.filteredItems = this.dryFruitsArray.filter(dryFruit =>
        new Date(dryFruit.dateCheckIN).toISOString().split('T')[0] === this.selectedDate
      );
    } else {
      this.filteredItems = this.dryFruitsArray; // No date selected, show all items
    }
    this.currentPage = 1; // Reset to first page after filtering
    this.updatePaginatedItems(); // Update pagination after filtering
  }

  searchData() {
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    this.filteredItems = this.dryFruitsArray.filter(dryFruit =>
      dryFruit.cityName.toLowerCase().includes(lowerCaseTerm) ||
      dryFruit.warehouseName.toLowerCase().includes(lowerCaseTerm) ||
      dryFruit.rackName.toLowerCase().includes(lowerCaseTerm) ||
      dryFruit.customerId.toLowerCase().includes(lowerCaseTerm)
    );
    this.currentPage = 1; // Reset to first page after searching
    this.updatePaginatedItems(); // Update pagination after searching
  }

  // Pagination methods
  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedItems = this.filteredItems.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedItems();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedItems();
    }
  }

  get totalPages() {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  // Modal control methods
  openAddModalis = false;
  openAddModal() {
    this.openAddModalis = true;
  }

  closeModalAdd() {
    this.openAddModalis = false;
  }

  isModalOpen = false;
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  deleteDryFruitRecord(customerId: string, recordId: string): void {
    console.log(customerId, recordId);

    this.gunnyBagService.deleteDryFruit(customerId, recordId)
      .subscribe(
        response => {
          console.log('Dry fruit deleted successfully', response);
          // Update your data list by filtering out the deleted item
          this.filteredItems = this.filteredItems.filter(item => item.recordId !== recordId);

          // Show SweetAlert success message
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Dry fruit deleted successfully',
            confirmButtonColor: '#3085d6',
            timer: 2000
          });
        },
        error => {
          console.error('There was an error deleting the dry fruit:', error);

          // Show SweetAlert error message
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'There was an error deleting the dry fruit. Please try again.',
            confirmButtonColor: '#d33',
          });
        }
      );
  }}
