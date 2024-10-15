import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
export interface Story {
  sid?: string;
  box: number;
  cap: number;
  name: string;
}

 export interface Rack {

  _id?: string;
  name: string;
  noofcont?: string;
  cid: string;
  story?: Story[];
  active: boolean;
}



@Injectable({
  providedIn: 'root'
})
export class RackService {


  private baseUrl = 'https://mahacool-437301.el.r.appspot.com/api/rack';

  constructor(private http: HttpClient) {}

  // Get all active cities
  getAllActiveRack(): Observable<Rack[]> {
    return this.http.get<Rack[]>(`${this.baseUrl}/getall`);
  }

  // Get all cities
  getAllRack(): Observable<Rack[]> {
    return this.http.get<Rack[]>(`${this.baseUrl}/all`);
  }

  // Add a new Warehosue
  addRack(WarehosueData: Rack): Observable<Rack> {
    return this.http.post<Rack>(`${this.baseUrl}/add`, WarehosueData);
  }

  // Remove a Warehosue by ID
  removeRack(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/remove`, { id });
  }

  ///
  getRack(): Observable<any> {
    const warehouseId = localStorage.getItem('selectedwarehouseId'); // Get the city ID from localStorage

    if (warehouseId) {
      // If the cityId exists, return the request for the specific city ID
      return this.http.get(`https://mahacool-437301.el.r.appspot.com/api/rack/getid?id=${warehouseId}`);
    } else {
      // If the cityId does not exist, return the request for all containers
         return this.http.get("https://mahacool-437301.el.r.appspot.com/api/rack/all");
    }
  }


  getRackBox(warehouseId: string): Observable<any> {
    return this.http.get(`https://mahacool-437301.el.r.appspot.com/api/rack/getid?id=${warehouseId}`).pipe(
      catchError(error => {
        console.error('Error fetching rack data:', error);
        return throwError(error);
      })
    );
  }


  // Update a Warehosue by ID



 // Update a city by ID
 updateRack(id: string, updateData: Partial<Rack>): Observable<Rack> {
  return this.http.post<Rack>(`${this.baseUrl}/update?id=${id}`, updateData);
}


  // Get details of a specific Warehosue by ID
  getRackDetails(id: string): Observable<Rack> {
    return this.http.get<Rack>(`${this.baseUrl}/details`, {
    });
  }


  getOneRack(id:string){
    return this.http.get("https://mahacool-437301.el.r.appspot.com/api/rack/details?id="+ id);
  }
  addStory(id: string, storyData: { box: number, cap: number, name: string }): Observable<any> {
    const url = `${this.baseUrl}/addstory?id=${id}`;
    return this.http.post(url, storyData);
  }

}
