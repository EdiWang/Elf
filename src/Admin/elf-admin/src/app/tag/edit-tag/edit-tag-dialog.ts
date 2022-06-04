import { Component, Inject } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from 'ngx-toastr';
import { Tag, TagService } from "./../tag.service";

@Component({
    selector: 'edit-tag-dialog',
    templateUrl: 'edit-tag-dialog.html',
    styleUrls: ['./edit-tag-dialog.css']
})
export class EditTagDialog {
    editTagForm: UntypedFormGroup;

    constructor(
        private toastr: ToastrService,
        public fb: UntypedFormBuilder,
        private service: TagService,
        public dialogRef: MatDialogRef<EditTagDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Tag) { }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm() {
        this.editTagForm = this.fb.group({
            name: new UntypedFormControl(this.data?.name ?? '', [Validators.required]),
        })
    }

    submitForm() {

        if (this.data) {
            this.service.update(this.data.id, this.editTagForm.value).subscribe(() => {
                this.toastr.success('Updated');
            });
        }
        else {
            this.service.add(this.editTagForm.value).subscribe(() => {
                this.toastr.success('Added');
            });
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }
}