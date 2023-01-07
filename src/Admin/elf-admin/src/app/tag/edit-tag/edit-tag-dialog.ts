import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ValidationErrorMessage } from "src/app/shared/global";
import { Tag, TagService } from "./../tag.service";

@Component({
    selector: 'edit-tag-dialog',
    templateUrl: 'edit-tag-dialog.html',
    styleUrls: ['./edit-tag-dialog.css']
})
export class EditTagDialog {
    public active = false;
    editTagForm: FormGroup;

    @Input() public set model(data: Tag) {
        this.editTagForm?.reset(data);
        this.active = data !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();
    public validationErrorMessage = ValidationErrorMessage;

    constructor(
        public fb: FormBuilder,
        private service: TagService) { }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm() {
        this.editTagForm = this.fb.group({
            id: [''],
            name: new FormControl('', [Validators.required])
        })
    }

    public onSave(e) {
        e.preventDefault();
        this.save.emit(this.editTagForm.value);
        this.active = false;
    }

    public onCancel(e) {
        e.preventDefault();
        this.closeForm();
    }

    private closeForm() {
        this.active = false;
        this.cancel.emit();
    }
}