import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFire, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';
import { Observable, Subscription } from 'rxjs/Rx';
import { AuthGuard } from '../../auth-guard';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    accountInfo;
    memberInfo: Observable<any>;
    paymentsInfo: Observable<any>;

    paymentsLoading: boolean = true;   // Flag whether or not the payments are still loading

    constructor(
        private af: AngularFire,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.data.forEach((data: { auth: any }) => {

            if (data.auth) {
                let auth = data.auth.auth;

                this.accountInfo = this.af.database.object('/users/' + auth.uid);   // Show the info from Github

                this.memberInfo = this.af.database.object('/users/' + auth.uid)     // Show the info about the Member
                    .map((_user) => {
                        _user.memberObject = this.af.database.object('/members/' + _user.member);

                        this.subscribePayments(_user.member);                       // Subscribe to the list of payments made by this member
                        return _user;
                    });

            }
        });
    }

    subscribePayments(memberKey) {
        this.paymentsLoading = false;
        if (memberKey) {                                                            // Only ask for payments if the user is a member

            this.paymentsInfo =
                this.af.database.list('/members/' + memberKey + '/payments')        // Get the list of payments
                    .map((_payments) => {

                        return _payments.map((_payment) => {

                            _payment.info = this.af.database.object('/transactions/' + _payment.$key);
                            return _payment;
                        });
                    });
        } else {
            this.paymentsLoading = false;
        }
    }

}


@Injectable()
export class UserProfileResolver implements Resolve<any> {
    constructor(
        private ag: AuthGuard,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<FirebaseAuthState | boolean> | any {
        // return the auth that is being used by AuthGuard
        // AuthGuard is already subscribed to it
        return this.ag.auth;
    }
}

