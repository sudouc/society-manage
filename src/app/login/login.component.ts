import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    title: string = 'Login';                // Page Title
    model = { email: '', password: '' };    // Username/Password Model
    submitted: boolean = false;             // Flag if the 
    submissionError: string = undefined;    // Used to show the user any errors with login

    constructor(private af: AngularFire, private router: Router) { }

    ngOnInit() {
        this.af.auth.subscribe(
            auth => this.authSuccess(auth)
        );
    }

    githubLogin() {                                 // Login with Github
        this.af.auth.login({
            provider: AuthProviders.Github,
            method: AuthMethods.Popup,
        })
            .then((data) => {                       // Update user/{uid}/info in firebase
                this.af.auth.subscribe(_auth => {
                    console.log(_auth.auth);
                    this.af.database.object('users/' + data.uid + '/info').set({
                        displayName: _auth.auth.displayName,
                        email: _auth.auth.email,
                        emailVerified: _auth.auth.emailVerified,
                        photoUrl: _auth.auth.photoURL
                    });
                });
            }).catch(err => {                       // Catch login errors from Github Login
                // nom
                console.error(err);
            });
    }

    passwordLogin() {
        this.submitted = true;
        this.submissionError = undefined;

        this.af.auth.login(
            this.model,
            {
                provider: AuthProviders.Password,
                method: AuthMethods.Password,
            })
            .then((data) => {                       // Update user/{uid}/info in firebase
                this.af.auth.subscribe(_auth => {
                    console.log(_auth.auth);
                    this.af.database.object('users/' + data.uid + '/info').set({
                        displayName: _auth.auth.displayName,
                        email: _auth.auth.email,
                        emailVerified: _auth.auth.emailVerified,
                        photoUrl: _auth.auth.photoURL
                    });
                });
            })
            .then(auth =>                           // On success call the success method
                this.authSuccess(auth)
            )
            .catch(err =>                           // On fail call the error method
                this.authFail(err)
            );
    }

    authSuccess(auth) {                         // Password login success
        if (auth) {
            let redirectURL = localStorage.getItem('redirectUrl');
            if (redirectURL) {
                this.router.navigate([redirectURL]);
            } else {
                this.router.navigate(['/profile']);
            }
            localStorage.removeItem('redirectUrl');
        }
    }

    authFail(err) {                             // Password Login Failure
        console.error(err);
        this.submitted = false;
        this.submissionError = err;
    }

}
