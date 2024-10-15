import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitiesService, City } from '../../../../_Service/cities.service';
import { Warehouse, WarehouseService } from '../../../../_Service/warehouse.service';
import { Rack, RackService } from '../../../../_Service/rack.service';
import { GunnyBagService } from '../../../../_Service/gunny-bag.service';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { WeightService } from '../../../../_Service/weight.service';

@Component({
  selector: 'app-add-gunny-bag',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-gunny-bag.component.html',
  styleUrls: ['./add-gunny-bag.component.css'] // Fixed the property from 'styleUrl' to 'styleUrls'
})
export class AddGunnyBagComponent {
  cities: City[] = [];
  warehouses: Warehouse[] = [];
  racks: Rack[] = [];
  checkInForm!: FormGroup;
  dryFruitsList: string[] = [
    'Almonds', 'Cashews', 'Raisins', 'Walnuts', 'Pistachios',
    'Dried Apricots', 'Dates', 'Figs', 'Prunes', 'Brazil Nuts',
    'Pecans', 'Hazelnuts', 'Sunflower Seeds', 'Pumpkin Seeds',
    'Chia Seeds'
  ];

  @Output() formSubmitted = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();
  errorMessage!: string;
  weight: number =0;

  constructor(private fb: FormBuilder, private cityService: CitiesService, private warehouseservice: WarehouseService, private rackservice: RackService, private gunnyBagService: GunnyBagService, private weightService: WeightService) {}

  ngOnInit(): void {
    this.checkInForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      dryFruits: this.fb.array([this.createDryFruitGroup()])
    });

    this.getAllCities();

    // Subscribe to weight data
    this.weightService.getRealTimeWeight().subscribe(
      (newWeight) => {
        this.weight = newWeight; // Update the weight in real time
        this.updateDryFruitWeights(newWeight);
      },
      (error) => {
        console.error('Error receiving weight data', error);
      }
    );
  }

  get dryFruits(): FormArray {
    return this.checkInForm.get('dryFruits') as FormArray;
  }

  createDryFruitGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      typeOfSack: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(1)]],
      cityName: ['', Validators.required],
      warehouseName: ['', Validators.required],
      rackName: ['', Validators.required],
    });
  }

 saveDryFruitToLocalStorage(dryFruit: any, customerId: string): void {
  // Create a new dry fruit object without the weight
  const dryFruitObject = {
    customerId: customerId, // Include customerId
    name: dryFruit.name,
    typeOfSack: dryFruit.typeOfSack,
    cityName: this.cities.find(city => city._id === dryFruit.cityName)?.name || dryFruit.cityName,
    warehouseName: this.warehouses.find(warehouse => warehouse._id === dryFruit.warehouseName)?.name || dryFruit.warehouseName,
    rackName: this.racks.find(rack => rack._id === dryFruit.rackName)?.name || dryFruit.rackName
  };
  
  // Save the dry fruit object directly to local storage
  localStorage.setItem('dryFruit', JSON.stringify(dryFruitObject));
}

  
  
  
  

  closeModal(): void {
    this.modalClosed.emit();
  }

  getAllCities(): void {
    this.cityService.getAllCities().subscribe(
      data => {
        this.cities = data;
        console.log(this.cities);
      },
      error => console.log('Error fetching cities:', error)
    );
  }

  onCityChange(event: Event): void {
    const selectedCityId = (event.target as HTMLSelectElement).value;
    if (selectedCityId) {
      // Save selected city ID to local storage
      localStorage.setItem('selectedCityId', selectedCityId);
      console.log('Selected City ID:', selectedCityId);
      this.getAllwarehouses();
    }
  }

  getAllwarehouses(): void {
    const cityId = localStorage.getItem('selectedCityId');

    if (!cityId) {
      console.error('City ID is not available in localStorage');
      return; // or handle this case appropriately
    }

    this.warehouseservice.getWareforbox(cityId).subscribe(
      data => {
        this.warehouses = data;
        console.log(this.warehouses);
      },
      error => console.log('Error fetching warehouses:', error)
    );
  }

  onWarehouseChange(event: Event): void {
    const selectedWarehouseId = (event.target as HTMLSelectElement).value;
    if (selectedWarehouseId) {
      // Save the selected warehouse ID as a single value
      localStorage.setItem('selectedWarehouseId', selectedWarehouseId);
      console.log('Selected Warehouse ID:', selectedWarehouseId);
      this.getAllracks();
    }
  }

  getAllracks(): void {
    const warehouseId = localStorage.getItem('selectedWarehouseId');

    if (!warehouseId) {
      console.error('Warehouse ID is not available in localStorage');
      return; // or handle this case appropriately
    }

    this.rackservice.getRackBox(warehouseId).subscribe(
      data => {
        this.racks = data;
        console.log("rack", this.racks);
      },
      error => console.log('Error fetching racks:', error)
    );
  }

  onRackChange(event: Event): void {
    const selectedRackId = (event.target as HTMLSelectElement).value;
    console.log('Selected Rack ID:', selectedRackId);
    // Perform any additional actions needed on rack selection
  }

  onWeightInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Update the weight control with the manual input
    this.dryFruits.controls.forEach(control => {
      control.get('weight')?.setValue(value);
    });
  }

  updateDryFruitWeights(weight: string) {
    const numericPart = weight.split('=')[0].replace('N', '').trim();
    const parsedWeight = parseFloat(numericPart);

    // Check if parsedWeight is valid
    if (!isNaN(parsedWeight) && parsedWeight > 0) {
        this.weight = parsedWeight;
        this.dryFruits.controls.forEach(control => {
            control.get('weight')?.setValue(parsedWeight); // Update each weight control
        });
    } else {
        console.error("Invalid weight input:", weight);
    }
}



onSubmit(): void {
  // Validate the form
  if (this.checkInForm.invalid) {
    return;
  }

  // Extract values from the form
  const customerId = this.checkInForm.get('customerId')?.value;
  const dryFruits = this.checkInForm.get('dryFruits')?.value;

  // Save each dry fruit to local storage
  dryFruits.forEach((dryFruit: any) => {
    this.saveDryFruitToLocalStorage(dryFruit, customerId);
  });

  // Prepare data in the desired format with checkInHistory array
  const checkInHistory = [
    {
      dryFruits: dryFruits.map((item: any) => ({
        name: item.name,
        typeOfSack: item.typeOfSack,
        weight: item.weight, // You can keep weight for submission if needed
        cityName: this.cities.find(city => city._id === item.cityName)?.name || item.cityName,
        warehouseName: this.warehouses.find(warehouse => warehouse._id === item.warehouseName)?.name || item.warehouseName,
        rackName: this.racks.find(rack => rack._id === item.rackName)?.name || item.rackName
      }))
    }
  ];

  // Call the service method to submit the data
  this.gunnyBagService.postCustomerHistory(customerId, checkInHistory)
    .pipe(
      catchError(error => {
        this.errorMessage = 'There was an error submitting the form. Please try again later.';
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
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Form submitted successfully.'
        });
        this.formSubmitted.emit(response);

        // Reset only the weight fields in the dryFruits FormArray
        this.dryFruits.controls.forEach(control => {
          control.get('weight')?.reset(0); // Reset weight to 0
        });
        // Do not close the modal
        // this.closeModal(); // Keep this commented out
      }
    });
}
}