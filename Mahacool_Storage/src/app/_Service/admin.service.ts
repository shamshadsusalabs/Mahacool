import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'https://mahacool-437301.el.r.appspot.com/api/admin'; // API base URL

  constructor(private http: HttpClient) {}

  // Admin login
  login(password: string, email: string, mobile?: string): Observable<any> {
    const url = `${this.baseUrl}/login`;
    const body = { email, mobile, password };

    return this.http.post<any>(url, body);
  }
  // Admin logout
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  // Get all admins
  getAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  // Get admin by ID
  getAdminById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Create a new admin
  createAdmin(adminData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, adminData);
  }

  // Update admin details
  updateAdmin(id: string, adminData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, adminData);
  }

  // Delete admin
  deleteAdmin(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

}
