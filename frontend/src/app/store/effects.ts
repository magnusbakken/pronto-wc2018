import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of, concat } from 'rxjs';
import { debounceTime, map, mapTo, switchMap, combineLatest, tap, flatMap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';

import { ApiService, GroupData, SingleMatchData, TeamData, InitialData, MatchData, KnockoutData } from '../api/api.service';
import { Group, Match, Team } from '../models';
import {
    ChangePredictionsAction,
    GroupResultsLoadedAction,
    InitialDataLoadedAction,
    KnockoutLoadedAction,
    LoadGroupResultsAction,
    LoadInitialDataAction,
    LoadKnockoutAction,
    LoadPredictionsAction,
    LoadResultsAction,
    PredictionsLoadedAction,
    PredictionsSavedAction,
    ResultsLoadedAction,
    SavePredictionsAction,
} from './actions';
import { InitialState, AppState, KnockoutState } from './state';
import { AppService } from './service';

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
    public readonly initialDataLoaded = this.actions$.pipe(
        ofType(InitialDataLoadedAction),
        flatMap(_ => concat(
            of(new LoadPredictionsAction()),
            of(new LoadResultsAction()),
            of(new LoadGroupResultsAction()),
            of(new LoadKnockoutAction()),
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
        map(a => new SavePredictionsAction({ groups: a.groups, knockout: a.knockout })),
    );

    @Effect()
    public readonly savePredictions = this.actions$.pipe(
        ofType(SavePredictionsAction),
        switchMap(a => this.api.savePredictions({ groups: a.groups, knockout: a.knockout }).pipe(
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

    @Effect()
    public readonly loadGroupResults = this.actions$.pipe(
        ofType(LoadGroupResultsAction),
        switchMap(_ => this.api.getGroupResults().pipe(
            map(data => new GroupResultsLoadedAction(data)),
        ))
    );

    @Effect()
    public readonly loadKnockout = this.actions$.pipe(
        ofType(LoadKnockoutAction),
        switchMap(_ => this.api.getKnockout().pipe(
            combineLatest(this.store.pipe(select(s => s.initial.teams))),
            map(([data, teams]) => new KnockoutLoadedAction(getKnockoutState(data, teams))),
        )),
    );

    @Effect()
    public readonly reloadForPredictions = this.actions$.pipe(
        ofType(PredictionsSavedAction),
        flatMap(_ => concat(
            of(new LoadGroupResultsAction()),
            of(new LoadKnockoutAction()),
        )),
    );

    public constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private service: AppService,
        private api: ApiService) { }
}

function getInitialState(initialData: InitialData): InitialState {
    const teams = parseTeams(initialData.teams);
    const teamMapping = new Map(initialData.teams.map(x => [x.abbreviation, x] as [string, TeamData]));
    const matches = parseMatches(initialData.matches, teamMapping);
    const groups = parseGroups(initialData.groups, teamMapping, matches);
    return { groups, teams };
}

function parseTeams(teamData: TeamData[]): Team[] {
    return teamData.map(x => ({ abbreviation: x.abbreviation, fullName: x.fullName }));
}

function parseMatches(matchData: MatchData, teamMapping: Map<string, Team>): { [groupName: string]: Match[] } {
    const result: { [groupName: string]: Match[] } = {};
    for (const groupName in matchData.groups) {
        if (matchData.groups.hasOwnProperty(groupName)) {
            result[groupName] = parseGroupMatches(matchData.groups[groupName], teamMapping);
        }
    }
    return result;
}

function parseGroupMatches(matchData: SingleMatchData[], teamMapping: Map<string, Team>): Match[] {
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

function getKnockoutState(knockoutData: KnockoutData, teams: Team[]): KnockoutState {
    const knockoutState: KnockoutState = {
        knockout: {},
    };
    const teamMapping = new Map(teams.map(x => [x.abbreviation, x] as [string, Team]));
    for (const round in knockoutData.knockout) {
        knockoutState.knockout[round] = [];
        if (knockoutData.knockout.hasOwnProperty(round)) {
            for (const match of knockoutData.knockout[round]) {
                const homeTeam = match.homeTeam ? teamMapping.get(match.homeTeam) : null;
                const awayTeam = match.awayTeam ? teamMapping.get(match.awayTeam) : null;
                knockoutState.knockout[round].push({
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    date: new Date(match.date),
                });
            }
        }
    }
    return knockoutState;
}

function parseGroups(groupData: GroupData[], teamMapping: Map<string, Team>, matches: { [groupName: string]: Match[] }): Group[] {
    return groupData.map(x => ({
        name: x.name,
        teams: x.teams.map(t => {
            const team = teamMapping.get(t);
            if (team === undefined) {
                throw Error(`Unknown team: ${t}`);
            }
            return team;
        }),
        matches: matches[x.name],
    }));
}
