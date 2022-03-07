import { Component, Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private readonly snackBar: MatSnackBar) {}

  /**
   * Presents a toast displaying the message with a green background
   * @param message Message to display
   * @example
   * this.notificationService.success("confirm oked");
   */
  success(message: string) {
    this.openSnackBar(message, '', 'success-snackbar');
  }

  /**
   * Presents a toast displaying the message with a red background
   * @param message Message to display
   * @example
   * this.notificationService.error("confirm canceled");
   */
  error(message: string) {
    this.openSnackBar(message, '', 'error-snackbar');
  }

  /**
   * Shows a confirmation modal, presenting the user with
   * an OK and Cancel button. 
   * @param message Body of the modal
   * @param okCallback Optional function to call when the user clicks Ok
   * @param title Optional modal title
   * @param cancelCallback Option function to call when the user clicks Cancel
   * @example
   * //displays a success or error message depending on what button is clicked.
   * this.notificationService.confirmation(
   * 'it will be gone forever', //message body
   * () => { //okCallback
      this.notificationService.success("confirm oked");
    },
    'Are you sure?', //title
     () => { //cancelCallback
      this.notificationService.error("confirm canceled");
    });
   */

  /**
  * Shows a modal, presenting the user with an OK button.
  * @param message Body of the modal
  * @param okCallback Optional function to call when the user clicks Ok
  * @param title Optional modal title
  * @example
  * //displays a success when the Ok button is clicked.
  *  this.notificationService.alert("an alert", "notice", () => {
      this.notificationService.success("alert oked");
    });
  */

  /**
   * Displays a toast with provided message
   * @param message Message to display
   * @param action Action text, e.g. Close, Done, etc
   * @param className Optional extra css class to apply
   * @param duration Optional number of SECONDS to display the notification for
   */
  openSnackBar(
    message: string,
    action: string,
    className = '',
    duration = 3000
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [className],
    });
  }
}

export interface DialogData {
  message: string;
  title: string;
}
