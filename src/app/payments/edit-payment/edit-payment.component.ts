import { Component, OnInit, Input, ViewChild, SimpleChange, OnChanges } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-edit-payment',
    templateUrl: './edit-payment.component.html',
    styleUrls: ['./edit-payment.component.css']
})
export class EditPaymentComponent implements OnInit, OnChanges {

    model; // stores info about the payment
    member: FirebaseObjectObservable<any[]>; // the member
    submitted = false;

    @Input()
    payment;
    @Input()
    id: string;

    // variable to get the form
    @ViewChild('paymentForm') form: NgForm;

    constructor(private af: AngularFire) { }

    ngOnInit() {
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        // Clone for resetting when clicking discard
        this.clonePayment();
    }

    clonePayment() {
        // Cloning manually because otherwise we include the observable and everything breaks
        if (this.payment) {
            this.model = {
                $key: this.payment.$key,
                amount: this.payment.amount,
                date: this.payment.date,
                member: this.payment.member,
                bankreference: this.payment.bankreference,
                type: this.payment.type
            };
        }
    }

    onSubmit() {
        console.log('[PaymentMember] Saving Payment: ' + JSON.stringify(this.model));
        if (this.model.$key) {
            let model = JSON.parse(JSON.stringify(this.model));
            delete model.$key;
            this.af.database.object('/transactions/' + this.model.$key).set(model)
                .then(data => {
                    this.submitted = false;
                });
        } else {
            this.af.database.list('/transactions/').push(this.model)
                .then(data => {
                    this.submitted = false;
                });
        }
        // Firebase will automatically propagate our updated item to the main list
    }

    discard() {
        this.form.reset(this.payment);
    }

}
