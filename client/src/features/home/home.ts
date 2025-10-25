import { Component, signal } from '@angular/core';
import { Register } from "../account/register/register";

@Component({
    selector: 'app-home',
    imports: [Register],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class Home {
    protected registerMode = signal(false);

    showRegister(value: boolean) {
        console.log("Showing register:", value);
        this.registerMode.set(value);
    }
}
