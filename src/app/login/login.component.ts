import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    title: string = 'Login';
    model = { email: '', password: '' };
    submitted: boolean = false;
    submissionError: string = undefined; // Used to show the user any errors with login

    constructor(private af: AngularFire, private router: Router) { }

    // On form submission, submit the user details to service for authentication
    onSubmit() {
        this.submitted = true;
        this.submissionError = undefined;

        // On authentication success we will be redirected by the AppComponent
        // All we need to do here is catch and show any errors
        this.af.auth.login(this.model,
            {
                provider: AuthProviders.Password,
                method: AuthMethods.Password,
            })
            .then(
            data => this.onSuccess(data),
        )
            .catch(
            err => this.onFail(err),
        );
    }

    // Login success, moving on
    onSuccess(data) {
        //this.router.navigate(['/members']);
    }

    // Notify the user of failure and get them to try again
    onFail(err) {
        // TODO Check if the failure type is a timeout and if so show that to the user instead
        console.error('[LoginComponent] Auth request Failed: ' + JSON.stringify(err));
        this.submitted = false;
        this.submissionError = 'Error: ' + JSON.stringify(err);
    }

}
