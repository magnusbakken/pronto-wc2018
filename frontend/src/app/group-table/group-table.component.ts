import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { Group, Team } from '../models';
import { GroupTeamResult } from '../store';

interface TeamRow {
  team: Team;
  points: number;
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

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.group && this.groupResults && this.groupResults.length > 0) {
      this.dataSource = new MatTableDataSource<TeamRow>(this.groupResults.map(gr => ({
        team: this.group.teams.find(t => t.abbreviation === gr.team),
        points: gr.points,
        goalsScored: gr.goalsScored,
        goalsAllowed: gr.goalsAllowed,
      })));
    }
  }
}
