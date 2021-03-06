import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import {
    ChangePredictionsAction,
    LoadInitialDataAction,
    LoadPredictionsAction,
    LoadResultsAction,
    LoadKnockoutAction,
} from './actions';
import { AppState, PredictionState } from './state';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public readonly initialData$ = this.store.pipe(select(s => s.initial));
    public readonly predictions$ = this.store.pipe(select(s => s.predictions));
    public readonly results$ = this.store.pipe(select(s => s.results));
    public readonly groupResults$ = this.store.pipe(select(s => s.groupResults));
    public readonly knockout$ = this.store.pipe(select(s => s.knockout));

    public constructor(private store: Store<AppState>) { }

    public loadInitialData(): void {
        this.store.dispatch(new LoadInitialDataAction());
    }

    public changePredictions(predictions: PredictionState): void {
        this.store.dispatch(new ChangePredictionsAction(predictions));
    }
}
