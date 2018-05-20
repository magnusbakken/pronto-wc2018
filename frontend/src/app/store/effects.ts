import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { combineLatest } from "rxjs";
import { debounceTime, map, mapTo, switchMap } from "rxjs/operators";
import { ofType } from "ts-action-operators";

import { ApiService, GroupData, MatchData, TeamData, InitialData } from "../api/api.service";
import { Group, Match, Team } from "../models";
import {
    ChangePredictionsAction,
    InitialDataLoadedAction,
    LoadInitialDataAction,
    LoadPredictionsAction,
    LoadResultsAction,
    PredictionsLoadedAction,
    PredictionsSavedAction,
    ResultsLoadedAction,
    SavePredictionsAction,
} from "./actions";
import { InitialState } from "./state";

@Injectable({
    providedIn: 'root'
})
export class AppEffects {
    @Effect()
    public readonly loadInitialData = this.actions$.pipe(
        ofType(LoadInitialDataAction),
        switchMap(_ => this.api.getInitialData().pipe(
            map(data => new InitialDataLoadedAction(getInitialState(data))),
        )),
    );

    @Effect()
    public readonly loadPredictions = this.actions$.pipe(
        ofType(LoadPredictionsAction),
        switchMap(_ => this.api.getPredictions().pipe(
            map(data => new PredictionsLoadedAction(data)),
        )),
    );

    @Effect()
    public readonly predictionsChanged = this.actions$.pipe(
        ofType(ChangePredictionsAction),
        debounceTime(1000),
        map(predictions => new SavePredictionsAction(predictions)),
    );

    @Effect()
    public readonly savePredictions = this.actions$.pipe(
        ofType(SavePredictionsAction),
        switchMap(predictions => this.api.savePredictions(predictions).pipe(
            mapTo(new PredictionsSavedAction()),
        )),
    );

    @Effect()
    public readonly loadResults = this.actions$.pipe(
        ofType(LoadResultsAction),
        switchMap(_ => this.api.getResults().pipe(
            map(data => new ResultsLoadedAction(data)),
        )),
    );

    public constructor(private actions$: Actions, private api: ApiService) { }
}

function getInitialState(initialData: InitialData): InitialState {
    const teams = parseTeams(initialData.teams);
    const teamMapping = new Map(initialData.teams.map(x => [x.abbreviation, x] as [string, TeamData]));
    const matches = parseMatches(initialData.matches, teamMapping);
    const groups = parseGroups(initialData.groups, teamMapping, matches);
    return { groups, matches, teams };
}

function parseTeams(teamData: TeamData[]): Team[] {
    return teamData.map(x => ({ abbreviation: x.abbreviation, fullName: x.fullName }));
}

function parseMatches(matchData: MatchData[], teamMapping: Map<string, Team>): Match[] {
    return matchData.map(x => {
        const homeTeam = teamMapping.get(x.homeTeam);
        const awayTeam = teamMapping.get(x.awayTeam);
        if (homeTeam === undefined) {
            throw Error(`Unknown team: ${x.homeTeam}`);
        } else if (awayTeam === undefined) {
            throw Error(`Unknown team: ${x.awayTeam}`);
        }
        return {
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            date: new Date(x.date),
        };
    });
}

function parseGroups(groupData: GroupData[], teamMapping: Map<string, Team>, matches: Match[]): Group[] {
    return groupData.map(x => ({
        name: x.name,
        teams: x.teams.map(t => {
            const team = teamMapping.get(t);
            if (team === undefined) {
                throw Error(`Unknown team: ${t}`);
            }
            return team;
        }),
        matches: matches.filter(m => x.teams.includes(m.homeTeam.abbreviation) || x.teams.includes(m.awayTeam.abbreviation)),
    }));
}