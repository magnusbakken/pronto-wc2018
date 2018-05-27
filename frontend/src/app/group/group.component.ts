import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Group, Match } from '../models';
import { Score } from '../api/api.service';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css']
})
export class GroupComponent {
    @Input() public formGroup: FormGroup;
    @Input() public group: Group;
    @Input() public predictions: Score[];
    @Input() public results: Array<Score | null>;

    public trackMatch(index: number, item: Match) {
        return `${item.homeTeam.abbreviation}-${item.awayTeam.abbreviation}`;
    }
}