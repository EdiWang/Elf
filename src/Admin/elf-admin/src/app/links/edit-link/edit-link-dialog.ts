import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Link } from "../link.service";
import { AppCacheService } from "../../shared/appcache.service";
import { ValidationErrorMessage } from "src/app/shared/global";
import { Tag } from "src/app/tag/tag.service";
@Component({
    selector: 'edit-link-dialog',
    templateUrl: 'edit-link-dialog.html',
    styleUrls: ['./edit-link-dialog.css']
})
export class EditLinkDialog {
    editLinkForm: FormGroup;
    allTags: Tag[] = [];
    public active = false;
    public validationErrorMessage = ValidationErrorMessage;

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();

    constructor(
        public fb: FormBuilder,
        private appCache: AppCacheService) {
    }

    @Input() public set model(data: Link) {
        this.editLinkForm?.reset(data);
        this.active = data !== undefined;
        this.allTags = this.appCache.tags;
    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm() {
        this.editLinkForm = this.fb.group({
            id: new FormControl(''),
            originUrl: new FormControl('', [Validators.required]),
            note: new FormControl(''),
            akaName: new FormControl(''),
            isEnabled: new FormControl(true),
            ttl: new FormControl(3600),
            tags: ['']
        })
    }

    public onSave(e) {
        e.preventDefault();
        this.save.emit(this.editLinkForm.value);
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