import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
    selector: 'app-register',
    imports: [FormsModule],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class Register {
    cancelRegister = output<boolean>();
    protected creds = {} as RegisterCreds;
    private accountService = inject(AccountService);

    register() {
        console.log("Registering user...");
        this.accountService.register(this.creds).subscribe({
            next: (res: any) => {
                console.log(res, "Complete");
                this.cancel();
            },
            error: (err: any) => {
                console.log(err, "Registration error");
                this.cancel();
            }
        });
    }

    cancel() {
        this.cancelRegister.emit(false);
    }
}
