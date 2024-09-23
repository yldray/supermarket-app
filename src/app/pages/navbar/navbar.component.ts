import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interval, forkJoin, of } from 'rxjs';  // RxJS'den of operatörünü ekliyoruz
import { switchMap } from 'rxjs/operators';    // RxJS'den switchMap operatörünü ekliyoruz

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavBarComponent {
  @Output() searchTerm = new EventEmitter<string>();  // Emit the search term

  exchangeRates = { TRY: 0, EUR: 0, GBP: 0 };  // To store exchange rates

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Her 30 saniyede bir güncellemek için interval kullanıyoruz
    interval(30000).subscribe(() => {
      this.fetchAllExchangeRates();
    });

    // İlk başta hemen kur verilerini çekiyoruz
    this.fetchAllExchangeRates();
  }

  // Bütün kurları ayrı ayrı çekmek için forkJoin kullanıyoruz
  fetchAllExchangeRates() {
    forkJoin({
      usdToTry: this.fetchExchangeRate('USD', 'TRY'),
      eurToTry: this.fetchExchangeRate('EUR', 'TRY'),
      gbpToTry: this.fetchExchangeRate('GBP', 'TRY'),
    }).subscribe((rates) => {
      this.exchangeRates.TRY = rates.usdToTry;
      this.exchangeRates.EUR = rates.eurToTry;
      this.exchangeRates.GBP = rates.gbpToTry;
    });
  }

  // Belirli iki para birimi arasındaki kur değerini çeken fonksiyon
  fetchExchangeRate(baseCurrency: string, targetCurrency: string) {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
    return this.http.get<{ rates: { [key: string]: number } }>(apiUrl).pipe(
      switchMap((data) => of(data.rates[targetCurrency]))  // switchMap ve of doğru import edildi
    );
  }

  // onSearch function to handle the search input
  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchTerm.emit(searchTerm);  // Emit the search term to parent component or service
  }
}
