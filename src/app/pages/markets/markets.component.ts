import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Section } from '../models/section';
import { Market } from '../models/market';



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
        { id: 'R1', type: 'Gıda', products: [{ id: '001', name: 'Pirinç' }, { id: '002', name: 'Ekmek' }] },
        { id: 'R2', type: 'Temizlik', products: [{ id: '003', name: 'Bez' }, { id: '004', name: 'Deterjan' }] },
        { id: 'R3', type: 'Kırtasiye', products: [{ id: '005', name: 'Kalem' }] },
        { id: 'R4', type: 'Gıda', products: [{ id: '006', name: 'Makarna' }] }
      ]
    },
    {
      name: 'Market B',
      sections: [
        { id: 'R1', type: 'Gıda', products: [{ id: '007', name: 'Un' }] },
        { id: 'R2', type: 'Temizlik', products: [{ id: '008', name: 'Sabun' }] },
        { id: 'R3', type: 'Kırtasiye', products: [{ id: '009', name: 'Defter' }] }
      ]
    }
  ];
  filteredMarkets = [...this.markets];  // Tüm marketler başlangıçta listelenir
  ngOnChanges() {
    this.filterProducts(this.searchQuery);  // Arama terimi değiştiğinde filtrele
  }
  // Ürünleri arama terimine göre filtrele
  filterProducts(term: string) {
    this.filteredMarkets = this.markets.map(market => {
      const filteredSections = market.sections
        .map(section => ({
          ...section,
          products: section.products.filter(product => product.name.toLowerCase().includes(term.toLowerCase()))
        }))
        .filter(section => section.products.length > 0);

      return {
        ...market,
        sections: filteredSections
      };
    }).filter(market => market.sections.length > 0);  // Boş reyonları gizle
  }
  // Eşsiz section (reyon) türlerini döndür
  getUniqueSectionTypes() {
    const typesSet = new Set<string>();

    this.markets.forEach(market => {
      market.sections.forEach(section => {
        typesSet.add(section.type); // Her reyonun türünü set'e ekle
      });
    });

    return Array.from(typesSet); // Set'i diziye çevir ve döndür
  }
  showAddProductModal(sections: Section[]) {
    // Create options for the existing sections (reyon) where the product can be added
    const sectionOptions = sections.map(section => `<option value="${section.id}">${section.id}</option>`).join('');
  
    Swal.fire({
      title: '<h2 style="color: white;">Ürün Ekle</h2>',
      html: `
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
          <div style="width: 100%;">
            <label for="productId" style="display: block; font-weight: 500; color: #ccc; margin-bottom: 5px;">Ürün ID</label>
            <input id="productId" placeholder="Ürün ID" type="text" style="width: 100%; padding: 10px; font-size: 14px; color: white; background-color: #1a1a1a; border: 1px solid #333; border-radius: 5px;">
          </div>
          <div style="width: 100%;">
            <label for="productName" style="display: block; font-weight: 500; color: #ccc; margin-bottom: 5px;">Ürün Adı</label>
            <input id="productName" placeholder="Ürün Adı" type="text" style="width: 100%; padding: 10px; font-size: 14px; color: white; background-color: #1a1a1a; border: 1px solid #333; border-radius: 5px;">
          </div>
          <div style="width: 100%;">
            <label for="sectionSelect" style="display: block; font-weight: 500; color: #ccc; margin-bottom: 5px;">Eklenilecek Reyon</label>
            <select id="sectionSelect" style="width: 100%; padding: 10px; font-size: 14px; color: white; background-color: #1a1a1a; border: 1px solid #333; border-radius: 5px;">
              ${sectionOptions}
            </select>
          </div>
        </div>
      `,
      background: '#121212',
      width: '400px',
      showCancelButton: true,
      confirmButtonText: 'Ekle',
      cancelButtonText: 'İptal',
      customClass: {
        confirmButton: 'swal2-confirm-button',
        cancelButton: 'swal2-cancel-button'
      },
      preConfirm: () => {
        const productId = (document.getElementById('productId') as HTMLInputElement).value;
        const productName = (document.getElementById('productName') as HTMLInputElement).value;
        const sectionId = (document.getElementById('sectionSelect') as HTMLSelectElement).value;
  
        // Validate that all fields are filled
        if (!productId || !productName || !sectionId) {
          Swal.showValidationMessage(`Lütfen tüm alanları doldurun!`);
          return false;
        }
  
        return { productId, productName, sectionId };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { productId, productName, sectionId } = result.value;
  
        // Find the selected section
        const targetSection = sections.find(section => section.id === sectionId);
        if (targetSection) {
          // Add the product to the selected section
          const newProduct = { id: productId, name: productName };
          targetSection.products.push(newProduct);
  
          Swal.fire('Başarılı!', 'Ürün başarıyla eklendi.', 'success');
        } else {
          Swal.fire('Hata', 'Seçilen reyon bulunamadı.', 'error');
        }
      }
    });
  }
  
  
  
  showAddSectionModal(market: Market) {
    // Gather unique section types from the provided market (or all markets if needed)
    const sectionTypes = [...new Set(market.sections.map((section: Section) => section.type))];
  
    // Create options for section types
    const sectionTypeOptions = sectionTypes.map(type => `<option value="${type}">${type}</option>`).join('');
  
    // Create option for market name (since the market is fixed)
    const marketOption = `<option value="${market.name}">${market.name}</option>`;
  
    Swal.fire({
      title: 'Reyon Ekle',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div>
            <label for="sectionId" style="display: block; font-weight: 500;">Reyon Adı</label>
            <input id="sectionId" class="swal2-input" placeholder="Reyon Adı" type="text" style="width: 100%;">
          </div>
          <div>
            <label for="sectionType" style="display: block; font-weight: 500;">Reyon Türü</label>
            <select id="sectionType" class="swal2-input" style="width: 100%;">
              ${sectionTypeOptions}
            </select>
          </div>
          <div>
            <label for="marketSelect" style="display: block; font-weight: 500;">Market</label>
            <select id="marketSelect" class="swal2-input" style="width: 100%;" disabled>
              ${marketOption}
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ekle',
      cancelButtonText: 'İptal',
      preConfirm: () => {
        const sectionId = (document.getElementById('sectionId') as HTMLInputElement).value;
        const sectionType = (document.getElementById('sectionType') as HTMLSelectElement).value;
  
        if (!sectionId || !sectionType) {
          Swal.showValidationMessage(`Lütfen tüm alanları doldurun!`);
          return false;
        }
  
        return { sectionId, sectionType };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { sectionId, sectionType } = result.value;
  
        // Add the new section to the selected market
        const newSection = {
          id: sectionId,
          type: sectionType,
          products: []
        };
        market.sections.push(newSection);
        Swal.fire('Başarılı!', 'Reyon başarıyla eklendi.', 'success');
      }
    });
  }
}
