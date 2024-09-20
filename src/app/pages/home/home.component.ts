import { Component } from '@angular/core';
import { NavBarComponent } from '../navbar/navbar.component'; // NavBar'ı import et
import { MarketsComponent } from '../markets/markets.component'; // MarketsComponent'i import et

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavBarComponent, MarketsComponent],  // NavBar ve Markets bileşenlerini ekle
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchQuery = '';

  // NavBar'dan gelen arama terimini yakalayacak fonksiyon
  onSearch(term: string) {
    this.searchQuery = term;
  }
}
