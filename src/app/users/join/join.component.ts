import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

    constructor(private af: AngularFire, private route: ActivatedRoute) { }

    ngOnInit() {
        // get the token from the url
        this.route.params.forEach((params: Params) => {
            let token = params['token'];
            if (token) {
                console.log('[Join] activated with token: ' + token);
            }
        });
    }

}
