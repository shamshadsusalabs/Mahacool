import { Component } from '@angular/core';
import { GunnyBagService } from '../../../_Service/gunny-bag.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ClientService } from '../../../_Service/client.service';

export interface Invoice {
  _id: string;
  dateCheckIN: string;
  dateCheckout: string;
  dryFruitName: string;
  recordId: string;
  storedDays: string;
  totalAmount: number;
  weight: number;
}

export interface CustomerInvoice {
  customerId: string;
  invoices: Invoice[];
}

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {
  customerInvoices: any[] = [];
  filteredInvoices: any[] = [];
  paginatedInvoices: any[] = [];
  searchCustomerId: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  selectedCustomer: any = { invoices: [] };

  constructor(private gunnyBagService: GunnyBagService,private http: HttpClient,private  clientService: ClientService) {}

  ngOnInit(): void {
    this.getAllInvoices();
    this.loadImageAsBase64(); // Call the method to load the image as Blob URL
  }


  getAllInvoices(): void {
    this.gunnyBagService.getAllInvoices().subscribe({
      next: (response: any) => {
        this.customerInvoices = response.invoices;
        console.log(this.customerInvoices);
        this.filteredInvoices = [...this.customerInvoices];
        this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching invoices:', error);
      }
    });
  }

  searchInvoices(): void {
    if (this.searchCustomerId.trim() === '') {
      this.filteredInvoices = [...this.customerInvoices];
    } else {
      this.filteredInvoices = this.customerInvoices.filter(customer =>
        customer.customerId.includes(this.searchCustomerId.trim())
      );
    }
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredInvoices.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedInvoices = this.filteredInvoices.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  getTotalPayableAmount(invoices: any[]): number {
    return invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  }





base64Image: string | ArrayBuffer | null = null;
private loadImageAsBase64(): void {
  const imageUrl = '/logo/invoice.jpg'; // Path to your image in assets folder

  this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64Image = reader.result as string;
    };
    reader.readAsDataURL(blob);
  });
}

calculateGST(amount: number): number {
  return amount * 0.18;
}

// Calculate total amount including GST
getTotalWithGST(amount: number): number {
  return amount + this.calculateGST(amount);
}



client:any;

async printInvoice(customer: any) {
  this.selectedCustomer = customer || { invoices: [] };
  const customerID = this.selectedCustomer.customerId;

  try {
    // Wait for the client data to be fetched
    const response = await this.clientService.getClientforInvoice(customerID).toPromise();
    if (response) {
      this.client = response; // Client data fetched successfully
      console.log("Client data fetched:", this.client);

      // Now, proceed with the print logic after data is loaded
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice Print</title>
              <meta charset="UTF-8">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                }
                .invoice-header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .logo {
                  width: 80px;
                  height: auto;
                }
                .company-details {
                  margin-top: 10px;
                }
                .company-details p {
                  margin: 5px 0;
                  font-size: 14px;
                  font-weight: bold;
                }
                .contact-details {
                  margin-top: 10px;
                }
                .contact-details p {
                  margin: 5px 0;
                  font-size: 14px;
                  font-weight: bold;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f4f4f4;
                }
                .total {
                  font-weight: bold;
                }
                .heading {
                  margin-left: 40%;
                }
                  .customer-details {
  margin-bottom: 20px;
}

.customer-details-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.customer-details-row p {
  margin: 0;
  flex: 1;
}

.customer-details-row p:nth-child(3) {
  flex: 0 0 30%; /* Adjust this percentage as needed */
}

              </style>
            </head>
            <body>
              <div class="invoice-header">
                <img src="${this.base64Image}" alt="Company Logo" class="logo" />
                <h2 class="company-name" style="font-family: 'Roboto Slab', serif;">mahacool.com</h2>
                <div class="contact-details">
                  <p>Gmail: gaurav@anakeen.net</p>
                  <p>Direct Line: +91-9818647283</p>
                </div>
                <div class="company-details">
                  <p>GSTN: 07AHFPA6877M1ZW</p>
                  <p>2317/30, Gali Hinga Beg, Tilak Bazar, Khari Baoli, New Delhi, 110018</p>
                </div>
              </div>

              <h1 class="heading">Invoice Details</h1>
            <div class="customer-details">
  <div class="customer-details-row">
    <p><strong>Customer ID:</strong> ${this.selectedCustomer.customerId}</p>
    <p><strong>Customer Name:</strong> ${this.client.name}</p>
    <p><strong>Mobile:</strong> ${this.client.mobile}</p>
  </div>
  <div class="customer-details-row">
    <p><strong>GST Number:</strong> ${this.client.gstNumber}</p>
    <p><strong>Address:</strong> ${this.client.address}</p>
  </div>
</div>

              <table>
                <thead>
                  <tr>
                    <th>Dry Fruits</th>
                    <th>Check-in Date</th>
                    <th>Check-out Date</th>
                    <th>Weight (kg)</th>
                    <th>Stored days</th>
                  </tr>
                </thead>
                <tbody>
        `);

        // Loop through invoices and print details in table rows
        this.selectedCustomer.invoices.forEach((invoice: { dryFruitName: string; dateCheckIN: string | number | Date; dateCheckout: string | number | Date; weight: string; storedDays: string; }) => {
          printWindow.document.write(`
            <tr>
              <td>${invoice.dryFruitName}</td>
              <td>${new Date(invoice.dateCheckIN).toLocaleDateString()}</td>
              <td>${new Date(invoice.dateCheckout).toLocaleDateString()}</td>
              <td>${invoice.weight} kg</td>
              <td>${invoice.storedDays}</td>
            </tr>
          `);
        });

        const totalAmount = this.getTotalPayableAmount(this.selectedCustomer.invoices);
        const gstAmount = this.calculateGST(totalAmount);
        const totalWithGST = this.getTotalWithGST(totalAmount);

        printWindow.document.write(`
              </tbody>
            </table>

            <div style="margin-top: 20px;">
              <p><strong>Total Payable:</strong> ₹${totalAmount.toFixed(2)}</p>
              <p><strong>GST (18%):</strong> ₹${gstAmount.toFixed(2)}</p>
              <p><strong>Total Amount (including GST):</strong> ₹${totalWithGST.toFixed(2)}</p>
            </div>
          </body>
        </html>
      `);

        printWindow.document.close();
        const blob = new Blob([printWindow.document.documentElement.outerHTML], { type: 'application/html' });

        // Convert Blob to File
        const file = new File([blob], 'invoice.html', { type: 'application/html' });

        // Upload the file using FileUploadService
        this.clientService.uploadFile(file, this.selectedCustomer.customerId).subscribe({
          next: (response) => {
            console.log('File uploaded successfully:', response);
          },
          error: (error) => {
            console.error('Error uploading file:', error);
          }
        });

        // Set an interval to wait for the image to load and then trigger print
        const imgCheckInterval = setInterval(() => {
          const img = printWindow.document.querySelector('img');
          if (img && img.complete) {
            clearInterval(imgCheckInterval);
            printWindow.focus();
            printWindow.print();
            this.updateStatus();
          }
        }, 2000);

        printWindow.onafterprint = function() {
          printWindow.close();
        };
      }
    }
  } catch (error) {
    console.error("Error fetching client data:", error);
  }

  // Convert the print window content to Blob (if necessary)
  this.getAllInvoices();
}


updateStatus() {
  this.gunnyBagService.updateInvoiceStatus(
    this.selectedCustomer.customerId,
    this.selectedCustomer.invoices.map((inv: { recordId: any; }) => inv.recordId)
  ).subscribe({
    next: (response) => {
      console.log('Invoice data sent successfully:', response);
      // Optionally, show a success message or SweetAlert here
    },
    error: (error) => {
      console.error('Error sending invoice data:', error);
    }
  });
}
}
