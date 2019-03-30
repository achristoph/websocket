import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { WebSocketService } from './websocket.service';

@NgModule({
  declarations: [AppComponent, HomeComponent, DetailsComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, ReactiveFormsModule],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
