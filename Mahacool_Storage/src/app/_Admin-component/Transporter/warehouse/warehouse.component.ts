import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Warehouse, WarehouseService } from '../../../_Service/warehouse.service';
import { NavigationEnd, Router } from '@angular/router';
import { Rack, RackService } from '../../../_Service/rack.service';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css'
})
export class WarehouseComponent {
 warehouses: Warehouse[] = [];
  searchTerm: string = '';
  isModalOpen: boolean = false;
  confirmInput: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  selectedwarehouse?:  Warehouse;
  newStatus?: boolean;
  isEditModalOpen: boolean = false;
  updatedWarehouseName: string = '';

  constructor(private warehouseservice: WarehouseService,    private router: Router,private rack:RackService) {}

  ngOnInit(): void {
    this.getAllwarehouses();
  }

  get filteredItems() {
    return this.warehouses.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  get totalItems() {
    return this.filteredItems.length;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredItems.slice(start, end);
  }

  openConfirmModal(city: Warehouse, newStatus: boolean) {
    this.selectedwarehouse = city;
    this.newStatus = newStatus;
    this.isModalOpen = true;
  }

  closeConfirmModal() {
    this.isModalOpen = false;
    this.confirmInput = '';
  }

  confirmAction(): void {
    if (this.confirmInput.toUpperCase() === 'CONFIRM' && this.selectedwarehouse && this.newStatus !== undefined) {
      this.isModalOpen = false;
      this.updateStatus(this.selectedwarehouse, this.newStatus);
    } else {
      alert('Please type "CONFIRM" to proceed.');
    }
  }

  updateStatus(city: Warehouse, newStatus: boolean): void {
    if (!city._id) {
      console.error('City ID is not defined');
      return;
    }

    this.warehouseservice.updatewarehouse(city._id, { active: newStatus }).subscribe(
      () => {
        alert(`City ${city.name} status updated to ${newStatus ? 'Active' : 'Inactive'}`);
        this.getAllwarehouses(); // Refresh city list after update
      },
      error => {
        console.error(`Error updating status for ${city.name}:`, error);
        alert('Error updating city status. Please try again.');
      }
    );
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getAllwarehouses(): void {
    this.warehouseservice.getWarehouse().subscribe(
      data => {
        this.warehouses = data;
      },
      error => console.log('Error fetching  warehouses:', error)
    );
  }


  openEditModal(city: Warehouse) {
    this.selectedwarehouse = city;
    this.updatedWarehouseName = city.name; // Pre-fill the input field with the current city name
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.  updatedWarehouseName = '';
  }

  updateWarehouse(): void {
    if (this.selectedwarehouse && this.  updatedWarehouseName.trim() !== '') {
      // Check if the ID is defined before proceeding
      if (!this.selectedwarehouse._id) {
        console.error('City ID is not defined');
        return;
      }

      const updatedCity = { ...this.selectedwarehouse, name: this.  updatedWarehouseName };

      this.warehouseservice.updatewarehouse(this.selectedwarehouse._id, updatedCity).subscribe(
        () => {
          alert(`City name updated to ${this.  updatedWarehouseName}`);
          this.getAllwarehouses(); // Refresh city list after update
          this.closeEditModal();
        },
        error => {
          console.error('Error updating city name:', error);
          alert('Error updating city name. Please try again.');
        }
      );
    } else {
      alert('City name cannot be empty.');
    }
  }


  redirectToWarehouse(warehouseId?: string): void {
    if (!warehouseId) {
      console.error('City ID is not defined');
      return;
    }

    // Store the city ID in localStorage
    localStorage.setItem('selectedwarehouseId', warehouseId);

    // Navigate to the warehouse route
    this.router.navigate(['/Admin/rack']).then(() => {
      // After navigating, listen for the NavigationEnd event
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          // Remove the city ID from localStorage after navigation is complete
          localStorage.removeItem('selectedwarehouseId');
        }
      });
    });
  }


  isAddRackModalOpen = false;
  selectedwarehouseId: string = '';
  newRackName = ''; // Default value

openAddRackModal(rack: Rack) {
  if (rack._id) {
    this.selectedwarehouseId = rack._id;
    this.isAddRackModalOpen = true;
  } else {
    console.error('City ID is undefined');
  }
}
  // Close the Add Warehouse Modal
  closeAddRackModal() {
    this.isAddRackModalOpen = false;
  }

  // Add Warehouse
  addrack() {
    const RackData: Rack = {
      cid: this.selectedwarehouseId,  // Assuming this is the `sid` field
      name: this.newRackName, // The name field from the modal
      // Provide the required `cid` field
      active: true, // or whatever value you need for the `active` field
      // Add other required fields if necessary
    };

    this.rack.addRack( RackData).subscribe(
      () => {
        alert(`Rack added successfully to Warehosue`);
        this.closeAddRackModal();
      },
      error => {
        console.error('Error adding Rack:', error);
        alert('Error adding Rack. Please try again.');
      }
    );
  }
}
