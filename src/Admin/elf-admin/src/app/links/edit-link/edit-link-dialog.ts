import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Link } from "../link.service";
import { AppCacheService } from "../../shared/appcache.service";
import { ValidationErrorMessage } from "src/app/shared/global";
@Component({
    selector: 'edit-link-dialog',
    templateUrl: 'edit-link-dialog.html',
    styleUrls: ['./edit-link-dialog.css']
})
export class EditLinkDialog {
    isBusy = false;
    addOnBlur = true;
    editLinkForm: FormGroup;
    allTags: string[] = [];
    public active = false;
    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();
    public validationErrorMessage = ValidationErrorMessage;

    constructor(
        public fb: FormBuilder,
        private appCache: AppCacheService) {
    }

    @Input() public set model(data: Link) {
        this.editLinkForm?.reset(data);
        this.active = data !== undefined;
    }

    ngOnInit(): void {
        this.buildForm();
        this.getAllTagNames();
    }

    buildForm() {
        this.editLinkForm = this.fb.group({
            originUrl: new FormControl('', [Validators.required]),
            note: new FormControl(''),
            akaName: new FormControl(''),
            isEnabled: new FormControl(true),
            ttl: new FormControl(3600)
        })
    }

    getAllTagNames() {
        this.allTags = this.appCache.tags.map(t => t.name)
    }

    //     if (this.data) {
    //         this.linkService
    //             .update(this.data.id, {
    //                 originUrl: this.editLinkForm.value.originUrl.trim(),
    //                 note: this.editLinkForm.value.note,
    //                 akaName: this.editLinkForm.value.akaName,
    //                 isEnabled: this.editLinkForm.value.isEnabled,
    //                 ttl: this.editLinkForm.value.ttl,
    //                 tags: this.tags
    //             })
    //             .subscribe(() => {
    //                 this.isBusy = false;
    //             });
    //     }

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