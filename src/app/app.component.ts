import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title: string = 'SUDO Memberships';             // Title of the app
    authState;                                      // App auth state
    memberInfo;                                     // Info about the member associated with this user

    constructor(private af: AngularFire, private router: Router) { }

    ngOnInit() {
        this.af.auth.subscribe(                      // Subscribe to auth state changes
            auth => {
                this.authChange(auth);
                this.subscribeMember(auth);
            }
        );
    }

    subscribeMember(data) {
        if (data && data.auth) {
            let auth = data.auth;
            this.memberInfo = this.af.database.object('/users/' + auth.uid)     // Get the info about the Member
                .map((_user) => {
                    if (_user.member) {
                        _user.memberObject = this.af.database.object('/members/' + _user.member);
                    }
                    return _user;
                });
        }
    }

    authChange(auth) {
        this.authState = auth;
        if (!auth) {
            // if this was a logout auth change, redirect to the login screen
            console.log('[AppComponent] User became unauthenticated');
            this.router.navigate(['/login']);
        }
    }

    logout() {
        this.af.auth.logout(); // Firebase logout
    }
}
