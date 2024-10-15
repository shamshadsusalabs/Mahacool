import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeightService {

  private socket!: WebSocket;
  private subject: Subject<any> = new Subject();

  constructor() {
    this.connectWebSocket();
  }

  // Connect to the WebSocket server
  private connectWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:4000'); // URL for WebSocket server

    // When receiving data from the WebSocket, push it to the observable
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.subject.next(data.weight); // Push the weight data to subscribers
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.warn('WebSocket connection closed');
    };
  }

  // Observable that components can subscribe to for real-time data
  getRealTimeWeight(): Observable<any> {
    return this.subject.asObservable();
  }

}
