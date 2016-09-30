import { Component, OnInit, OnDestroy } from '@angular/core';

import { AngularFire } from 'angularfire2';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy  {

    private subscription;
    title: string = 'SUDO Memberships';         // Title of the app
    auth;            // boolean representation of the auth status of the app

    constructor(private af: AngularFire){}

    ngOnInit() {
        // Subscribe to auth state changes
        this.subscription = this.af.auth.subscribe(
            auth => this.authChange(auth)
        );
    }

    authChange(auth) {
        this.auth = auth;
    }

    logout() {
        // tell AuthService to logout
        console.log('LOGOUT');
        this.af.auth.logout();
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed, just in case
        this.subscription.unsubscribe()
    }
 }