import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AdminService } from '../../_Service/admin.service';
import { WeightService } from '../../_Service/weight.service';
import { catchError, of, Subscription } from 'rxjs';
import { GunnyBagService } from '../../_Service/gunny-bag.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterOutlet,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isSidebarOpen = false;
  errorMessage!: string;


  constructor(

    private adminService: AdminService,private weightService:  WeightService,private gunnyBagService: GunnyBagService,
    private route:Router)

    {}


  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {


      localStorage.removeItem('user');
      // Navigate to the home page or login page
      this.route.navigate(['']);

  }

  isHistoryOpen = false;

  toggleHistory() {
    this.isHistoryOpen = !this.isHistoryOpen;
  }

  isInvoices = false;

  toggleInvoive() {
    this.isInvoices = !this.isInvoices;
  }

  weightSubscription!: Subscription;

// Variable to store the real-time weight


  weight: string = ''; // Variable to store the real-time weight
  formattedWeight: string = ''; // New variable to store formatted weight

  ngOnInit(): void {
    this.weightSubscription = this.weightService.getRealTimeWeight().subscribe(
      (newWeight) => {
        this.weight = newWeight; // Update the weight in real time
        this.formattedWeight = this.formatWeight(this.weight); // Format the weight
      },
      (error) => {
        console.error('Error receiving weight data', error);
      }
    );
  }

  formatWeight(weight: string): string {
    // Remove 'N', '=', and trim whitespace, and remove 'KG' if it exists
    return weight.replace('N', '').replace('=', '').replace(/kg$/, '').trim(); // Remove trailing KG and trim
  }
  
  

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.weightSubscription) {
      this.weightSubscription.unsubscribe();
    }
  }




  formweight(weight: string): string {
    // Remove leading zeros and return as a string
    return weight.replace(/^0+/, '').replace(/^\.+/, '0.'); // Ensure there's at least one digit before the decimal point
}

onSubmit(): void {
  // Retrieve the dryFruit object from local storage
  const dryFruit = JSON.parse(localStorage.getItem('dryFruit') || '{}');
  console.log('Retrieved dryFruit from local storage:', dryFruit); // Log the dryFruit object

  // Validate if dryFruit object exists
  if (!dryFruit || !dryFruit.customerId) {
      Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'Fisrt go to cheKIn and select city ,warehouse,rack ,dryFruitsName , Types of sack then capture work. No dry fruit data found in local storage.'
      });
      console.error('Submission failed: No dry fruit data found.'); // Log the error
      return;
  }

  // Prepare data in the desired format with checkInHistory array
  const checkInHistory = [
      {
          dryFruits: [
              {
                  name: dryFruit.name,
                  typeOfSack: dryFruit.typeOfSack,
                  weight: Number(this.formweight(this.formattedWeight)), // Use formatted weight here
                  cityName: dryFruit.cityName,
                  warehouseName: dryFruit.warehouseName,
                  rackName: dryFruit.rackName
              }
          ]
      }
  ];
  console.log('Prepared checkInHistory data:', checkInHistory); // Log the prepared data

  // Call the service method to submit the data
  this.gunnyBagService.postCustomerHistory(dryFruit.customerId, checkInHistory)
      .pipe(
          catchError(error => {
              this.errorMessage = 'There was an error submitting the form. Please try again later.';
              console.error('Error occurred during submission:', error); // Log the error
              Swal.fire({
                  icon: 'error',
                  title: 'Submission Failed',
                  text: 'There was an error submitting the form. Please try again later.'
              });
              return of(null);
          })
      )
      .subscribe(response => {
          if (response) {
              console.log('Submission response:', response); // Log the response
              Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Form submitted successfully.',
                  timer: 2000, // Set the timer for 2 seconds
                  showConfirmButton: false // Hide the OK button
              });

              // Do not close the modal
              // this.closeModal(); // Keep this commented out
          }
      });
}
}