import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-executive',
    templateUrl: './executive.component.html',
    styleUrls: ['./executive.component.css']
})
export class ExecutiveComponent implements OnInit {

    executiveMembers: Observable<any[]>;
    hasExecutive = true;

    constructor(private af: AngularFire) { }

    ngOnInit() {
        this.executiveMembers = this.af.database.list('/executives')
            .map((_executives) => {

                return _executives.map((_executive) => {

                    _executive.member = this.af.database.object('/members/' + _executive.$key);
                    return _executive;

                });
            });

        this.executiveMembers.subscribe(x => {
            if (x.length === 0) {
                this.hasExecutive = false;
            } else {
                this.hasExecutive = true;
            }
        });
    }

    savePosition(executiveKey, executivePosition) {
        console.log('saving position: ' + executiveKey + ' : ' + executivePosition);
        this.af.database.object('/executives/' + executiveKey).update({
            position: executivePosition
        });
    }

    remove(executiveKey) {
        console.log('removing: ' + executiveKey);
        this.af.database.list('/executives').remove(executiveKey);
    }

}
