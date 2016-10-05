import { Component, OnInit, Input, SimpleChange, OnChanges, ViewChild } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { NgForm } from '@angular/forms';

declare let Clipboard: any; // Clipboardjs is imported through a webpack script, this is just to avoid linting errors

@Component({
    selector: 'app-edit-member',
    templateUrl: './edit-member.component.html',
    styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit, OnChanges {

    model; // stores info about the member
    submitted = false;
    inviteLink; // a link for the member to be invited

    @Input()
    member;

    // variable to get the form
    @ViewChild('memberForm') form: NgForm;

    constructor(private af: AngularFire) { }

    ngOnInit() {
        new Clipboard('.copybtn'); // tell clipboard js to grab the copy button
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        // Clone for resetting when clicking discard
        this.cloneModel();
        // clear any invite link
        this.inviteLink = null;
    }

    cloneModel() {
        if (this.member) {
            this.model = JSON.parse(JSON.stringify(this.member));
        }
    }

    onSubmit() {
        this.submitted = true;
        if (!this.model.$key) {
            this.af.database.list('/members').push(this.model)
                .then(data => {
                    this.model.$key = data.path.o[1];
                    this.submitted = false;
                });
        } else {
            let model = JSON.parse(JSON.stringify(this.model));
            delete model.$key;
            this.af.database.object('/members/' + this.model.$key).update(model)
                .then(data => {
                    this.submitted = false;
                });
        }
        // Firebase will automatically propagate our updated item to the main list
    }

    discard() {
        this.form.reset(this.member);
    }

    makeExec(model) {
        // Add the model key to the executive table
        this.af.database.object('/executives/' + model.$key).set({ 'position': 'unset' });
        // Indicate this member is executive
        this.af.database.object('/members/' + model.$key).update({ 'executive': true });
    }

    makeLinkInvite() {
        // Make an invite entry in the database
        this.af.database.object('/invitations/' + this.model.$key + '/message/').set('Welcome ' + this.model.firstname).then(
            data => {
                // set the invite link
                this.inviteLink = 'https://devmembers.sudo.org.au/join/' + this.model.$key;
            }
        );
    }

}
