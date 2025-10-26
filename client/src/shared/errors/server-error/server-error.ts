import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../types/error';

@Component({
    selector: 'app-server-error',
    imports: [],
    templateUrl: './server-error.html',
    styleUrl: './server-error.css'
})
export class ServerError {
    protected error: ApiError;
    protected showDetails = signal(false);
    private router = inject((Router));

    constructor() {
        const navigation = this.router.getCurrentNavigation();
        this.error = navigation?.extras?.state?.['error'];
    }

    toggleDetails() {
        this.showDetails.set(!this.showDetails());
    }
}
