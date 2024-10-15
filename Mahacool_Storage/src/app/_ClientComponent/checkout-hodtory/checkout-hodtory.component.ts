import { Component } from '@angular/core';
import { GunnyBagService } from '../../_Service/gunny-bag.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
interface DryFruit {
  cityName: string;
  warehouseName: string;
  rackName: string;
  dateCheckIN: string;
  dateCheckout: string; // Add dateCheckout field
  name: string;
  recordId: string;
  typeOfSack: string;
  weight: number;
  customerId: string;
}

interface CheckOutHistory {
  dryFruits: DryFruit[]; // Update to include DryFruit
  _id: string;
}

interface Customer {
  _id: string;
  customerId: string;
  checkInHistory: any[]; // You may choose to include checkInHistory as well
  checkOutHistory: CheckOutHistory[];
  totalWeightByFruit: Record<string, number>;
}
@Component({
  selector: 'app-checkout-hodtory',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './checkout-hodtory.component.html',
  styleUrl: './checkout-hodtory.component.css'
})
export class CheckoutHodtoryComponent {

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  paginatedDryFruits: DryFruit[] = [];
  selectedDate: string | null = null;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private gunnyBagService: GunnyBagService) {}

  ngOnInit() {
    this.fetchData();
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
          this.customers = [data];
        } else {
          console.error('Unexpected data format:', data);
          this.customers = [];
        }

        this.filteredCustomers = [...this.customers];
        this.updatePaginatedItems();
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

  filterDataByDate() {
    if (this.selectedDate) {
      this.filteredCustomers = this.customers.filter(customer =>
        customer.checkOutHistory.some(checkOut =>
          checkOut.dryFruits.some(dryFruit =>
            new Date(dryFruit.dateCheckout).toISOString().split('T')[0] === this.selectedDate
          )
        )
      );
    } else {
      this.filteredCustomers = this.customers; // No date selected, show all
    }
    this.currentPage = 1;
    this.updatePaginatedItems();
  }

  searchData() {
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(customer =>
      customer.checkOutHistory.some(checkOut =>
        checkOut.dryFruits.some(dryFruit =>
          dryFruit.cityName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.warehouseName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.rackName.toLowerCase().includes(lowerCaseTerm)
        )
      )
    );
    this.currentPage = 1;
    this.updatePaginatedItems();
  }

  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    const allDryFruits: DryFruit[] = this.filteredCustomers.flatMap(customer =>
      customer.checkOutHistory.flatMap(checkOut => checkOut.dryFruits)
    );

    this.paginatedDryFruits = allDryFruits.slice(startIndex, endIndex);
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
      customer.checkOutHistory.flatMap(checkOut => checkOut.dryFruits)
    ).length;

    return Math.ceil(totalDryFruits / this.itemsPerPage);
  }
}
