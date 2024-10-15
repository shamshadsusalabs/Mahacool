import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly url: string = 'https://mahacool-437301.el.r.appspot.com'; // Replace with your server URL

  constructor() {
    this.socket = io(this.url, {
      transports: ['websocket'], // Ensure WebSocket transport is used
    });
  }

  onNotification(callback: (notification: any) => void): void {
    this.socket.on('new-notification', callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
