import { Component, OnInit } from '@angular/core';
import { Warehouse, WarehouseService } from '../../_Service/warehouse.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css'
})
export class WarehouseComponent implements OnInit {
  warehouses: Warehouse[] = [];
  searchTerm: string = '';
  isModalOpen: boolean = false;
  selectedWarehouse: Warehouse | null = null;

  modalItems: Array<{ weight: number | null; bora: number | null; dryFruit: string | null }> = [];

  dryFruits = [
    { name: 'Almonds' },
    { name: 'Cashews' },
    { name: 'Raisins' },
    { name: 'Walnuts' },
    { name: 'Pistachios' },
    { name: 'Dried Apricots' },
    { name: 'Dates' },
    { name: 'Figs' },
    { name: 'Prunes' },
    { name: 'Brazil Nuts' },
    { name: 'Pecans' },
    { name: 'Hazelnuts' },
    { name: 'Sunflower Seeds' },
    { name: 'Pumpkin Seeds' },
    { name: 'Chia Seeds' }
  ];


  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.getAllWarehouses();
  }

  getAllWarehouses(): void {
    const selectedCityId = localStorage.getItem('selectedCityId');

    if (selectedCityId) {
      this.warehouseService.getWarehouseDetailsforClient(selectedCityId).subscribe(
        data => {
          this.warehouses = data;
          console.log(this.warehouses);
        },
        error => console.log('Error fetching warehouses:', error)
      );
    } else {
      console.error('No city ID found in localStorage.');
    }
  }

  get filteredCities(): Warehouse[] {
    if (!this.searchTerm) {
      return this.warehouses;
    }
    return this.warehouses.filter(city =>
      city.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get displayedCities(): Warehouse[] {
    return this.filteredCities.slice(0, 6);
  }

  openModal(warehouse: Warehouse): void {
    this.selectedWarehouse = warehouse;
    this.modalItems = [{ weight: null, bora: null, dryFruit: null }]; // Initialize with one item
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedWarehouse = null;
  }

  addItem(): void {
    this.modalItems.push({ weight: null, bora: null, dryFruit: null });
  }

  removeItem(index: number): void {
    if (this.modalItems.length > 1) {
      this.modalItems.splice(index, 1);
    }
  }

  saveDetails(): void {
    if (this.selectedWarehouse) {
      // Retrieve user object from localStorage
      const user = localStorage.getItem('user');
      let userObj: any = null;

      if (user) {
        try {
          const parsedUser = JSON.parse(user); // Parse the full user object
          // Only extract the required fields
          userObj = {
            name: parsedUser.name,
            email: parsedUser.email,
            mobile: parsedUser.mobile,
            customerID: parsedUser.customerID
          };
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e);
        }
      }

      const selectedCityName = localStorage.getItem('selectedCityName') || '';

      // Prepare the details array without the user object
      const details = this.modalItems.map(item => ({
        warehouseId: this.selectedWarehouse!._id,
        warehouseName: this.selectedWarehouse!.name,
        totalweight: item.weight,
        bora: item.bora,
        dryFruitName: item.dryFruit,
        cityName: selectedCityName
      }));

      // Combine the details array and the user object into a single payload
      const payload = {
        user: userObj, // Send only the specific fields
        details: details // Send the details array
      };

      console.log(payload);

      // Call your service or API to save the details
      this.warehouseService.createWarehouseRequest(payload).subscribe(
        data => {
          console.log('Details saved successfully:', data);
          this.closeModal(); // Close modal on success

          // Show SweetAlert2 message
          Swal.fire({
            title: 'Request Submitted',
            text: 'Your request has been submitted. Please wait for an admin response. My team will contact you soon.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error => {
          console.error('Error saving details:', error);
        }
      );
    }
  }
}
