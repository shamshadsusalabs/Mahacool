import { Component } from '@angular/core';
import { Rack, RackService, Story } from '../../../_Service/rack.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rack',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './rack.component.html',
  styleUrl: './rack.component.css'
})
export class RackComponent {

  racks: Rack[] = [];
  searchTerm: string = '';
  isModalOpen: boolean = false;
  confirmInput: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  selectedwarehouse?:  Rack;
  newStatus?: boolean;
  isEditModalOpen: boolean = false;
  updatedWarehouseName: string = '';

  constructor(private rackservice: RackService,    private router: Router) {}

  ngOnInit(): void {
    this.getAllracks();
  }

  get filteredItems() {
    return this.racks.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
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

  openConfirmModal(city: Rack, newStatus: boolean) {
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

  updateStatus(city: Rack, newStatus: boolean): void {
    if (!city._id) {
      console.error('City ID is not defined');
      return;
    }

    this.rackservice.updateRack(city._id, { active: newStatus }).subscribe(
      () => {
        alert(`City ${city.name} status updated to ${newStatus ? 'Active' : 'Inactive'}`);
        this.getAllracks(); // Refresh city list after update
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

  getAllracks(): void {
    this.rackservice.getRack().subscribe(
      data => {
        this.racks = data;
        console.log(data);
      },
      error => console.log('Error fetching  warehouses:', error)
    );
  }


  openEditModal(city: Rack) {
    this.selectedwarehouse = city;
    this.updatedWarehouseName = city.name; // Pre-fill the input field with the current city name
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.  updatedWarehouseName = '';
  }

  updateRack(): void {
    if (this.selectedwarehouse && this.  updatedWarehouseName.trim() !== '') {
      // Check if the ID is defined before proceeding
      if (!this.selectedwarehouse._id) {
        console.error('City ID is not defined');
        return;
      }

      const updatedCity = { ...this.selectedwarehouse, name: this.  updatedWarehouseName };

      this.rackservice.updateRack(this.selectedwarehouse._id, updatedCity).subscribe(
        () => {
          alert(`City name updated to ${this.  updatedWarehouseName}`);
          this.getAllracks(); // Refresh city list after update
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


  redirectToWarehouse(rackId?: string): void {
    if (!rackId) {
      console.error('rack ID is not defined');
      return;
    }

    // Store the city ID in localStorage
    localStorage.setItem('selectedrackId', rackId);

    // Navigate to the warehouse route
    this.router.navigate(['/Admin/story']);
  }


//   isAddRackModalOpen = false;
//   selectedRackId: string = '';
//   newStorykName = '';
//   box :number =0;
//   cap : number =0; // Default value

// openAddRackModal(rack: Rack) {
//   if (rack._id) {
//     this.selectedRackId = rack._id;
//     this.isAddRackModalOpen = true;
//   } else {
//     console.error('City ID is undefined');
//   }
// }
//   // Close the Add Warehouse Modal
//   closeAddRackModal() {
//     this.isAddRackModalOpen = false;
//   }

//   // Add Warehouse
//   addrack() {
//     const storyData: Story = {
//       name: this.newStorykName,
//       box: this.box,  // `box` is a number
//       cap: this.cap,  // `cap` is a number
//     };

//     const rackId = this.selectedRackId;

//     this.rackservice.addStory(rackId, storyData).subscribe(
//       () => {
//         alert(`Story added successfully to the Warehouse`);
//         this.closeAddRackModal();
//       },
//       error => {
//         console.error('Error adding Story:', error);
//         alert('Error adding story. Please try again.');
//       }
//     );
//   }
}
