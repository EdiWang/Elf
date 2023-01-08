import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Link } from "../link.service";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from "rxjs";
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
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    tagCtrl = new FormControl();
    filteredTags: Observable<string[]>;
    editLinkForm: FormGroup;
    tags: string[] = [];
    allTags: string[] = [];
    public active = false;
    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();
    public validationErrorMessage = ValidationErrorMessage;

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

    constructor(
        public fb: FormBuilder,
        private appCache: AppCacheService) {
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
        );
    }

    @Input() public set model(data: Link) {
        this.editLinkForm?.reset(data);
        this.active = data !== undefined;

        if (data) {
            this.tags = data?.tags?.map(t => t.name);
        }
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

    // submitForm() {
    //     this.isBusy = true;

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
    //     else {
    //         this.linkService
    //             .add({
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
    // }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value && !(this.tags.includes(value))) {
            this.tags.push(value);
        }

        event.chipInput!.clear();
        this.tagCtrl.setValue(null);
    }

    remove(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        console.info(this.tags);

        if (!(this.tags.includes(event.option.viewValue))) {
            this.tags.push(event.option.viewValue);
        }

        this.tagInput.nativeElement.value = '';
        this.tagCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
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