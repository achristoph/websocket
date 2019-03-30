import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  MAX_MESSAGE = 5;
  messageForm;
  constructor(private fb: FormBuilder, private ws: WebSocketService) {}

  ngOnInit() {
    this.messageForm = this.fb.group({
      name: ['']
    });

    const url = 'ws://localhost:8181/';
    if (!this.ws.ws) {
      console.log('Client connecting to Websocket server on port 8181');
      this.clientSocket = this.ws.connect(url);
      console.log(this.clientSocket);
      this.subscription = this.clientSocket.subscribe(m => {
        if (this.messages.length === this.MAX_MESSAGE) {
          this.messages.shift();
        }
        this.messages = [...this.messages, m.data];
      });
    }
  }
  sendMessage(m) {
    console.log(this.messageForm.value);
    console.log(`Client sending message: ${m}`);
    const payload = { message: m, ...this.messageForm.value };
    this.clientSocket.next(payload);
  }

  closeConnection() {
    this.subscription.unsubscribe();
  }
}
