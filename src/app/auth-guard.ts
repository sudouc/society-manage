import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import { AngularFire } from 'angularfire2';

@Injectable()
export class AuthGuard implements CanActivate {

    private subscription = undefined;
    private auth;            // app auth state

    constructor(private af: AngularFire, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (!this.subscription) {
            console.log('subscribing to auth state!');
            // Subscribe to auth state if we're not already
            this.subscription = this.af.auth.subscribe(
                auth => this.auth = auth
            );
        }

        let anon_routes: string[] = ['/login', '/register'];

        // If we are authenticated but trying to access /login or /register, don't allow
        if (this.auth) {

            if (anon_routes.indexOf(state.url) > -1) {
                console.log('AuthGuard#canActivate DISALLOW: ' + state.url + ' because already authenticated');
                // Nav to member management
                this.router.navigate(['/members']);
                return false;
            }
            console.log('AuthGuard#canActivate ALLOW: ' + state.url + ' because already authenticated');
            // Otherwise, allow
            return true;

        } else if (anon_routes.indexOf(state.url) > -1) {

            // If we are AREN'T authenticated but trying to access /login or /register, allow
            console.log('AuthGuard#canActivate ALLOW: ' + state.url + ' because not authenticated');
            return true;

        } else {

            // Finally, if we aren't authenticated but we're trying to access a protected 
            // Route, save our route and go to login 
            // Store the attempted URL for redirecting
            localStorage.setItem('redirectUrl', state.url);
            console.log('AuthGuard#canActivate DISALLOW: ' +
                state.url + ' because already not authenticated, BUT saved it for redirect after login');
            // Navigate to the login page
            this.router.navigate(['/login']);
            return false;

        }
    }
}
