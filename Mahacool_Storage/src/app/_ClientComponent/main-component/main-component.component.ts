import { Component } from '@angular/core';
import { GunnyBagService } from '../../_Service/gunny-bag.service';
import { CommonModule } from '@angular/common';
export interface DryFruitDetail {
  name: string;
  cityName: string;
  warehouseName: string;
  rackName: string;
  weight: number;
}
@Component({
  selector: 'app-main-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-component.component.html',
  styleUrl: './main-component.component.css'
})
export class MainComponentComponent {

  constructor(

    private detais:GunnyBagService
  ) {}



  ngOnInit(): void {

    this.getAlldetails();
  }
  dryFruits: DryFruitDetail[] = [];
  customerId!: string;
    getAlldetails(){
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.customerId = user.customerID;

      if (this.customerId) {
        this.detais.getDryFruitWeight(this.customerId).subscribe(
          (data) => {
            this.dryFruits = data;
            console.log(this.dryFruits);
          },
          (error) => {
            console.error('Error fetching dry fruit details:', error);
          }
        );
      } else {
        console.error('Customer ID not found in local storage.');
      }
    }

}
