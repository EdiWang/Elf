import { ErrorHandler } from '@angular/core';

export interface IElfErrorService extends ErrorHandler {
    handleError(error: any): void;
}