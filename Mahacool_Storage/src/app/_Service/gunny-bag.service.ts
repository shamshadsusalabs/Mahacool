import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface History {
  cid: string;
  box: string;
  time: string;  // Consider using Date type if it's a date
  status: string;
  __v: number;
}


export interface GunnyBag {
  _id: string;
  name: string;
  type: string;
  city: string;
  container: string;
  rack: string;
  story: string;
  addby: string;  // Consider using Date type if you plan to handle date operations
  sid: string;
  history: History[];
  __v: number;
  mount: string;  // Consider using Date type if it's a date
  mountid: string;
  position: string;
  rsid: string;
  unmount: string;  // Consider using Date type if it's a date
  unmountid: string;
  picked:string;
  deliver :string;
  client:string;
}


export interface Invoice {
  dateCheckIN: string;
  dateCheckout: string;
  dryFruitName: string;
  recordId: string;
  status: boolean;
  storedHours: string;
  totalAmount: number;
  weight: number;
  _id: string;
}

@Injectable({
  providedIn: 'root'
})
export class GunnyBagService {

  private apiUrl = 'https://mahacool-437301.el.r.appspot.com/api/box';  // The provided API endpoint

  constructor(private http: HttpClient) { }

  // GET request to fetch all data
  getAllData(): Observable<GunnyBag[]> {
    return this.http.get<GunnyBag[]>(`${this.apiUrl}/getall`);
  }


  deleteItem(body: { _id: string }) {
    return this.http.post(`${this.apiUrl}/remove`, body);
  }

  private apiUrl1 = 'https://mahacool-437301.el.r.appspot.com/api/CustomerHistory';

  getCustomerDetailsforeach(customerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl1}/customer-details?customerId=${customerId}`);
  }
  postCustomerHistory(customerId: string, checkInHistory: any[]): Observable<any> {
    const body = {
      customerId,
      checkInHistory
    };

    // Send the POST request
    return this.http.post<any>(`${this.apiUrl1}/customer-history`, body);
  }


  getAllCustomerHistories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}/getAll-history`);
  }

  getCheckInHistory(customerId: string, dateCheckIN: string): Observable<any> {
    const body = { customerId, dateCheckIN};
    return this.http.post<any>(`${this.apiUrl1}/getCheckInHistory`, body);
  }


  getAllboxes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}/calculate-total-checkin-history-length`);
  }


  getCustomerDetails(): Observable<any> {
    // Retrieve customerId from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const customerId = user.customerID;

    if (!customerId) {
      throw new Error('No customerId found in localStorage');
    }

    // Construct the request URL
    const url = `${this.apiUrl1}/customer-details?customerId=${customerId}`;

    // Call the backend endpoint
    return this.http.get<any>(url);
  }

  getInvoices(customerId: string): Observable<Invoice[]> {
    const params = new HttpParams().set('customerId', customerId);
    return this.http.get<Invoice[]>(`${this.apiUrl1}/invoices`, { params });
  }


  // Get all invoices for all customers
  getAllInvoices(): Observable<any> {
    return this.http.get(`${this.apiUrl1}/all-invoices-for-Approved`);
  }
  getAllInvoice(): Observable<any> {
    return this.http.get(`${this.apiUrl1}/all-invoices`);
  }
  updateInvoiceStatus(customerId: string, recordIds: string[]): Observable<any> {
    const url = `${this.apiUrl1}/update-invoice-status`; // Your Express API endpoint
    const body = { customerId, recordIds }; // Send customerId and array of recordIds

    return this.http.put(url, body); // Simple PUT request
  }

  getDryFruitWeight(customerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl1}/dryFruitWeight/${customerId}`);
  }

  deleteDryFruit(customerId: string, recordId: string): Observable<any> {
    const url = `${this.apiUrl1}/customer-history/${customerId}/dryfruit/${recordId}`;

    return this.http.delete(url);
  }

  getTotalWeight(): Observable<any> {
    return this.http.get(`${this.apiUrl1}/total-weight`);
  }
}
