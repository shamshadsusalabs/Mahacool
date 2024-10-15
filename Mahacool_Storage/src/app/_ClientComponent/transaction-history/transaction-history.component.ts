import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent {
  transactions = [
    {
      transactionId: 'TX123456',
      requestedId: 'REQ78910',
      amount: '50000',
      cityName: 'Delhi',
      warehouseName: 'ABC',
      totalKg: '150 KG'
    },
    {
      transactionId: 'TX654321',
      requestedId: 'REQ78911',
      amount: '30000',
      cityName: 'Delhi',
      warehouseName: 'UVB',
      totalKg: '100 KG'
    },
    {
      transactionId: 'TX987654',
      requestedId: 'REQ78912',
      amount: '40050',
      cityName: 'Gurgao',
      warehouseName: 'CAB',
      totalKg: '120 KG'
    }
  ];

  generatePDF() {
    const doc = new jsPDF();
    const tableColumn = ["Transaction ID", "Requested ID", "Amount", "City Name", "Warehouse Name", "Total KG"];
    const tableRows = this.transactions.map(transaction => [
      transaction.transactionId,
      transaction.requestedId,
      transaction.amount,
      transaction.cityName,
      transaction.warehouseName,
      transaction.totalKg
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 10
    });
    doc.save('transaction-history.pdf');
  }
}
