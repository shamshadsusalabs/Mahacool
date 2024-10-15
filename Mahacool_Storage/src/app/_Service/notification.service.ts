import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'https://mahacool-437301.el.r.appspot.com/api/notification'; // Adjust the URL as needed
  private socket: Socket;
  private notificationsSubject = new Subject<any[]>();

  constructor(private http: HttpClient) {
    // Initialize Socket.io client
    this.socket = io('https://mahacool-437301.el.r.appspot.com'); // Adjust the URL as needed

    // Listen for new notifications
    this.socket.on('new-notification', (notification) => {
      this.notificationsSubject.next([notification]);
    });
  }

  // Method to get customerID from local storage
  private getCustomerID(): string | null {
    const userString = localStorage.getItem('user'); // Get the user object from local storage
    if (userString) {
      try {
        const userObject = JSON.parse(userString); // Parse the JSON string into an object
        return userObject.customerID || null; // Return the customerID, or null if it doesn’t exist
      } catch (error) {
        console.error('Error parsing user object from local storage:', error);
      }
    }
    return null; // Return null if user object is not found
  }



  // Method to get notifications
  getNotifications(): Observable<any[]> {
    const customerID = this.getCustomerID();
    if (!customerID) {
      throw new Error('Customer ID not found in local storage.');
    }

    const params = new HttpParams().set('customerID', customerID);
    return this.http.get<any[]>(`${this.apiUrl}/get-notifications`, { params });
  }

  // Method to add a notification
  // Method to add a notification
addNotification(customerID: string, message: string, weight: number, dryFruitName: string): Observable<any> {
  const body = { customerID, message, weight, dryFruitName };
  return this.http.post<any>(`${this.apiUrl}/add-notification`, body);
}


  // Method to get real-time notifications
  getRealTimeNotifications(): Observable<any[]> {
    return this.notificationsSubject.asObservable();
  }
}
