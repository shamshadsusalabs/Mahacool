import { Component } from '@angular/core';
import { ClientService } from '../../../_Service/client.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FileUrl {
  date: string;
  url: string;
  _id: string;
}

interface Client {
  customerID: string;
  fileUrls: FileUrl[]; // Use the FileUrl type directly
}

interface FilteredData extends FileUrl {
  customerID: string; // Include customerID in the filtered data type
}

@Component({
  selector: 'app-all-invoices',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './all-invoices.component.html',
  styleUrls: ['./all-invoices.component.css'],
})
export class AllInvoicesComponent {
  fileData: Client[] = [];
  filteredData: FilteredData[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;


  searchCustomerId: string = '';
  startDate: string = '';
  endDate: string = '';
  constructor(private fileUrlService: ClientService) {}

  ngOnInit(): void {
    this.fetchFileUrls();
  }

  fetchFileUrls(): void {
    this.fileUrlService.getFileUrlsForAdmin().subscribe(
      (data: Client[]) => {
        this.fileData = data;
        this.filteredData = this.fileData.flatMap(client =>
          client.fileUrls.map((file: FileUrl) => ({
            customerID: client.customerID,
            date: file.date,
            url: file.url,
            _id: file._id
          }))
        );

        // Sort filteredData by date in descending order
        this.filteredData.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        console.log(this.filteredData);
      },
      (error) => {
        console.error('Error fetching file URLs:', error);
      }
    );
  }


  changePage(page: number): void {
    this.currentPage = page;
  }

  get currentPageData(): FilteredData[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  isLastPage(): boolean {
    return this.currentPage >= this.totalPages;
  }

  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  redirectToInvoice(url: string): void {
    window.open(url, '_blank');
  }


  filterData(): void {
    // Start with all filtered data
    let filtered = this.fileData.flatMap(client =>
      client.fileUrls.map((file: FileUrl) => ({
        customerID: client.customerID,
        date: file.date,
        url: file.url,
        _id: file._id
      }))
    );

    console.log("Initial Filtered Data:", filtered);

    // Filter by Customer ID if provided
    if (this.searchCustomerId) {
      filtered = filtered.filter(file => {
        const isMatch = file.customerID.includes(this.searchCustomerId);
        console.log(`Filtering by Customer ID: ${this.searchCustomerId}, Match Found: ${isMatch}`);
        return isMatch;
      });
    }

    console.log("After Customer ID Filter:", filtered);

    // Filter by start date if provided
    if (this.startDate) {
      filtered = filtered.filter(file => {
        const isAfterStartDate = new Date(file.date) >= new Date(this.startDate);
        console.log(`Filtering by Start Date: ${this.startDate}, Match Found: ${isAfterStartDate}`);
        return isAfterStartDate;
      });
    }

    console.log("After Start Date Filter:", filtered);

    // Filter by end date if provided
    if (this.endDate) {
      const endDateTime = new Date(this.endDate);
      endDateTime.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter(file => {
        const isBeforeEndDate = new Date(file.date) <= endDateTime;
        console.log(`Filtering by End Date: ${this.endDate}, Match Found: ${isBeforeEndDate}`);
        return isBeforeEndDate;
      });
    }

    console.log("After End Date Filter:", filtered);

    // Update filteredData and reset currentPage
    this.filteredData = filtered;
    this.currentPage = 1; // Reset to first page after filtering
    console.log("Final Filtered Data:", this.filteredData);
  }


}
