import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface City {
  _id?: string;       // The unique identifier of the city
  name: string;      // The name of the city
  active: boolean;   // Indicates whether the city is active
  __v: number;
  status?:boolean;      // Version key set by MongoDB (can be optional)
}
@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private baseUrl = 'https://mahacool-437301.el.r.appspot.com/api/city'; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  // Get all active cities
  getAllActiveCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/getall`);
  }

  // Get all cities
  getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/all`);
  }

  // Add a new city
  addCity(cityData: City): Observable<City> {
    return this.http.post<City>(`${this.baseUrl}/add`, cityData);
  }

  // Remove a city by ID
  removeCity(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/remove`, { id });
  }

  ///


  // Update a city by ID
  updateCity(id: string, updateData: Partial<City>): Observable<City> {
    return this.http.post<City>(`${this.baseUrl}/update?id=${id}`, updateData);
  }





  // Get details of a specific city by ID
  getCityDetails(id: string): Observable<City> {
    return this.http.get<City>(`${this.baseUrl}/details`, {
    });
  }
}

