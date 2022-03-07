import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectionServiceModule } from 'ng-connection-service';
//import { PriceListComponent } from './price-list/price-list.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { NgxPrintModule } from 'ngx-print';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [AppComponent, GlobalSearchComponent],
  imports: [
    // BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ConnectionServiceModule,
    AutocompleteLibModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatInputModule,
    NgxPrintModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
