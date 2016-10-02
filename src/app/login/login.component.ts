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
            auth => this.onSuccess(auth),
            err => this.onFail(err),
        );

    }

    githubLogin() {
        this.af.auth.login({
            provider: AuthProviders.Github,
            method: AuthMethods.Popup,
        })
            .then((data) => {
                // Enter the user's info in the users table
                this.af.auth.subscribe(_auth => {
                    console.log(_auth.auth);
                    this.af.database.object('users/' + data.uid + '/info').set({
                        displayName: _auth.auth.displayName,
                        email: _auth.auth.email,
                        emailVerified: _auth.auth.emailVerified,
                        photoUrl: _auth.auth.photoURL
                    });
                });
                // TODO adding of member id to account if they clicked a member ID link
            });
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
    onSuccess(auth) {
        if (auth) {
            let redirectURL = localStorage.getItem('redirectUrl');
            if (redirectURL) {
                this.router.navigate([redirectURL]);
            } else {
                this.router.navigate(['/members']);
            }
            localStorage.removeItem('redirectUrl');
        }
    }

    // Notify the user of failure and get them to try again
    onFail(err) {
        // TODO Check if the failure type is a timeout and if so show that to the user instead
        console.error('[LoginComponent] Auth request Failed: ' + JSON.stringify(err));
        this.submitted = false;
        this.submissionError = err;
    }

}
