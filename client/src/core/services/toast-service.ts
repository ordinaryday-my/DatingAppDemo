import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor() {
        this.createToastContainer();
    }

    success(message: string, durationMs?: number) {
        this.createToastMessage(message, 'alert-success', durationMs);
    }

    error(message: string, durationMs?: number) {
        this.createToastMessage(message, 'alert-error', durationMs);
    }

    warning(message: string, durationMs?: number) {
        this.createToastMessage(message, 'alert-warning', durationMs);
    }

    info(message: string, durationMs?: number) {
        this.createToastMessage(message, 'alert-info', durationMs);
    }

    private createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast toast-bottom toast-end';
            document.body.appendChild(container);
        }
    }

    private createToastMessage(message: string, alertClass: string, durationMs = 5000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.classList.add("alert", alertClass, 'shadow-lg');
        toast.innerHTML = `
      <span>${message}</span>
      <button class="ml-4 btn btn-sm btn-ghost">x</button>
    `;

        toast.querySelector('button')?.addEventListener('click', () => {
            container.removeChild(toast);
        });

        container.appendChild(toast);

        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, durationMs);
    }
}
