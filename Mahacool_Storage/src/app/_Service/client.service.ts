import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


 export interface Client {
  _id?: string; // Optional if generated by the backend
  name: string;
  email: string;
  bussinessName: string;
  password: string;
  mobile: string;
  address: string;
  gstNumber?: string;  // Optional field
  role?: string;
  customerID?:string;
  image?:string;
}

export interface Customer {
  name: string;
  businessName: string;
  email: string;
  mobile: string;
  address?: string;
  gstNumber?: string;
  role: string;
  customerID: string;

}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'https://mahacool-437301.el.r.appspot.com/api/client'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }


  getCustomerById(customerID: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customer/${customerID}`).pipe(
        catchError(this.handleError)
    );
}

private handleError(error: HttpErrorResponse) {
    // Handle error appropriately
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
}


  // Method to add a new client
  addClient(clientData: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/add`, clientData);
  }

  getClientNameAndBusiness(customerID: string): Observable<{ name: string, bussinessName: string }> {
    return this.http.get<{ name: string, bussinessName: string }>(`${this. apiUrl }/client-name-business?customerID=${customerID}`);
  }

  // Method to get all clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/getall`);
  }


  deleteClient(clientId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/remove`, { id: clientId });
  }


  register(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/register`, client);
  }
  login(password: string, email?: string, mobile?: string, customerID?: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    const body: any = { password };

    if (email) {
      body.email = email;
    } else if (mobile) {
      body.mobile = mobile;
    } else if (customerID) {
      body.customerID = customerID;
    }

    return this.http.post<any>(url, body);
  }


  getClientData(clientIds: string[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/clients`, { clientIds });
  }
  getClientDetails(id: string): Observable< Client> {
    // Send GET request with ID in the URL
    return this.http.get< Client>(`${this.apiUrl}/details?id=${id}`);
  }


  updateClientPassword(id: string, updateData: { password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/updatewithimage?id=${id}`, updateData);
  }
// client.service.ts

updateClientDetails(clientId: string, formData: FormData): Observable<any> {
  return this.http.post(`https://mahacool-437301.el.r.appspot.com/api/client/update?id=${clientId}`, formData);
}


  private apiUrl1 = 'https://mahacool-437301.el.r.appspot.com/api/PasswordResetRequest';
  requestPasswordReset(clientId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl1}/password-reset`, { id: clientId });
  }


  getAllResetRequests(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}/getAll`);
  }


  markPasswordUpdated(clientId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl1}/status`, { clientId });
  }
  getClientforInvoice(customerID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/invoice-details/${customerID}`);
  }



  private apiUrl2 = 'https://mahacool-437301.el.r.appspot.com/api/client';

  passwordresetRequest(email?: string, mobile?: string, customerID?: string): Observable<any> {
    const url = `${this.apiUrl2}/password-resetRequest-Details`;
    const body: any = {};

    if (email) {
      body.email = email;
    } else if (mobile) {
      body.mobile = mobile;
    } else if (customerID) {
      body.customerID = customerID;
    } else {
      throw new Error('At least one of email, mobile, or customerID must be provided.');
    }

    return this.http.post<any>(url, body);
  }

  private apiUrl4 = 'https://mahacool-437301.el.r.appspot.com/api/client';

  private apiUrl6 = 'https://mahacoolpdfapi.onrender.com/api/client';

  uploadFile(file: File, clientId: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file); // Append the file to formData

    // Make POST request to the upload endpoint
    return this.http.post(`${this. apiUrl6}/upload/${clientId}`, formData);
  }


  getFileUrls(customerId: string): Observable<any> {
    const url = `${this.apiUrl4}/files/${customerId}`;
    return this.http.get<any>(url);
  }
  private apiUrl5 = 'https://mahacool-437301.el.r.appspot.com/api/client/file-urls';

  getFileUrlsForAdmin(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl5);
  }
}