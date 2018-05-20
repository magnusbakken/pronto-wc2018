import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";

import {
    ChangePredictionsAction,
    LoadInitialDataAction,
    LoadPredictionsAction,
    LoadResultsAction,
} from "./actions";
import { AppState, PredictionState } from "./state";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public readonly initialData$ = this.store.pipe(select(s => s.initial));
    public readonly predictions$ = this.store.pipe(select(s => s.predictions));
    public readonly results$ = this.store.pipe(select(s => s.results));

    public constructor(private store: Store<AppState>) { }

    public loadInitialData(): void {
        this.store.dispatch(new LoadInitialDataAction());
    }

    public loadPredictions(): void {
        this.store.dispatch(new LoadPredictionsAction());
    }

    public changePredictions(predictions: PredictionState): void {
        this.store.dispatch(new ChangePredictionsAction(predictions))
    }

    public loadResults(): void {
        this.store.dispatch(new LoadResultsAction());
    }
}