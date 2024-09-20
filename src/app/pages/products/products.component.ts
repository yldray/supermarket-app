import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule], // CommonModule'u ekleyelim ki *ngFor çalışsın
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  // Örnek ürün verisi
  products = [
    {
      name: 'Ekmek',
      price: 5,
      section: 'Gıda'
    },
    {
      name: 'Kalem',
      price: 2,
      section: 'Kırtasiye'
    },
    {
      name: 'Deterjan',
      price: 15,
      section: 'Temizlik'
    }
  ];

  // Ürün eklemek ve silmek için methodlar eklenebilir
  addProduct() {
    // Yeni ürün ekleme işlemi
  }

  editProduct(product: any) {
    // Ürünü düzenleme işlemi
  }

  deleteProduct(product: any) {
    // Ürünü silme işlemi
    this.products = this.products.filter(p => p !== product);
  }
}
