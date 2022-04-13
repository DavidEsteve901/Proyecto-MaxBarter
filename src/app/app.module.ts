import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './auth/services/token-interceptor.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }