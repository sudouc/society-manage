import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    private subscription;                       // Subscription to the user Auth State
    title: string = 'SUDO Memberships';         // Title of the app
    authState;                                       // App auth state

    constructor(private af: AngularFire, private router: Router) { }

    ngOnInit() {
        this.subscription = this.af.auth.subscribe( // Subscribe to auth state changes
            auth => this.authChange(auth)
        );
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

    ngOnDestroy() {
        this.subscription.unsubscribe();        // Unsubscribe from auth state
    }
}
