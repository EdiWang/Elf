import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Link, LinkService } from "../link.service";
import { ToastrService } from 'ngx-toastr';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from "rxjs";
import { AppCacheService } from "../../shared/appcache.service";
@Component({
    selector: 'edit-link-dialog',
    templateUrl: 'edit-link-dialog.html',
    styleUrls: ['./edit-link-dialog.css']
})
export class EditLinkDialog {
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    tagCtrl = new FormControl();
    filteredTags: Observable<string[]>;
    editLinkForm: FormGroup;
    tags: string[] = [];
    allTags: string[] = [];

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

    constructor(
        private toastr: ToastrService,
        public fb: FormBuilder,
        private appCache: AppCacheService,
        private linkService: LinkService,
        public dialogRef: MatDialogRef<EditLinkDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Link) {
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allTags.slice())),
        );
    }

    ngOnInit(): void {
        this.buildForm();
        this.tags = this.data?.tags.map(t => t.name);
        this.getAllTagNames();
    }

    buildForm() {
        this.editLinkForm = this.fb.group({
            originUrl: new FormControl(this.data?.originUrl ?? '', [Validators.required]),
            note: new FormControl(this.data?.note ?? ''),
            akaName: new FormControl(this.data?.akaName ?? ''),
            isEnabled: new FormControl(this.data?.isEnabled ?? true),
            ttl: new FormControl(this.data?.ttl ?? 3600)
        })
    }

    getAllTagNames() {
        this.allTags = this.appCache.tags.map(t => t.name)
    }

    submitForm() {
        if (this.data) {
            this.linkService
                .update(this.data.id, {
                    originUrl: this.editLinkForm.value.originUrl.trim(),
                    note: this.editLinkForm.value.note,
                    akaName: this.editLinkForm.value.akaName,
                    isEnabled: this.editLinkForm.value.isEnabled,
                    ttl: this.editLinkForm.value.ttl,
                    tags: this.tags
                })
                .subscribe(() => {
                    this.toastr.success('Updated');
                });
        }
        else {
            this.linkService
                .add({
                    originUrl: this.editLinkForm.value.originUrl.trim(),
                    note: this.editLinkForm.value.note,
                    akaName: this.editLinkForm.value.akaName,
                    isEnabled: this.editLinkForm.value.isEnabled,
                    ttl: this.editLinkForm.value.ttl,
                    tags: this.tags
                })
                .subscribe(() => {
                    this.toastr.success('Added');
                });
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
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
        this.tags.push(event.option.viewValue);
        this.tagInput.nativeElement.value = '';
        this.tagCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
    }
}