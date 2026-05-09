import { __decorate } from "tslib";
import { attr, nullableNumberConverter, Observable } from '@microsoft/fast-element';
import { getInitials } from '../utils/get-initials.js';
import { BaseAvatar } from './avatar.base.js';
import { AvatarColor, AvatarNamedColor, } from './avatar.options.js';
/**
 * An Avatar Custom HTML Element.
 * Based on BaseAvatar and includes style and layout specific attributes
 *
 * @tag fluent-avatar
 *
 * @public
 */
export class Avatar extends BaseAvatar {
    /**
     * Handles changes to observable properties
     * @internal
     * @param source - the source of the change
     * @param propertyName - the property name being changed
     */
    handleChange(source, propertyName) {
        switch (propertyName) {
            case 'color':
            case 'colorId':
                this.generateColor();
                break;
            default:
                break;
        }
    }
    /**
     * Generates and sets the initials for the template
     * @internal
     */
    generateInitials() {
        if (!this.name && !this.initials) {
            return;
        }
        // size can be undefined since we default it in CSS only
        const size = this.size ?? 32;
        return (this.initials ||
            getInitials(this.name, window.getComputedStyle(this).direction === 'rtl', {
                firstInitialOnly: size <= 16,
            }));
    }
    /**
     * Sets the data-color attribute used for the visual presentation
     * @internal
     */
    generateColor() {
        const colorful = this.color === AvatarColor.colorful;
        const prev = this.currentColor;
        this.currentColor =
            colorful && this.colorId
                ? this.colorId
                : colorful
                    ? Avatar.colors[getHashCode(this.name ?? '') % Avatar.colors.length]
                    : this.color ?? AvatarColor.neutral;
        this.setAttribute('data-color', this.currentColor);
    }
    /**
     * An array of the available Avatar named colors
     */
    static { this.colors = Object.values(AvatarNamedColor); }
    connectedCallback() {
        super.connectedCallback();
        Observable.getNotifier(this).subscribe(this);
        this.generateColor();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        Observable.getNotifier(this).unsubscribe(this);
    }
}
__decorate([
    attr
], Avatar.prototype, "active", void 0);
__decorate([
    attr
], Avatar.prototype, "shape", void 0);
__decorate([
    attr
], Avatar.prototype, "appearance", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], Avatar.prototype, "size", void 0);
__decorate([
    attr
], Avatar.prototype, "color", void 0);
__decorate([
    attr({ attribute: 'color-id' })
], Avatar.prototype, "colorId", void 0);
// copied from React avatar
const getHashCode = (str) => {
    let hashCode = 0;
    for (let len = str.length - 1; len >= 0; len--) {
        const ch = str.charCodeAt(len);
        const shift = len % 8;
        hashCode ^= (ch << shift) + (ch >> (8 - shift)); // eslint-disable-line no-bitwise
    }
    return hashCode;
};
//# sourceMappingURL=avatar.js.map