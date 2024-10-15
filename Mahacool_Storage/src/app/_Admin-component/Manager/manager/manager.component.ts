import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddmanagerComponent } from './addmanager/addmanager.component';
import { Manager, ManagerService } from '../../../_Service/manager.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [FormsModule,CommonModule,AddmanagerComponent],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {
  manager: Manager[] = [];
  searchTerm: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 15, 20];
  isModalOpen = false;

  constructor(private managerService: ManagerService) {}

  get filteredManagers() {
    const filteredManagers = this.manager.filter(manager =>
      manager.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredManagers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.manager.filter(manager =>
      manager.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    ).length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnInit(): void {
    this.getManager();
  }

  getManager() {
    this.managerService.getManager().subscribe(
      data => {
        this.manager = data;
        console.log('Fetched managers:', this.manager);
      },
      error => {
        console.error('There was an error fetching managers!', error);
      }
    );
  }

  deletemanager(managerId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.managerService.deleteManager(managerId).subscribe(
          () => {
            Swal.fire('Deleted!', 'The manager has been deleted.', 'success');
            this.getManager(); // Refresh the manager list after deletion
          },
          error => {
            Swal.fire('Error!', 'There was a problem deleting the manager.', 'error');
            console.error('There was an error deleting the manager!', error);
          }
        );
      }
    });
  }
}
