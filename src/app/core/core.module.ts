//this module provide HTTP client service
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//make HTTP requests to interacr with APIs
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideHttpClient()  // Provides HttpClient for dependency injection
  ]
})
export class CoreModule { }
//123