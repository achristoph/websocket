import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';

/**
 * WebSocket Service
 */
@Injectable()
export class WebSocketService {
  private subject: Subject<any>;
  ws;
  /**
   * Create a new Subject if it does not exist, reuse otherwise
   * @param url - WebSocket URL to connect
   */
  public connect(url: string): Subject<any> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    return this.subject;
  }

  /**
   * Bind a Subject to the websocket as the data source
   * @param url - WebSocket URL to connect
   */
  private create(url: string): Subject<any> {
    this.ws = new WebSocket(url);

    const observable = Observable.create((obs: Observer<any>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);

      return this.ws.close.bind(this.ws);
    });

    const observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }
}
