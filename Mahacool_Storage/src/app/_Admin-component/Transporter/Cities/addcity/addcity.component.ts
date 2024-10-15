import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitiesService } from '../../../../_Service/cities.service';

@Component({
  selector: 'app-addcity',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './addcity.component.html',
  styleUrl: './addcity.component.css'
})
export class AddcityComponent {
  cityForm!: FormGroup;
  @Output() close = new EventEmitter<void>();
  @Output() cityAdded = new EventEmitter<void>();  // Correct event name

  constructor(private fb: FormBuilder, private cityService: CitiesService) {}

  ngOnInit(): void {
    this.cityForm = this.fb.group({
      name: ['', [Validators.required]],
      active: [false],
    });
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      this.cityService.addCity(this.cityForm.value).subscribe(
        (data) => {
          console.log(data);
          this.closeModal();
          this.cityAdded.emit(); // Ensure this event is emitted
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  closeModal() {
    this.close.emit(); // Emit the close event
  }
}
