import { Component, OnInit } from '@angular/core';
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'exp-noti';
  message:any = null;
  token: string = "";
  messaging: any = null;

  constructor(private _snackBar: MatSnackBar) {}
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
    this.messaging = getMessaging();
    onMessage(this.messaging, (payload) => {
      let title = payload.notification?.title;
      let body = payload.notification?.body;

      if (!title || !body) {
        title = "No notification title";
        body = "No notification body";
      }

      console.log('Message received. ', payload);
      this.message=payload;

      this._snackBar.open(body, title);
      const notification = new Notification("Hi there!");
    });
  }

  public reqPerm() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification("Hi there!");
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("Hi there!");
          // …
        }
      });
    }
    this.requestPermission();
  }
}


