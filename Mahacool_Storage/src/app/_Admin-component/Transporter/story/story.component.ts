import { Component } from '@angular/core';
import { Rack, RackService } from '../../../_Service/rack.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './story.component.html',
  styleUrl: './story.component.css'
})
export class StoryComponent {
  racks: any[] = [];
  searchTerm: string = '';

  confirmInput: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  isModalOpen: boolean = false;
  editData: any = null;
  name: string = '';

  constructor(private rackService: RackService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllRacks();
  }

  get filteredItems() {
    return (this.racks[0]?.story || []).filter((item: { name: string; }) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get totalItems() {
    return this.filteredItems.length;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredItems.slice(start, end);
  }





  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getAllRacks(): void {
    const selectedRackId = localStorage.getItem('selectedrackId');

    if (selectedRackId) {
      this.rackService.getOneRack(selectedRackId).subscribe(
        (data: any) => {
          this.racks = [data];
          this.currentPage = 1;  // Reset to the first page
        },
        error => console.log('Error fetching rack:', error)
      );
    } else {
      console.error('No selected rack ID found in local storage.');
    }
  }

  openModal(story: any) {
    this.name = story.name;
    this.editData = story;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  updateStoryName() {
    let m = localStorage.getItem('selectedrackId');

    const bu = {
      "name" : this.name,
      "sid"  : this.editData.sid,
      "id"   : m
    };

    this.http.post('https://mahacool-437301.el.r.appspot.com /api/rack/updatestoryname', bu).subscribe(
      result => {
        console.log(result);
        alert("Data Saved");
        this.closeModal();  // Close modal on success
        this.getAllRacks(); // Refresh data
      },
      err => {
        console.log(err);
        alert("Something went wrong!");
      }
    );
  }
}


