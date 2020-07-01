import { Component,Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


  

@Component({
selector:'alert-modal',
templateUrl:'alert-modal.html',
styleUrls:['alert-modal.css']    
})
export class AlertModal{

    alertMessage:string;
    title:string;
    specialMessage:string;
    
    constructor(public dialogRef: MatDialogRef<AlertModal>, @Inject(MAT_DIALOG_DATA) public data: any) {
      this.alertMessage = data.message;
      this.specialMessage = data.specialMessage;
      this.title =  data.title;
     }

  ngOnInit() {
    
  }

   closeModal() {
    this.dialogRef.close();
  }
}