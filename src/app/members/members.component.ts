import { Component, OnInit } from '@angular/core';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

    members: FirebaseListObservable<any[]>;
    selectedMember;
    title = 'Members';

    constructor(private af: AngularFire) { }

    ngOnInit() {
        this.members = this.af.database.list('/members', {
            query: {
                orderByChild: 'firstname',
            }
        });
        // TODO, set selected employee to first item in the list when it comes back
    }

    select(member) {
        this.selectedMember = member;
    }

    add() {
        // Empty object for the edit-member component to use
        this.selectedMember = {}
    }

}
