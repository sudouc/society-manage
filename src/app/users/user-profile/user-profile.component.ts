import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFire, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    accountInfo;
    memberInfo: Observable<any>;
    paymentsInfo: Observable<any>;

    constructor(
        private af: AngularFire,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.data.forEach((data: { auth: any }) => {

            if (data.auth) {

                let auth = data.auth.auth;
                this.accountInfo = {
                    displayName: auth.displayName,
                    email: auth.email,
                    emailVerified: auth.emailVerified,
                    photoUrl: auth.photoURL
                }; // info to display the info from provider

                // Subscribe to info about the member
                this.memberInfo = this.af.database.object('/users/' + auth.uid)
                    .map((_user) => {
                        _user.memberObject = this.af.database.object('/members/' + _user.member);
                        // Call to subscribe to info about the member's payments
                        this.subscribePayments(_user.member);
                        return _user;
                    });

            }
        });
    }

    subscribePayments(memberKey) {
        // Subscribe to info about the members payments
        this.paymentsInfo = this.af.database.list('/members/' + memberKey + '/payments')
            .map((_payments) => {

                return _payments.map((_payment) => {

                    _payment.info = this.af.database.object('/transactions/' + _payment.$key);
                    return _payment;
                });
            });
    }

}


@Injectable()
export class UserProfileResolver implements Resolve<any> {
    constructor(
        private af: AngularFire
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<FirebaseAuthState | boolean> {
        let sub = this.af.auth.map(
            data => {
                if (data) {
                    return data;
                }
                return false;
            }
        );
        return sub.first();
    }
}

