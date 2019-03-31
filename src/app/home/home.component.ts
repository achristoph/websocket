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
      user: [''],
      message: ['']
    });

    const url = 'ws://localhost:8181/';
    console.log('Client connecting to Websocket server on port 8181');
    this.clientSocket = this.ws.connect(url);
    this.subscription = this.clientSocket.subscribe(m => {
      if (this.messages.length === this.MAX_MESSAGE) {
        this.messages.shift();
      }
      this.messages = [...this.messages, m.data];
    });
  }
  sendMessage(m) {
    const payload = { message: m, ...this.messageForm.value };
    console.log(payload);
    this.clientSocket.next(payload);
  }

  closeConnection() {
    this.subscription.unsubscribe();
  }
}
