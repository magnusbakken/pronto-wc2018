import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Team } from '../models';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnChanges {
    @Input() public team: Team;
    @Input() public showName: boolean;

    public classes: string;

    public ngOnChanges(changes: SimpleChanges): void {
        this.classes = `flag-icon team-flag-icon flag-icon-${this.team.abbreviation.toLocaleLowerCase()}`;
    }
}
