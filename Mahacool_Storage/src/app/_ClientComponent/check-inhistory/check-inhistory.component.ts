import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { GunnyBagService } from '../../_Service/gunny-bag.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

interface Customer {
  _id: string;
  customerId: string; // Unique identifier for the customer
  checkInHistory: CheckInHistory[];
  checkOutHistory: any[];
  totalWeightByFruit: Record<string, number>;
}

@Component({
  selector: 'app-check-inhistory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-inhistory.component.html',
  styleUrls: ['./check-inhistory.component.css'] // Fixed to `styleUrls`
})
export class CheckINhistoryComponent {
  customers: Customer[] = []; // All customers fetched from the service
  filteredCustomers: Customer[] = []; // Customers after filtering
  paginatedDryFruits: DryFruit[] = []; // Dry fruits for the current page
  selectedDate: string | null = null; // Date picker value
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

    this.gunnyBagService.getCustomerDetails().subscribe({
      next: (data) => {
        console.log('Fetched data:', data);

        // Check if data is an array
        if (Array.isArray(data)) {
          this.customers = data;
        } else if (data && typeof data === 'object') {
          this.customers = [data]; // Wrap the single object in an array
        } else {
          console.error('Unexpected data format:', data);
          this.customers = []; // Fallback to empty array
        }

        this.filteredCustomers = [...this.customers]; // Initialize filteredCustomers
        this.updatePaginatedItems(); // Update after fetching
        Swal.close();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Fetch Data',
          text: 'An error occurred while fetching the data. Please try again.',
          showConfirmButton: false,
          timer: 3000 // Close the alert automatically after 3 seconds
        });
      }
    });
  }

  filterDataByDate() {
    if (this.selectedDate) {
      this.filteredCustomers = this.customers.filter(customer =>
        customer.checkInHistory.some(checkIn =>
          checkIn.dryFruits.some(dryFruit =>
            new Date(dryFruit.dateCheckIN).toISOString().split('T')[0] === this.selectedDate
          )
        )
      );
    } else {
      this.filteredCustomers = this.customers; // No date selected, show all
    }
    this.currentPage = 1; // Reset to first page after filtering
    this.updatePaginatedItems(); // Update pagination after filtering
  }

  searchData() {
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(customer =>
      customer.checkInHistory.some(checkIn =>
        checkIn.dryFruits.some(dryFruit =>
          dryFruit.cityName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.warehouseName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.rackName.toLowerCase().includes(lowerCaseTerm)

        )
      )
    );
    this.currentPage = 1; // Reset to first page after searching
    this.updatePaginatedItems(); // Update pagination after searching
  }

  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Flattening filteredCustomers to get DryFruit objects
    const allDryFruits: DryFruit[] = this.filteredCustomers.flatMap(customer =>
      customer.checkInHistory.flatMap(checkIn => checkIn.dryFruits)
    );

    this.paginatedDryFruits = allDryFruits.slice(startIndex, endIndex); // Slice for pagination
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
    const totalDryFruits = this.filteredCustomers.flatMap(customer =>
      customer.checkInHistory.flatMap(checkIn => checkIn.dryFruits)
    ).length;

    return Math.ceil(totalDryFruits / this.itemsPerPage); // Calculate total pages
  }
}
