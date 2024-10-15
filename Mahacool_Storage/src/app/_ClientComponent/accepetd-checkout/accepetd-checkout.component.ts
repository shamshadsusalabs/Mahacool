import { Component } from '@angular/core';
import { WarehouseCheckoutrequestService } from '../../_Service/warehouse-checkoutrequest.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accepetd-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accepetd-checkout.component.html',
  styleUrl: './accepetd-checkout.component.css'
})
export class AccepetdCheckoutComponent {
  deactivatedRecords: any[] = []; // Initialize as an empty array

  constructor(private warehouseService: WarehouseCheckoutrequestService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const customerId = user.customerID;
    this.fetchDeactivatedRecords(customerId); // Fetch records based on customerId
  }

  fetchDeactivatedRecords(customerId: string): void {
    this.warehouseService.getDeactivatedRecord(customerId).subscribe(
      (data) => {
        console.log(data);
        this.deactivatedRecords = [data]; // If it's a single object, convert it to an array
      },
      (error) => {
        console.error('Error fetching deactivated records', error);
      }
    );
  }
}
