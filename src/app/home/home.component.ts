import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { WebSocketService } from '../websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  messages = [];
  clientSocket: Subject<any>;
  subscription: Subscription;
  MAX_MESSAGE = 10;
  constructor(private ws: WebSocketService) {}

  ngOnInit() {
    const url = 'ws://localhost:8181/';
    if (!this.ws.ws) {
      console.log('Client connecting to Websocket server on port 8181');
      this.clientSocket = this.ws.connect(url);
      this.subscription = this.clientSocket.subscribe(m => {
        console.log(m);
        this.messages = [...this.messages, m.data];
      });
    }
  }
  sendMessage(m) {
    console.log(`Client sending message: ${m}`);
    this.clientSocket.next(m);
    if (this.messages.length === this.MAX_MESSAGE) {
      this.messages.shift();
    }
    // this.messages = [...this.messages, m];
  }

  closeConnection() {
    this.subscription.unsubscribe();
  }
}
