import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
export interface Warehouse {
  _id?: string;       // The unique identifier of the Warehosue
  name: string;
  cid:string;
  noofcont?:string;      // The name of the Warehosue
  active: boolean;   // Indicates whether the Warehosue is active

  status?:boolean;      // Version key set by MongoDB (can be optional)
}
@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private baseUrl = 'https://mahacool-437301.el.r.appspot.com/api/container';

  constructor(private http: HttpClient) {}

  // Get all active cities
  getAllActiveCities(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.baseUrl}/getall`);
  }

  // Get all cities
  getAllCities(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.baseUrl}/all`);
  }

  // Add a new Warehosue
  addWarehosue(WarehosueData: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${this.baseUrl}/add`, WarehosueData);
  }

  // Remove a Warehosue by ID
  removeWarehosue(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/remove`, { id });
  }

  ///
  getWarehouse(): Observable<any> {
    const cityId = localStorage.getItem('selectedCityId'); // Get the city ID from localStorage

    if (cityId) {
      // If the cityId exists, return the request for the specific city ID
      return this.http.get(`https://mahacool-437301.el.r.appspot.com/api/container/getid?id=${cityId}`);
    } else {
      // If the cityId does not exist, return the request for all containers
      return this.http.get("https://mahacool-437301.el.r.appspot.com/api/container/all");
    }
  }



  getWareforbox(cityId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getid?id=${cityId}`).pipe(
      catchError(error => {
        console.error('Error fetching warehouse data:', error);
        return throwError(error);
      })
    );
  }

  // Update a Warehosue by ID



 // Update a city by ID
 updatewarehouse(id: string, updateData: Partial<Warehouse>): Observable<Warehouse> {
  return this.http.post<Warehouse>(`${this.baseUrl}/update?id=${id}`, updateData);
}


  // Get details of a specific Warehosue by ID
  getWarehosueDetails(id: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.baseUrl}/details`, {
    });
  }

  getWarehouseDetailsforClient(cityId: string): Observable<Warehouse[]> {
    // Construct the URL with the cityId as a path parameter
    return this.http.get<Warehouse[]>(`${this.baseUrl}/getid?id=${cityId}`);
  }

  private apiUrl = 'https://mahacool-437301.el.r.appspot.com/api/WarehouseRequested';

  createWarehouseRequest(selectedData: any): Observable<any> {
    const body = {
      selectedData: selectedData,

    };

    return this.http.post(`${this.apiUrl}/warehouse-request`, body);
  }


  getAllWarehouseRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getall`);
  }

  updateRates(rates: { rate: number, requestId: string, iddetails: string }[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-rates`, { rates });
  }

  updateStatusByUser(userId: string): Observable<any> {
    const endpoint = `${this.apiUrl}/update-status-by-user`; // Update the endpoint path as needed
    return this.http.post<any>(endpoint, { userId });
  }

  getDetailsByCustomerID(customerID: string): Observable<any> {
    const url = `${this.apiUrl}/details/${customerID}`;
    return this.http.get<any>(url);
  }
}
