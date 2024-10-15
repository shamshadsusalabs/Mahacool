import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService, Customer } from '../../../_Service/client.service';
import { GunnyBagService } from '../../../_Service/gunny-bag.service';
import { InvoiceService } from '../../../_Service/invoice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // Import SweetAlert

@Component({
  selector: 'app-client-all-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-all-details.component.html',
  styleUrls: ['./client-all-details.component.css']
})
export class ClientAllDetailsComponent implements OnInit {
  customerID: string | null = null;
  customerId: string | null = null; // This is the customerId you want to use
  customer: Customer | null = null;
  error: string | null = null;
  checkInHistory: any;
  customerInvoice: any;
  checkOutHistory: any;
  totalWeightByFruit: any;

  currentPage: number = 1;
  itemsPerPage: number = 8; // Number of items to show per page
  filteredCheckInHistory: any[] = [];
  dateFilter: string = '';

  checkOutHistoryFiltered: any[] = [];
  checkoutDateFilter: string = '';
  currentCheckoutPage: number = 1;
  checkoutItemsPerPage: number = 8;

  constructor(
    private customerService: ClientService,
    private route: ActivatedRoute,
    private gunnyBagService: GunnyBagService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.customerID = params['id'];
      this.customerId = params['id']; // Set customerId based on the query parameter
      if (this.customerID) {
        this.getCustomerDetails();
        this.fetchCustomerDetails();
        this.getInvoiceForCustomer(); // Call to fetch invoice using customerId
      } else {
        this.showError("No customer ID provided.");
      }
    });
  }

  getCustomerDetails(): void {
    this.customerService.getCustomerById(this.customerID!).subscribe(
      data => {
        this.customer = data;
        Swal.fire({
          title: 'Success!',
          text: 'Customer details fetched successfully.',
          icon: 'success',

        });
      },
      error => {
        this.error = error;
        this.showError('Error fetching customer details: ' + error);
      }
    );
  }

  fetchCustomerDetails(): void {
    this.gunnyBagService.getCustomerDetailsforeach(this.customerID!).subscribe(
      data => {
        this.checkInHistory = Array.isArray(data.checkInHistory) ? data.checkInHistory : [];
        this.checkOutHistory = Array.isArray(data.checkOutHistory) ? data.checkOutHistory : [];
        this.totalWeightByFruit = data.totalWeightByFruit || {};

        // Sort checkInHistory by date in descending order
        this.checkInHistory.sort((a, b) => {
          const dateA = new Date(a.dryFruits[0].dateCheckIN).getTime();
          const dateB = new Date(b.dryFruits[0].dateCheckIN).getTime();
          return dateB - dateA; // Latest date first
        });

        this.applyDateFilter();
        this.applyCheckoutDateFilter();
      },
      error => {
        this.showError('Error fetching check-in history: ' + error);
      }
    );
  }

  applyCheckoutDateFilter(): void {
    if (this.checkoutDateFilter) {
      const selectedDate = new Date(this.checkoutDateFilter);
      this.checkOutHistoryFiltered = this.checkOutHistory.filter(checkOut => {
        const checkOutDate = new Date(checkOut.dryFruits[0].dateCheckout);
        return checkOutDate.toDateString() === selectedDate.toDateString();
      });
    } else {
      this.checkOutHistoryFiltered = this.checkOutHistory;
    }
  }

  get paginatedCheckOutHistory(): any[] {
    const startIndex = (this.currentCheckoutPage - 1) * this.checkoutItemsPerPage;
    return this.checkOutHistoryFiltered.slice(startIndex, startIndex + this.checkoutItemsPerPage);
  }

  get totalCheckoutPages(): number {
    return Math.ceil(this.checkOutHistoryFiltered.length / this.checkoutItemsPerPage);
  }

  changeCheckoutPage(page: number): void {
    this.currentCheckoutPage = page;
  }

  applyDateFilter(): void {
    if (this.dateFilter) {
      const selectedDate = new Date(this.dateFilter);
      this.filteredCheckInHistory = this.checkInHistory.filter(checkIn => {
        const checkInDate = new Date(checkIn.dryFruits[0].dateCheckIN);
        return checkInDate.toDateString() === selectedDate.toDateString();
      });
    } else {
      this.filteredCheckInHistory = this.checkInHistory;
    }
  }

  get paginatedCheckInHistory(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCheckInHistory.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCheckInHistory.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  paidMonthlyTotals: { [key: string]: number } = {};
  unpaidMonthlyTotals: { [key: string]: number } = {};
  grandTotalAmount: number = 0;
  grandTotalWeight: number = 0;
  totalPaidAmount: number = 0;
  unpaidRemainingAmount: number = 0;

  getInvoiceForCustomer(): void {
    if (this.customerId) {
      this.invoiceService.getInvoiceByCustomerId(this.customerId!).subscribe(
        data => {
          this.customerInvoice = data;

          this.grandTotalAmount = data.grandTotalAmount;
          this.grandTotalWeight = data.grandTotalWeight;
          this.totalPaidAmount = data.totalPaidAmount;
          this.unpaidRemainingAmount = data.unpaidRemainingAmount;

          // Clear previous totals
          this.paidMonthlyTotals = {};
          this.unpaidMonthlyTotals = {};

          // Populate paid monthly totals
          for (const month in data.paidMonthlyTotals) {
            this.paidMonthlyTotals[month] = data.paidMonthlyTotals[month];
          }

          // Populate unpaid monthly totals
          for (const month in data.unpaidMonthly) {
            this.unpaidMonthlyTotals[month] = data.unpaidMonthly[month];
          }

          // Show success alert with summary
          Swal.fire({
            title: 'Invoices Loaded!',
            text: `Grand Total Amount: ${this.grandTotalAmount}, Grand Total Weight: ${this.grandTotalWeight}`,
            icon: 'success',

          });
        },
        error => {
          this.showError('Error fetching invoice: ' + error);
        }
      );
    }
  }

  // Helper method to show error alerts
  showError(message: string): void {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',

    });
  }
}
