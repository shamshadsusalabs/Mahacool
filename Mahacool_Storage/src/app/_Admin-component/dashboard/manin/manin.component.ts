import { Component, OnInit } from '@angular/core';
import { GunnyBagService } from '../../../_Service/gunny-bag.service';
import { WarehouseService } from '../../../_Service/warehouse.service';
import { RackService } from '../../../_Service/rack.service';
import { CitiesService } from '../../../_Service/cities.service';
import { ClientService } from '../../../_Service/client.service';
import { ManagerService } from '../../../_Service/manager.service';
import { RouterLink, RouterModule } from '@angular/router';
import { InvoiceService } from '../../../_Service/invoice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manin',
  standalone: true,
  imports: [RouterLink, RouterModule,CommonModule],
  templateUrl: './manin.component.html',
  styleUrls: ['./manin.component.css'] // Changed to styleUrls (expects an array)
})
export class ManinComponent implements OnInit {
  totalBoxes: any;
  totalRacks: any;
  totalWarehouses: any;
  totalCity: any;
  totalclient: any;
  totalmanager: any;
  totalStock: any;
  monthlyInvoice: any;

  constructor(
    private gunnyBagService: GunnyBagService,
    private warehouseService: WarehouseService,
    private rackService: RackService,
    private citiesService: CitiesService,
    private clientService: ClientService,
    private managerService: ManagerService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    // Fetch total boxes
    this.gunnyBagService.getAllboxes().subscribe((data) => {
      this.totalBoxes = data;
      console.log(this.totalBoxes);
    });

    // Fetch total warehouses
    this.warehouseService.getAllCities().subscribe((data) => {
      this.totalWarehouses = data;
      console.log(this.totalWarehouses);
    });

    // Fetch total racks
    this.rackService.getAllRack().subscribe((data) => {
      this.totalRacks = data;
      console.log(this.totalRacks);
    });

    // Fetch total cities
    this.citiesService.getAllCities().subscribe((data) => {
      this.totalCity = data;
      console.log(this.totalCity);
    });

    // Fetch total clients
    this.clientService.getClients().subscribe((data) => {
      this.totalclient = data;
      console.log(this.totalclient);
    });

    // Fetch total managers
    this.managerService.getManager().subscribe((data) => {
      this.totalmanager = data;
      console.log(this.totalmanager);
    });

    // Fetch total stock (the total weight)
    this.gunnyBagService.getTotalWeight().subscribe((data) => {
      this.totalStock = data;

      console.log(this.totalStock);
    });

    // Fetch monthly invoices
    this.invoiceService.getInvoices().subscribe((data) => {
      this.monthlyInvoice = data;
      console.log("shvsh",this.monthlyInvoice);
    });
  }
}
