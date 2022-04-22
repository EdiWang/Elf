import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'confirmation-dialog',
    templateUrl: 'confirmation-dialog.html',
})
export class ConfirmationDialog {
    message: string = "Are you sure?"
    confirmButtonText = "Yes"
    cancelButtonText = "No"
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ConfirmationDialog>) {
        if (data) {
            this.message = data.message || this.message;
            if (data.buttonText) {
                this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
                this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
            }
        }
    }

    onConfirmClick(): void {
        this.dialogRef.close(true);
    }

}