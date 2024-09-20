import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/pages/home/home.component';
import { MarketsComponent } from './app/pages/markets/markets.component';
import { ProductsComponent } from './app/pages/products/products.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'markets', component: MarketsComponent },
      { path: 'products', component: ProductsComponent },
      { path: '**', redirectTo: '' }
    ], withComponentInputBinding())
  ]
}).catch(err => console.error(err));
