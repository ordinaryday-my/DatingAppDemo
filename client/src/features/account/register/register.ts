import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;

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
