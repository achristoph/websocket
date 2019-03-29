import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebSocketService } from './websocket.service';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, DetailsComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
