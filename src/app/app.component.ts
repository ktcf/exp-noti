import { Component, OnInit } from '@angular/core';
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'exp-noti';
  message:any = null;
  token: string = "";
  constructor() {}
  ngOnInit(): void {
    this.requestPermission();
    this.listen();
  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey}).then(
      (currentToken) => {
        if (currentToken) {
          console.log("we got the token.....");
          console.log(currentToken);
          this.token = currentToken;
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }     }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      let title = payload.notification?.title;
      let body = payload.notification?.body;

      if (!title || !body) {
        title = "No notification title";
        body = "No notification body";
      }

      console.log('Message received. ', payload);
      this.message=payload;

      new Notification(title, {body});
    });
  }
}


