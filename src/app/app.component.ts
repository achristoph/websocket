import { Component, OnInit } from '@angular/core';
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
  constructor() {}
  ngOnInit() {}
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
