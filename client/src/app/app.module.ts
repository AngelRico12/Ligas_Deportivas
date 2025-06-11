import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPayPalModule } from 'ngx-paypal';
import { ReactiveFormsModule } from '@angular/forms';

import { ZXingScannerModule } from '@zxing/ngx-scanner';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/Login/login/login.component';
import { AdministrarComponent } from './Components/Administrar/administrar/administrar.component';
import { EquipoComponent } from './Components/Equipo/equipo/equipo.component';
import { DuenoComponent } from './Components/Dueño/dueno/dueno.component';
import { RegistrarClubComponent } from './Components/registrar-club/registrar-club/registrar-club.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
     AdministrarComponent,
     EquipoComponent,
     DuenoComponent,
     RegistrarClubComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPayPalModule,
    ZXingScannerModule,
    ReactiveFormsModule, 
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
