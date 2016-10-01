import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MembersComponent } from './members/members.component';
import { PaymentsComponent } from './payments/payments.component';
import { ExecutiveComponent } from './executive/executive.component';

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
        path: 'executive',
        component: ExecutiveComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'executive/:id', // THis will be a trigger to add a user to the executive
        component: ExecutiveComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class SudoMembershipsRoutingModule { }
