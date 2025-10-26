import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { Member } from '../../types/member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {
    const memberService = inject(MemberService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    if (!id) {
        router.navigate(['/not-found']).then();
        return EMPTY;
    }

    return memberService.getMember(id);
};
