import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common'
import { MemberService } from '../../../core/services/member-service'
import { FormsModule, NgForm } from '@angular/forms'
import { ToastService } from '../../../core/services/toast-service'
import { AccountService } from '../../../core/services/account-service'

@Component({
    selector: 'app-member-profile',
    imports: [
        DatePipe,
        FormsModule
    ],
    templateUrl: './member-profile.html',
    styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {
    @ViewChild("editForm") editForm?: NgForm;

    @HostListener("window:beforeunload", ['$event']) notify($event: BeforeUnloadEvent) {
        if (this.editForm?.dirty) {
            $event.preventDefault();
        }
    }
    
    protected memberService = inject(MemberService);
    protected editableMember: EditableMember = {
        displayName: "",
        description: "",
        country: "",
        city: "",
    };
    private toast = inject(ToastService);
    private accountService = inject(AccountService);

    ngOnInit(): void {
        this.editableMember = {
            displayName: this.memberService.member()?.displayName || '',
            country: this.memberService.member()?.country || '',
            city: this.memberService.member()?.city || '',
            description: this.memberService.member()?.description || '',
        };
    }

    ngOnDestroy(): void {
        this.memberService.editMode.set(false);
    }

    updateProfile() {
        if (!this.memberService.member()) {
            return;
        }
        const updatedMember = { ...this.memberService.member(), ...this.editableMember };
        updatedMember.displayName = updatedMember.displayName.trim();
        this.memberService.updateMember(this.editableMember).subscribe({
            next: () => {
                const currentUser = this.accountService.currentUser();
                if(currentUser && updatedMember.displayName !== currentUser?.displayName) {
                    currentUser.displayName = updatedMember.displayName;
                    this.accountService.setCurrentUser(currentUser);
                }
                this.toast.success('Updated member profile');
                this.memberService.editMode.set(false);
                this.memberService.member.set(updatedMember as Member);
                this.editForm?.reset(updatedMember);
            }
        });
    }
}
