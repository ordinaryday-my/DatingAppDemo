import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme' ;
import { BusyService } from '../../core/services/busy-service'

@Component({
    selector: 'app-nav',
    imports: [FormsModule, RouterLink, RouterLinkActive],
    templateUrl: './nav.html',
    styleUrl: './nav.css',
})
export class Nav implements OnInit {
    protected accountService = inject(AccountService);
    protected creds: Cred = {
        password: "",
        email: "",
    };
    protected busyService = inject(BusyService);
    protected selectedTheme = signal<string>(localStorage.getItem('theme') || "light");
    protected themes = themes;
    private router = inject(Router);
    private toastService = inject(ToastService);
    
    handleSelectedTheme(theme: string) {
        this.selectedTheme.set(theme);
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute("data-theme", theme);
        const elem = document.activeElement as HTMLDivElement;
        if(elem) elem.blur();
    }
    
    login() {
        this.accountService.login(this?.creds).subscribe({
            next: () => {
                this.router.navigateByUrl('/members');
                this.toastService.success('Login successful');
                this.creds = {
                    email: "",
                    password: "",
                };
            },
            error: (err) => {
                this.toastService.error(err.error);
            },
        });
    }

    logout() {
        this.router.navigateByUrl('/');
        this.accountService.logout();
    }
    
    ngOnInit() {
        document.documentElement.setAttribute("data-theme", this.selectedTheme());
    }
}
