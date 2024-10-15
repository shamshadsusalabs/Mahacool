import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private baseUrl = 'https://mahacool-437301.el.r.appspot.com/api/client';  // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Call to request OTP
  requestOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/password-reset-request`, { email });
  }

  // Call to reset password with OTP and new password
  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/password-reset`, { email, otp, newPassword });
  }
}
