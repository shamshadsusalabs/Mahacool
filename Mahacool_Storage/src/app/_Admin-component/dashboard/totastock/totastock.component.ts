import { Component, OnInit } from '@angular/core';
import { GunnyBagService } from '../../../_Service/gunny-bag.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

interface TotalWeightResponse {
  grandTotalStock: number;
  totalWeights: Array<{ customerId: string; totalWeight: number }>;
}

@Component({
  selector: 'app-totastock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './totastock.component.html',
  styleUrls: ['./totastock.component.css']
})
export class TotastockComponent implements OnInit {
  grandTotalStock: number = 0;
  totalWeights: Array<{ customerId: string; totalWeight: number }> = [];
  loading: boolean = true;

  constructor(private gunnyBagService: GunnyBagService) {}

  ngOnInit(): void {
    // Show a loading spinner
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we fetch the data.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.gunnyBagService.getTotalWeight().subscribe({
      next: (data: TotalWeightResponse) => {
        this.grandTotalStock = data.grandTotalStock;
        this.totalWeights = data.totalWeights;
        this.loading = false;

        // Close the loading spinner
        Swal.close();
      },
      error: (err) => {
        console.error("Error fetching total weight:", err);
        this.loading = false;

        // Show an error message
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch data. Please try again later.',
        });
      }
    });
  }
}
