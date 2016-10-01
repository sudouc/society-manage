import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

    payments: Observable<any[]>;
    hasPayments = true;
    selectedPayment;
    member: FirebaseObjectObservable<any[]>; // the member
    id; // the member's id

    constructor(private af: AngularFire, private route: ActivatedRoute) { }

    ngOnInit() {
        // get the employee from the url
        this.route.params.forEach((params: Params) => {
            let id = params['id']; // (+) converts string 'id' to a number
            // Fill with payments from a single member (or all, if id is null)
            this.id = id;
            this.member = this.af.database.object('/members/' + id); // get member

            // Sort by date if there is no member selected
            let queryParameter = { query: undefined };
            queryParameter.query = {
                orderByChild: 'date'
            };
            if (id) {
                queryParameter.query = {
                    orderByChild: 'member',
                    equalTo: id
                };
            }

            this.payments = this.af.database.list('/transactions/', queryParameter) // get payments
                .map((_payments) => {

                    return _payments.map((_payment) => {

                        _payment.memberObject = this.af.database.object('/members/' + _payment.member);
                        return _payment;
                    });
                });

            this.payments.subscribe(x => {
                if (x.length === 0) {
                    this.hasPayments = false;
                } else {
                    this.hasPayments = true;
                }
            });
        });
    }

    show(error, obj) {
        console.log(obj);
    }

    select(payment) {
        this.selectedPayment = payment;
    }

    add() {
        // Empty object for the edit-member component to use
        this.selectedPayment = {};
    }

}
