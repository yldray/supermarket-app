import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // HttpClientModule import ediliyor
import { CommonModule } from '@angular/common'; 
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],  // HttpClientModule'ü imports dizisine ekliyoruz
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavBarComponent {
  @Output() searchTerm = new EventEmitter<string>();

  exchangeRates = { TRY: 0, EUR: 0, GBP: 0 };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    interval(30000)
      .pipe(switchMap(() => this.fetchExchangeRates()))
      .subscribe((rates) => {
        this.exchangeRates = rates;
      });

    this.fetchExchangeRates().subscribe((rates) => {
      this.exchangeRates = rates;
    });
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchTerm.emit(searchTerm);
  }

  fetchExchangeRates() {
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    return this.http.get<any>(apiUrl).pipe(
      switchMap((data) => {
        return of({
          USD: 1, // 1 USD'nin değeri kendisi olur
          TRY: data.rates.TRY, // 1 USD'nin kaç TRY olduğunu alıyoruz
          EUR: data.rates.EUR,
          GBP: data.rates.GBP
        });
      }),
     
    );
  }
}
