import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { Group, Team } from '../models';
import { GroupTeamResult } from '../store';

interface TeamRow {
  team: Team;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsAllowed: number;
}

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css']
})
export class GroupTableComponent implements OnChanges {
  @Input() public group: Group;
  @Input() public groupResults: GroupTeamResult[];

  public dataSource: MatTableDataSource<TeamRow>;

  public readonly columns = ['team', 'wins', 'draws', 'losses', 'goals', 'points'];

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.group && this.groupResults && this.groupResults.length > 0) {
      this.dataSource = new MatTableDataSource<TeamRow>(this.groupResults.map(gr => ({
        ...gr,
        team: this.group.teams.find(t => t.abbreviation === gr.team),
      })));
    }
  }
}
