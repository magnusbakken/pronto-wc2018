import { Group, Match, Team, UncertainMatch } from '../models';
import { Score } from '../api/api.service';

export interface InitialState {
    groups: Group[];
    teams: Team[];
}

export interface PredictionState {
    groups: { [groupName: string]: Array<Score | null> };
    knockout: { [round: string]: Array<Score | null> };
}

export interface ResultState {
    groups: { [groupName: string]: Array<Score | null> };
    knockout: { [round: string]: Array<Score | null> };
}

export interface GroupTeamResult {
    team: string;
    points: number;
    goalsScored: number;
    goalsAllowed: number;
    wins: number;
    draws: number;
    losses: number;
}

export interface GroupResultState {
    groupResults: { [groupName: string]: GroupTeamResult[] };
}

export interface KnockoutState {
    knockout: { [round: string]: UncertainMatch[] };
}

export interface AppState {
    initial: InitialState;
    predictions: PredictionState;
    groupResults: GroupResultState;
    results: ResultState;
    knockout: KnockoutState;
}
