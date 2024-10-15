import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { GunnyBagService } from '../../../../_Service/gunny-bag.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  selector: 'app-allhistory',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './allhistory.component.html',
  styleUrl: './allhistory.component.css'
})
export class AllhistoryComponent {
  items: Item[] = []; // All items fetched from the service
  filteredItems: Item[] = []; // Items after filtering
  paginatedItems: DryFruit[] = []; // Items for the current page
  selectedDate: string | null = null; // Date picker value for filtering by dateCheckout
  searchTerm: string = ''; // Search bar value
  currentPage: number = 1; // Current pagination page
  itemsPerPage: number = 5; // Items to show per page

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
        this.filteredItems = data; // Initialize filtered items
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

  // Filter data by dateCheckout
  filterDataByDate() {
    if (this.selectedDate) {
      this.filteredItems = this.items.filter(item =>
        item.checkOutHistory.some(checkOut =>
          checkOut.dryFruits.some((dryFruit: { dateCheckout: string | number | Date; }) =>
            new Date(dryFruit.dateCheckout).toISOString().split('T')[0] === this.selectedDate
          )
        )
      );
    } else {
      this.filteredItems = this.items; // No date selected, show all items
    }
    this.currentPage = 1; // Reset to first page after filtering
    this.updatePaginatedItems(); // Update pagination after filtering
  }

  // Search data in checkOutHistory
  searchData() {
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.checkOutHistory.some(checkOut =>
        checkOut.dryFruits.some((dryFruit: { cityName: string; warehouseName: string; rackName: string; }) =>
          dryFruit.cityName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.warehouseName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.rackName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.rackName.toLowerCase().includes(lowerCaseTerm)
        )
      )
    );
    this.currentPage = 1; // Reset to first page after searching
    this.updatePaginatedItems(); // Update pagination after searching
  }

  // Pagination methods
  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Flattening filteredItems to get DryFruit objects from checkOutHistory
    const allDryFruits: DryFruit[] = this.filteredItems.flatMap(item =>
      item.checkOutHistory.flatMap(checkOut => checkOut.dryFruits)
    );

    this.paginatedItems = allDryFruits.slice(startIndex, endIndex);
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
    const totalDryFruits = this.filteredItems.flatMap(item =>
      item.checkOutHistory.flatMap(checkOut => checkOut.dryFruits)
    ).length;

    return Math.ceil(totalDryFruits / this.itemsPerPage);
  }
}
