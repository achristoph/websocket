import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  messages = [];
  clientSocket: Subject<any>;
  subscription: Subscription;
  MAX_MESSAGE = 10;
  constructor(private ws: WebSocketService) {}
  ngOnInit() {
    const url = 'ws://localhost:8181/';
    this.clientSocket = this.ws.connect(url);
    this.subscription = this.clientSocket.subscribe(m => {
      console.log(m);
      this.messages = [...this.messages, m.data];
    });
  }
  sendMessage(m) {
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
