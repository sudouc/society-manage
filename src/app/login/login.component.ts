import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    title: string = 'Login';
    model = { email: '', password: '' };
    submitted: boolean = false;
    submissionError: string = undefined; // Used to show the user any errors with login

    constructor(private af: AngularFire, private router: Router) { }

    ngOnInit() {
        this.af.auth.subscribe(
            data => this.onSuccess(data),
            err => this.onFail(err),
        );

    }

    // On form submission, submit the user details to service for authentication
    onSubmit() {
        this.submitted = true;
        this.submissionError = undefined;

        // On authentication success we will be redirected by the AppComponent
        // All we need to do here is catch and show any errors
        this.af.auth.login(
            this.model,
            {
                provider: AuthProviders.Password,
                method: AuthMethods.Password,
            });
    }

    // Login success, moving on
    onSuccess(data) {
        let redirectURL = localStorage.getItem('redirectUrl')
        if (redirectURL === undefined) {
            this.router.navigate([redirectURL]);
        } else {
            this.router.navigate(['/members']);
        }
        localStorage.setItem('redirectUrl', undefined);
    }

    // Notify the user of failure and get them to try again
    onFail(err) {
        // TODO Check if the failure type is a timeout and if so show that to the user instead
        console.error('[LoginComponent] Auth request Failed: ' + JSON.stringify(err));
        this.submitted = false;
        this.submissionError = err;
    }

}
