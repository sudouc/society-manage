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
    member; // the member that this transaction will be for
    submitted = false;

    @Input()
    payment;
    @Input()
    memberID; // the id of the member that this transaction will be for

    // variable to get the form
    @ViewChild('paymentForm') form: NgForm;

    constructor(private af: AngularFire) { }

    ngOnInit() {
        // TODO load member info from ID
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        // TODO load member info from ID
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

        if (!this.model.member) { // Model must have a member
            console.error('Must have member to submit a payment!!!!');
            // TODO show error
            return;
        } else if (this.model.$key) { // If model has key already
            let model = JSON.parse(JSON.stringify(this.model));
            delete model.$key;
            // upload the transaction
            this.af.database.object('/transactions/' + this.model.$key).set(model)
                .then(data => {
                    this.submitted = false;
                });
            // Add the transaction to the member's transaction list
            this.af.database.object('/members/' + this.model.member + '/payments/' + this.model.$key).set(true);
        } else { // finally, payment has member but no key
            this.af.database.list('/transactions/').push(this.model)
                .then(data => {
                    console.log('new transaction information returned');
                    console.log(data);
                    this.submitted = false;
                });
                // TODO add the new payment id to the member's payment list
        }
        // Firebase will automatically propagate our updated item to the main list
    }

    discard() {
        this.form.reset(this.payment);
    }

}
