import { Component, OnInit } from '@angular/core';
import { WarehouseService } from '../../../_Service/warehouse.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface WarehouseDetail {
  warehouseId: string;
  warehouseName: string;
  weight: number;
  bora: number;
  dryFruitName: string;
  cityName: string;
  _iddetails: string;
}

interface User {

  email: string;

  mobile: string;
  name: string;

  customerID:string

  _id: string;
}

interface SelectedData {
  details: WarehouseDetail[];
  user?: User;
}

interface WarehouseRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
  requestedWarehouseStatus: boolean;
  selectedData?: SelectedData;
  __v: number;
}

@Component({
  selector: 'app-warehouse-requested',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './warehouse-requested.component.html',
  styleUrls: ['./warehouse-requested.component.css']
})
export class WarehouseRequestedComponent implements OnInit {

  warehouseRequests: WarehouseRequest[] = [];
  modalOpen = false;
  ratePerKg: number | null = null;
  currentIddetails: string | null = null;
  currentRequestId: string | null = null;
  ratesMap: Map<string, { rate: number, requestId: string, iddetails: string }> = new Map(); // Include iddetails

  constructor(private warehouseService: WarehouseService) { }

  ngOnInit(): void {
    this.fetchWarehouseRequests();
  }

  fetchWarehouseRequests(): void {
    this.warehouseService.getAllWarehouseRequests().subscribe(
      (data: WarehouseRequest[]) => {
        this.warehouseRequests = data || [];
        console.log(this.warehouseRequests);
      },
      (error) => {
        console.error('Error fetching warehouse requests', error);
      }
    );
  }

  openModal(requestId: string, _iddetails: string): void {
    this.modalOpen = true;
    this.currentIddetails = _iddetails;
    this.currentRequestId = requestId;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.ratePerKg = null;
    this.currentIddetails = null;
    this.currentRequestId = null;
  }

  saveRate(): void {
    if (this.ratePerKg !== null && this.currentIddetails && this.currentRequestId) {
      this.ratesMap.set(this.currentIddetails, { rate: this.ratePerKg, requestId: this.currentRequestId, iddetails: this.currentIddetails });
      this.closeModal();
    } else {
      console.error('Rate, ID, or Request ID is missing');
    }
  }

  confirmAllRates(): void {
    if (this.ratesMap.size > 0) {
      // Prepare the data to send
      const ratesToUpdate = Array.from(this.ratesMap.values());

      this.warehouseService.updateRates(ratesToUpdate).subscribe(
        response => {
          console.log('Rates updated successfully:', response);

          // Show SweetAlert confirmation message
          Swal.fire({
            title: 'Success!',
            text: 'Rates have been updated and request status has been confirmed.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Optionally refresh the data or perform other actions
            this.fetchWarehouseRequests();
          });
        },
        error => {
          console.error('Error updating rates:', error);

          // Show SweetAlert error message
          Swal.fire({
            title: 'Error!',
            text: 'There was an error updating the rates. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      console.log('No rates set.');
    }
  }

}
