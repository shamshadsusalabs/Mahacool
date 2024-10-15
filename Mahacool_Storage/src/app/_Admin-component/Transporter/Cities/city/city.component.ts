import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitiesService, City } from '../../../../_Service/cities.service';
import { NavigationEnd, Router } from '@angular/router';
import { AddcityComponent } from '../addcity/addcity.component';
import { Warehouse, WarehouseService } from '../../../../_Service/warehouse.service';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [FormsModule,CommonModule,AddcityComponent ],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent {
  cities: City[] = [];
  searchTerm: string = '';
  isModalOpen: boolean = false;
  confirmInput: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  selectedCity?: City;
  newStatus?: boolean;
  isEditModalOpen: boolean = false;
  updatedCityName: string = '';
  constructor(private cityService: CitiesService,    private router: Router,private warehouseservice: WarehouseService,) {}

  ngOnInit(): void {
    this.getAllCities();
  }

  get filteredItems() {
    return this.cities.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
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

  openConfirmModal(city: City, newStatus: boolean) {
    this.selectedCity = city;
    this.newStatus = newStatus;
    this.isModalOpen = true;
  }

  closeConfirmModal() {
    this.isModalOpen = false;
    this.confirmInput = '';
  }

  confirmAction(): void {
    if (this.confirmInput.toUpperCase() === 'CONFIRM' && this.selectedCity && this.newStatus !== undefined) {
      this.isModalOpen = false;
      this.updateStatus(this.selectedCity, this.newStatus);
    } else {
      alert('Please type "CONFIRM" to proceed.');
    }
  }

  updateStatus(city: City, newStatus: boolean): void {
    if (!city._id) {
      console.error('City ID is not defined');
      return;
    }

    this.cityService.updateCity(city._id, { active: newStatus }).subscribe(
      () => {
        alert(`City ${city.name} status updated to ${newStatus ? 'Active' : 'Inactive'}`);
        this.getAllCities(); // Refresh city list after update
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

  getAllCities(): void {
    this.cityService.getAllCities().subscribe(
      data => {
        this.cities = data;
      },
      error => console.log('Error fetching cities:', error)
    );
  }


  openEditModal(city: City) {
    this.selectedCity = city;
    this.updatedCityName = city.name; // Pre-fill the input field with the current city name
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.updatedCityName = '';
  }

  updateCityName(): void {
    if (this.selectedCity && this.updatedCityName.trim() !== '') {
      // Check if the ID is defined before proceeding
      if (!this.selectedCity._id) {
        console.error('City ID is not defined');
        return;
      }

      const updatedCity = { ...this.selectedCity, name: this.updatedCityName };

      this.cityService.updateCity(this.selectedCity._id, updatedCity).subscribe(
        () => {
          alert(`City name updated to ${this.updatedCityName}`);
          this.getAllCities(); // Refresh city list after update
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


  redirectToWarehouse(cityId?: string): void {
    console.log("click");
    if (!cityId) {
      console.error('City ID is not defined');
      return;
    }

    // Store the city ID in localStorage
    localStorage.setItem('selectedCityId', cityId);

    // Navigate to the warehouse route
    this.router.navigate(['/Admin/warehouse']).then(() => {
      // After navigating, listen for the NavigationEnd event
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          // Remove the city ID from localStorage after navigation is complete
          localStorage.removeItem('selectedCityId');
        }
      });
    });
  }



  isModalOpenAddcity = false;


  openModal() {
    this.isModalOpenAddcity = true; // Open modal
  }

  closeModal() {
    this.isModalOpenAddcity = false; // Close modal
  }

  // Handle event from AddCityComponent
  onCityAdded() {
    this.getAllCities(); // Refresh city list
  }

  isAddWarehouseModalOpen = false;
  selectedCityId: string = '';
  newWarehouseName = ''; // Default value

openAddWarehouseModal(city: City) {
  if (city._id) {
    this.selectedCityId = city._id;
    this.isAddWarehouseModalOpen = true;
  } else {
    console.error('City ID is undefined');
  }
}
  // Close the Add Warehouse Modal
  closeAddWarehouseModal() {
    this.isAddWarehouseModalOpen = false;
  }

  // Add Warehouse
  addWarehouse() {
    const warehouseData: Warehouse = {
      cid: this.selectedCityId,  // Assuming this is the `sid` field
      name: this.newWarehouseName, // The name field from the modal
      // Provide the required `cid` field
      active: true, // or whatever value you need for the `active` field
      // Add other required fields if necessary
    };

    this.warehouseservice.addWarehosue(warehouseData).subscribe(
      () => {
        alert(`Warehouse added successfully to city`);
        this.closeAddWarehouseModal();
      },
      error => {
        console.error('Error adding warehouse:', error);
        alert('Error adding warehouse. Please try again.');
      }
    );
  }}

