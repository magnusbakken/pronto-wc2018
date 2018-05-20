import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { nameof } from '../../utils';
import { Match } from '../models';
import { Score } from '../api/api.service';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnChanges {
    @Input() public formGroup: FormGroup;
    @Input() public match: Match;
    @Input() public prediction: Score | null;
    @Input() public result: Score | null;

    public homeScoreCorrect: boolean | null = null;
    public awayScoreCorrect: boolean | null = null;

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.prediction !== null && this.result !== null) {
            this.homeScoreCorrect = this.prediction.homeScore === this.result.homeScore;
            this.awayScoreCorrect = this.prediction.awayScore === this.result.awayScore;
        }
    }
}
