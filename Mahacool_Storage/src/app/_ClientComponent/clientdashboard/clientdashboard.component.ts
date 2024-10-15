import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../_Service/admin.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../_Service/notification.service';
import { GunnyBagService } from '../../_Service/gunny-bag.service';
import { Client, ClientService } from '../../_Service/client.service';


@Component({
  selector: 'app-clientdashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './clientdashboard.component.html',
  styleUrls: ['./clientdashboard.component.css']
})
export class ClientdashboardComponent implements OnInit {
  clientDetails: Client | null = null;
  defaultImage = 'logo/Admin.png';
  isSidebarOpen = false;
  isNotificationsOpen = false;
  notificationCount = 0;
  hasNewNotifications = false;

  constructor(
    private adminService: AdminService,
    private route: Router,
    private notificationService: NotificationService,
    private detais:GunnyBagService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadNotificationCount();
    this.notificationService.getRealTimeNotifications().subscribe(notifications => {
      this.notificationCount = notifications.length;
      this.hasNewNotifications = true; // Indicate new notifications
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const clientId = user._id; // Assuming `_id` is the ID in your user object

    if (clientId) {
      this.clientService.getClientDetails(clientId).subscribe(
        (data: Client) => {
          console.log(data);
          this.clientDetails = data;

        },
        (error) => {
          console.error('Error fetching client details:', error);

        }
      );
    } else {

    }

  }

  loadNotificationCount(): void {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notificationCount = notifications.length;
      // If notifications have been loaded once, set hasNewNotifications to false
      this.hasNewNotifications = false;
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    console.log('Attempting to remove user from localStorage...');
    localStorage.removeItem('user');
    console.log('Checking if user is removed:', localStorage.getItem('user'));

        this.route.navigate(['../../login']);

  }

  toggleNotifications(): void {
    this.hasNewNotifications = false; // Mark notifications as viewed
    this.route.navigate(['/Client/notification']);
  }
  isHistoryOpen = false;

  toggleHistory() {
    this.isHistoryOpen = !this.isHistoryOpen;
  }


  ischeckout = false;

  togglecheckout() {
    this.ischeckout = !this.ischeckout;
  }

}
