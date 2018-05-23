import { AllActions, ChangePredictionsAction, InitialDataLoadedAction, PredictionsLoadedAction, ResultsLoadedAction } from "./actions";
import { InitialState, PredictionState, ResultState } from "./state";

export const EmptyInitialState: InitialState = {
    groups: [],
    teams: [],
};

export function initialStateReducer(state: InitialState | undefined = EmptyInitialState, action: typeof AllActions): InitialState {
    switch (action.type) {
        case InitialDataLoadedAction.type: {
            return {
                groups: action.groups,
                teams: action.teams,
            };
        }
        default: {
            return state;
        }
    }
}

export const EmptyPredictionState: PredictionState = {
    groups: {},
}

export function predictionStateReducer(state: PredictionState | undefined = EmptyPredictionState, action: typeof AllActions): PredictionState {
    switch (action.type) {
        case PredictionsLoadedAction.type: {
            return {
                groups: action.groups,
            };
        }
        case ChangePredictionsAction.type: {
            return {
                groups: action.groups,
            };
        }
        default: {
            return state;
        }
    }
}

export const EmptyResultsState: ResultState = {
    groups: {},
}

export function resultStateReducer(state: ResultState | undefined = EmptyPredictionState, action: typeof AllActions): ResultState {
    switch (action.type) {
        case ResultsLoadedAction.type: {
            return {
                groups: action.groups,
            };
        }
        default: {
            return state;
        }
    }
}