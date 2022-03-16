import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { environment } from "src/environments/environment";
import { Link } from "./link.service";

@Component({
    selector: 'share-dialog',
    templateUrl: 'share-dialog.html',
})
export class ShareDialog {
    ENV = environment;
    qrUrl = environment.elfApiBaseUrl + '/fw/' + this.data.fwToken;

    constructor(@Inject(MAT_DIALOG_DATA) public data: Link) { }
}