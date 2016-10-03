import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule, AngularFire } from 'angularfire2';
import { FirebaseModule } from '../firebase'; // The firebase configuration

// Observable.map support
import 'rxjs/add/operator/map';

// Angular2 Materialize support
import 'angular2-materialize';
import { MaterializeModule } from 'angular2-materialize';

import { SudoMembershipsRoutingModule }  from './app-routing.module';

import { AuthGuard } from './auth-guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MembersComponent } from './members/members.component';
import { EditMemberComponent } from './members/edit-member/edit-member.component';
import { PaymentsComponent } from './payments/payments.component';
import { ExecutivesComponent } from './executives/executives.component';
import { EditPaymentComponent } from './payments/edit-payment/edit-payment.component';
import { UsersComponent } from './users/users.component';
import { UserProfileComponent, UserProfileResolver } from './users/user-profile/user-profile.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MembersComponent,
        EditMemberComponent,
        PaymentsComponent,
        ExecutivesComponent,
        EditPaymentComponent,
        UsersComponent,
        UserProfileComponent,
    ],
    imports: [
        MaterializeModule,
        FirebaseModule,
        SudoMembershipsRoutingModule,
        BrowserModule,
        FormsModule,
        HttpModule,
    ],
    providers: [
        AuthGuard,
        UserProfileResolver
        ],
    bootstrap: [AppComponent]
})
export class AppModule { }
