import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-uplodgunnybox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uplodgunnybox.component.html',
  styleUrls: ['./uplodgunnybox.component.css']
})
export class UplodgunnyboxComponent {


  isLoading = false;
  @Output() uploadCompleted = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  fileUpload(event: any): void {
    this.setLoadingState(true);
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      this.showError('No File Selected', 'Please select an Excel file to upload.');
      return;
    }

    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      this.showError('Invalid File Type', 'Please select a valid Excel file (.xlsx or .xls).');
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);

    fileReader.onload = () => {
      try {
        const binaryData = fileReader.result as string;
        const workbook = XLSX.read(binaryData, { type: 'binary' });

        const dataArray: any[] = workbook.SheetNames.reduce<any[]>((acc, sheetName) => {
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

          const formattedData = sheetData.map(item => ({
            name: item.BNo.toString(),
            type: item.Btype,
            client: item.Client,
            city: item.City,
            container: item.WNo,
            rack: item.CNo,
            story: item.SNo,
            sid: item.SNo,
            checkin: '',
            checkout: '',
            addby: new Date().toISOString(),
          }));

          return [...acc, ...formattedData];
        }, []);

        if (dataArray.length > 0) {
          this.uploadData(dataArray);
        } else {
          this.showError('No Data Found', 'The selected Excel file does not contain any data.');
        }
      } catch (error) {
        console.error('Error reading file:', error);
        this.showError('File Processing Error', 'An error occurred while processing the file. Please try again.');
      }
    };

    fileReader.onerror = () => {
      console.error('File reading failed');
      this.showError('File Reading Failed', 'Failed to read the file. Please try again.');
    };
  }

  private uploadData(dataArray: any[]): void {
    this.http.post('https://mahacool-437301.el.r.appspot.com/api/box/add', dataArray)
      .subscribe({
        next: () => {
          this.setLoadingState(false);
          Swal.fire({
            icon: 'success',
            title: 'Upload Successful',
            text: 'The file was uploaded successfully!'
          }).then(() => {
            this.uploadCompleted.emit(); // Notify parent component
          });
        },
        error: (error) => {
          console.error('Upload failed:', error);
          this.showError('Upload Failed', 'The file upload failed. Please try again.');
        }
      });
  }

  private setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
    if (isLoading) {
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while the file is being uploaded.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } else {
      Swal.close();
    }
  }

  private showError(title: string, text: string): void {
    this.setLoadingState(false);
    Swal.fire({
      icon: 'error',
      title,
      text
    });
  }
}
