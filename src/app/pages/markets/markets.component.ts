import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.css']
})
export class MarketsComponent implements OnChanges {
  @Input() searchQuery: string = '';  // Arama terimini alıyoruz

  markets = [
    {
      name: 'Market A',
      sections: [
        { id: 'R1', type: 'Gıda', products: ['Pirinç', 'Ekmek', 'Un', 'Makarna'] },
        { id: 'R2', type: 'Temizlik', products: ['Bez', 'Deterjan', 'Sabun', 'Sünger'] },
        { id: 'R3', type: 'Kırtasiye', products: ['Kalem', 'Defter', 'Silgi'] },
        { id: 'R4', type: 'Gıda', products: ['Pirinç', 'Un', 'Bulgur', 'Salça'] }
      ]
    },
    {
      name: 'Market B',
      sections: [
        { id: 'R1', type: 'Gıda', products: ['Ekmek', 'Un', 'Makarna'] },
        { id: 'R2', type: 'Temizlik', products: ['Sabun', 'Toz Bezi'] },
        { id: 'R3', type: 'Kırtasiye', products: ['Silgi', 'Kalemtıraş', 'Kalem', 'Defter'] }
      ]
    }
  ];

  filteredMarkets = [...this.markets];  // İlk başta tüm marketler görünsün

  ngOnChanges() {
    this.filterProducts(this.searchQuery);  // Arama terimi her değiştiğinde filtrele
  }

  // Ürünleri arama terimine göre filtreleyen fonksiyon
  filterProducts(term: string) {
    this.filteredMarkets = this.markets.map(market => {
      const filteredSections = market.sections
        .map(section => ({
          ...section,
          products: section.products.filter(product => product.toLowerCase().includes(term.toLowerCase()))
        }))
        .filter(section => section.products.length > 0);

      return {
        ...market,
        sections: filteredSections
      };
    }).filter(market => market.sections.length > 0);  // Boş reyonları gizle
  }
}
