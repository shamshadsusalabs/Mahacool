import { Component } from '@angular/core';

import { CitiesService, City } from '../../_Service/cities.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent {
  cities: City[] = [];
  searchTerm: string = '';

  constructor(private cityService: CitiesService, private router: Router) { }

  ngOnInit(): void {
    this.getAllCities();
  }

  getAllCities(): void {
    this.cityService.getAllActiveCities().subscribe(
      data => {
        this.cities = data;
        console.log(this.cities);
      },
      error => console.log('Error fetching cities:', error)
    );
  }

  get filteredCities(): City[] {
    if (!this.searchTerm) {
      return this.cities;
    }
    return this.cities.filter(city =>
      city.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get displayedCities(): City[] {
    return this.filteredCities.slice(0, 6);
  }


  redirectToWarehouse(cityId?: string): void {
    console.log("click");
    if (!cityId) {
      console.error('City ID is not defined');
      return;
    }

    const selectedCity = this.cities.find(city => city._id === cityId);
    if (!selectedCity) {
      console.error('City not found');
      return;
    }

    // Store the city ID and name in localStorage
    localStorage.setItem('selectedCityId', selectedCity._id || '');
    localStorage.setItem('selectedCityName', selectedCity.name || '');


    // Navigate to the warehouse route
    this.router.navigate(['/Client/client-warehouse']).then(() => {
      console.log('Navigation successful');
    }).catch(err => console.error('Navigation error:', err));
  }
}



