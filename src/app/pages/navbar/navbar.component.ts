import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interval, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],  // HttpClientModule'ü imports dizisine ekliyoruz
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavBarComponent {
  @Output() searchTerm = new EventEmitter<string>();  // Emit the search term

  exchangeRates = { TRY: 0, EUR: 0, GBP: 0 };  // To store exchange rates

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch exchange rates every 30 seconds
    interval(30000)
      .pipe(switchMap(() => this.fetchExchangeRates()))
      .subscribe((rates) => {
        this.exchangeRates = rates;
      });

    // Fetch initial exchange rates
    this.fetchExchangeRates().subscribe((rates) => {
      this.exchangeRates = rates;
    });
  }

  // Emit search term when input changes
  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchTerm.emit(searchTerm);  // Emit the search term to parent
  }

  // Fetch exchange rates from an external API
  fetchExchangeRates() {
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';  // Use any exchange rate API
    return this.http.get<any>(apiUrl).pipe(
      switchMap((data) => {
        return of({
          USD: 1,  // 1 USD's value itself
          TRY: data.rates.TRY,  // Conversion rate for TRY
          EUR: data.rates.EUR,  // Conversion rate for EUR
          GBP: data.rates.GBP   // Conversion rate for GBP
        });
      })
    );
  }
}
