import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { nameof } from '../../utils';
import { KnockoutState } from '../store';
import { UncertainMatch } from '../models';
import { Score } from '../api/api.service';

@Component({
  selector: 'app-knockout',
  templateUrl: './knockout.component.html',
  styleUrls: ['./knockout.component.css']
})
export class KnockoutComponent implements OnChanges {
  @Input() public formGroup: FormGroup;
  @Input() public knockout: { [round: string]: UncertainMatch[] };
  @Input() public predictions: { [round: string]: Array<Score | null> };
  @Input() public results: { [round: string]: Array<Score | null> };

  public rounds: string[] = [];
  
  public readonly roundNameMappings = {
    '16': 'Round of 16',
    '8': 'Quarter-finals',
    '4': 'Semi-finals',
    '2': 'Bronze-final',
    '1': 'Final',
  };

  public ngOnChanges(changes: SimpleChanges): void {
    if (nameof<KnockoutComponent>('knockout') in changes && this.knockout) {
      const rounds: string[] = [];
      for (const round in this.knockout) {
        if (this.knockout.hasOwnProperty(round)) {
          rounds.push(round);
        }
      }
      rounds.sort((x, y) => Number.parseInt(y) - Number.parseInt(x));
      this.rounds = rounds;
    }
  }
}