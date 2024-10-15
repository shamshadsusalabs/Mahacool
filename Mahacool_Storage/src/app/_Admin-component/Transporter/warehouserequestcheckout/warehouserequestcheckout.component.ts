import { Component } from '@angular/core';
import { WarehouseCheckoutrequestService } from '../../../_Service/warehouse-checkoutrequest.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-warehouserequestcheckout',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './warehouserequestcheckout.component.html',
  styleUrl: './warehouserequestcheckout.component.css'
})
export class WarehouserequestcheckoutComponent {
  activeRecords: any[] = [];

  constructor(private warehouseService: WarehouseCheckoutrequestService) {}

  ngOnInit(): void {
    this.warehouseService.getActiveRecords().subscribe(
      (data) => {
        this.activeRecords = data;
        console.log(this.activeRecords);
      },
      (error) => {
        console.error('Error fetching active records', error);
      }
    );
  }

  confirmChangeStatus(customerId: string, dryFruitDetails: any[]): void {
    if (confirm('Are you sure you want to deactivate this customer?')) {
      // Extract IDs from dryFruitDetails
      const dryFruitIds = dryFruitDetails.map(detail => detail._id);

      this.warehouseService.deactivateCustomer(customerId, dryFruitIds).subscribe(
        (response) => {
          console.log('Customer deactivated successfully', response);
          this.ngOnInit(); // Refresh the list of active records
        },
        (error) => {
          console.error('Error deactivating customer', error);
        }
      );
    }
  }
}
