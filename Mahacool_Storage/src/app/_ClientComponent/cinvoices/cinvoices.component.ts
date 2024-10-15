import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GunnyBagService } from '../../_Service/gunny-bag.service';
import { HttpClient } from '@angular/common/http';
import { ClientService } from '../../_Service/client.service';


@Component({
  selector: 'app-cinvoices',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cinvoices.component.html',
  styleUrls: ['./cinvoices.component.css']
})
export class CinvoicesComponent implements OnInit {
  fileUrls: { url: string, date: string }[] = [];
  customerId: string | null = null; // Initialize as null

  constructor(private fileService: ClientService) {}

  ngOnInit(): void {
    this.getCustomerIdAndLoadFiles();
  }

  getCustomerIdAndLoadFiles(): void {
    // Retrieve and parse the user object from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userObject = JSON.parse(user);
      this.customerId = userObject.customerID; // Extract customerId from user object

      if (this.customerId) {
        this.loadFileUrls(this.customerId);
      } else {
        console.error('Customer ID not found in user object');
      }
    } else {
      console.error('User object not found in localStorage');
    }
  }

  loadFileUrls(customerId: string): void {
    this.fileService.getFileUrls(customerId).subscribe(
      data => {
        this.fileUrls = data.fileUrls;
        console.log(data);
      },
      error => {
        console.error('Error fetching file URLs', error);
      }
    );
  }
}
