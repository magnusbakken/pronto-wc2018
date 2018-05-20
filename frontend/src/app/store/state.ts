import { Group, Match, Team } from "../models";
import { Score } from "../api/api.service";

export interface InitialState {
    groups: Group[];
    matches: Match[];
    teams: Team[];
}

export interface PredictionState {
    groups: { [groupName: string]: Array<Score | null> };
}

export interface ResultState {
    groups: { [groupName: string]: Array<Score | null> };
}

export interface AppState {
    initial: InitialState;
    predictions: PredictionState;
    results: ResultState;
}