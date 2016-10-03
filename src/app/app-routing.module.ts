import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MembersComponent } from './members/members.component';
import { PaymentsComponent } from './payments/payments.component';
import { ExecutivesComponent } from './executives/executives.component';
import { UsersComponent } from './users/users.component';
import { UserProfileComponent, UserProfileResolver } from './users/user-profile/user-profile.component';
import { JoinComponent } from './users/join/join.component';

import { AuthGuard } from './auth-guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/members',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'members',
        component: MembersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'payments',
        component: PaymentsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'payments/:id',
        component: PaymentsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'executives',
        component: ExecutivesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'profile',            // User can see the member details we have about them
        component: UserProfileComponent,
        canActivate: [AuthGuard],
        resolve: {
            auth: UserProfileResolver
        }
    },
    {
        path: 'join/:token',        // For associating with an member record
        component: JoinComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class SudoMembershipsRoutingModule { }
