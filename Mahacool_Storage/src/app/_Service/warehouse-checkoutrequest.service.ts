import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WarehouseCheckoutrequestService {

  private apiUrl = 'https://mahacool-437301.el.r.appspot.com/api/warehouseCheckoutRequested';  // Change this to your backend URL

  constructor(private http: HttpClient) { }

  checkout(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, data);
  }

  getActiveRecords(): Observable<any> {
    return this.http.get<any>(`${ this.apiUrl }/active`);
  }

  // Method to deactivate a customer by customerId
  deactivateCustomer(customerId: string, dryFruitIds: string[]): Observable<any> {
    const body = { customerId, dryFruitIds };
    return this.http.put<any>(`${this. apiUrl}/deactivate/${customerId}`, body);
  }

  getDeactivatedRecord(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/deactivated/${customerId}`);
  }
}
