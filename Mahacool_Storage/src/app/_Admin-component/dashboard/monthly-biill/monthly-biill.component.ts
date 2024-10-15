import { Component } from '@angular/core';
import { InvoiceService } from '../../../_Service/invoice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-biill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-biill.component.html',
  styleUrl: './monthly-biill.component.css'
})
export class MonthlyBiillComponent {
  monthlyInvoice: any;
  constructor(

    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {

        // Fetch monthly invoices
        this.invoiceService.getInvoices().subscribe((data) => {
          this.monthlyInvoice = data;
          console.log("shvsh",this.monthlyInvoice);
        });
      }
  }


