import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

export type GroupData = { name: string, teams: string[] };
export type SingleMatchData = { homeTeam: string, awayTeam: string, date: string };
export type UncertainMatchData = { homeTeam: string | null, awayTeam: string | null, date: string };
export type GroupMatchData = { [groupName: string]: SingleMatchData[] };
export type MatchData = { groups: GroupMatchData };
export type TeamData = { abbreviation: string, fullName: string };
export interface InitialData {
    groups: GroupData[];
    matches: MatchData;
    teams: TeamData[];
}

export interface Score {
    homeScore: number;
    awayScore: number;
}

export interface ResultData {
    groups: { [groupName: string]: Array<Score | null> };
    knockout: { [round: string]: Array<Score | null> };
}

export interface KnockoutData {
    knockout: { [round: string]: UncertainMatchData[] };
}

export interface PredictionData {
    groups: { [groupName: string]: Array<Score | null> };
    knockout: { [round: string]: Array<Score | null> }
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public constructor(private http: HttpClient) { }

    public getInitialData(): Observable<InitialData> {
        return this.http.get(`${environment.apiUrl}initial`).pipe(map(a => a as InitialData));
    }

    public getPredictions(): Observable<PredictionData> {
        return this.http.get(`${environment.apiUrl}predictions`).pipe(map(a => a as PredictionData));
    }

    public savePredictions(predictions: PredictionData): Observable<{}> {
        return this.http.put(`${environment.apiUrl}predictions`, predictions).pipe(map(_ => ({})));
    }

    public getResults(): Observable<ResultData> {
        return this.http.get(`${environment.apiUrl}results`).pipe(map(a => a as ResultData));
    }

    public getKnockout(): Observable<KnockoutData> {
        return this.http.get(`${environment.apiUrl}knockout`).pipe(map(a => a as KnockoutData));
    }
}
