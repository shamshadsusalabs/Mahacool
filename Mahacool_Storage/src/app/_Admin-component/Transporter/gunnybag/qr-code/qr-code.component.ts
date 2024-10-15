import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { GunnyBagService } from '../../../../_Service/gunny-bag.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { ClientService } from '../../../../_Service/client.service';
import { forkJoin } from 'rxjs';
import * as QRCode from 'qrcode';
import Swal from 'sweetalert2';

export interface DryFruit {
  cityName: string;
  name: string;
  rackName: string;
  recordId: string;
  typeOfSack: string;
  warehouseName: string;
  weight: number;
  _id: string;
  dateCheckIN: string;
}

export interface CheckInHistory {
 // Updated field name
  dryFruits: DryFruit[];
  _id: string;
}

export interface CheckInHistoryResponse {
  customerId: string;
  checkInHistory: CheckInHistory[];
}

interface ClientInfo {
  name: string;
  bussinessName: string;
}

@Component({
  selector: 'app-qr-code',
  standalone: true,
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css'],
  imports: [QRCodeModule, CommonModule, NgxPrintModule, ReactiveFormsModule],
})
export class QrCodeComponent implements OnInit {
  @Input() isOpen: boolean = false;
  customerForm: FormGroup;
  qrCodes: Array<{
    dryFruitName:string
    qrData: string,
    name: string,
    bussinessName: string,
    cityName: string,
    warehouseName: string,
    rackName: string,
    weight: number,
    recordId:string,
    dateCheckIN: string, // Updated
    _id: string
    customerId: string;
  }> = [];

  selectedData: {
    bussinessName: string;
    dateCheckIN: string; // Updated
    weight: number;
    customerId: string;
  } | null = null;

  qrData: string = '';
  isLoading: boolean = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<{ customerId: string; dateCheckIN: string }>(); // Updated

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private gunnyBagService: GunnyBagService
  ) {
    this.customerForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      dateCheckIN: ['', Validators.required], // Updated
    });
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onCancel(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.isLoading = true;
      const customerId = this.customerForm.get('customerId')?.value;
      const dateCheckIN = this.customerForm.get('dateCheckIN')?.value; // Updated

      forkJoin({
        clientInfo: this.clientService.getClientNameAndBusiness(customerId),
        checkInHistory: this.gunnyBagService.getCheckInHistory(customerId, dateCheckIN) // Updated
      }).subscribe({
        next: ({ clientInfo, checkInHistory }: { clientInfo: ClientInfo; checkInHistory: CheckInHistoryResponse }) => {
          console.log('Client Info:', clientInfo);
          console.log('Raw Check In History Response:', checkInHistory);

          // Extract checkInHistory array
          const checkInHistoryArray = checkInHistory.checkInHistory;

          // Process the data to generate QR codes
          this.qrCodes = checkInHistoryArray.flatMap((history: CheckInHistory) =>
            history.dryFruits.map((fruit: DryFruit) => ({
              qrData: JSON.stringify({
                dateCheckIN: fruit.dateCheckIN, // Updated
                dryFruits: history.dryFruits,
                customerId: customerId
              }),
              dryFruitName: fruit.name,
              name: clientInfo.name,
              bussinessName: clientInfo.bussinessName,
              cityName: fruit.cityName,
              warehouseName: fruit.warehouseName,
              rackName: fruit.rackName,
              weight: fruit.weight,
              recordId:fruit.typeOfSack,
              dateCheckIN: fruit.dateCheckIN, // Updated
              _id: fruit._id,
              customerId: customerId
            }))
          );

          // Set selectedData for modal display
          this.selectedData = {
            bussinessName: clientInfo.bussinessName,
            dateCheckIN: checkInHistoryArray[0]?.dryFruits[0]?.dateCheckIN ?? '', // Updated
            weight: checkInHistoryArray[0]?.dryFruits[0]?.weight ?? 0,
            customerId: customerId
          };

          this.qrCodes = this.qrCodes.map(qr => ({
            ...qr,
            qrData: this.generateQRCodeImage(qr.qrData)
          }));

          // Set QR data for display
          this.qrData = JSON.stringify({
            ...this.selectedData,
            customerId
          });

          console.log('Generated QR Codes:', this.qrCodes);

          this.submitForm.emit({ customerId, dateCheckIN }); // Updated
        },
        error: (err) => {
          console.error('Error:', err);

          // Check if the error contains a message from the server response
          const errorMessage = err.error?.message || 'An unexpected error occurred. Please try again later.';

          // Display error using SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,  // Show the specific error message
            footer: `Status Code: ${err.status} - ${err.statusText}` // Show status code and status text
          });

          this.isLoading = false; // stop loading on error
        },

        complete: () => this.isLoading = false
      });
    }
  }

  generateQRCodeImage(qrData: string): string {
    let base64QRCodeImageString = '';

    QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return;
      }
      base64QRCodeImageString = url; // url is a base64 string
    });

    // Asynchronously generated value - handle appropriately
    // For example, set it in a component property or return a promise

    return base64QRCodeImageString; // Might need a different approach to handle async value
  }

  printQRCode(): void {
    const printContent = document.getElementById('qrCodeSection')?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContent) {
      // Temporarily set the body content to the print content
      document.body.innerHTML = `<html><head><title>Print</title></head><body>${printContent}</body></html>`;
      window.print();
      // Restore the original body content
      document.body.innerHTML = originalContents;
    }
  }
}
