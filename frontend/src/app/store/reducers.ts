import {
    AllActions,
    ChangePredictionsAction,
    InitialDataLoadedAction,
    PredictionsLoadedAction,
    ResultsLoadedAction,
    KnockoutLoadedAction,
    GroupResultsLoadedAction,
} from './actions';
import { InitialState, PredictionState, ResultState, KnockoutState, GroupResultState } from './state';

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
    knockout: {},
};

export function predictionStateReducer(state: PredictionState | undefined = EmptyPredictionState, action: typeof AllActions): PredictionState {
    switch (action.type) {
        case PredictionsLoadedAction.type: {
            return {
                groups: action.groups,
                knockout: action.knockout,
            };
        }
        case ChangePredictionsAction.type: {
            return {
                groups: action.groups,
                knockout: action.knockout,
            };
        }
        default: {
            return state;
        }
    }
}

export const EmptyResultsState: ResultState = {
    groups: {},
    knockout: {},
};

export function resultStateReducer(state: ResultState | undefined = EmptyPredictionState, action: typeof AllActions): ResultState {
    switch (action.type) {
        case ResultsLoadedAction.type: {
            return {
                groups: action.groups,
                knockout: action.knockout,
            };
        }
        default: {
            return state;
        }
    }
}

export const EmptyGroupResultsState: GroupResultState = {
    groupResults: {},
};

export function groupResultStateReducer(state: GroupResultState | undefined = EmptyGroupResultsState, action: typeof AllActions): GroupResultState {
    switch (action.type) {
        case GroupResultsLoadedAction.type: {
            return {
                groupResults: action.groupResults,
            };
        }
        default: {
            return state;
        }
    }
}

export const EmptyKnockoutState: KnockoutState = {
    knockout: {},
};

export function knockoutStateReducer(state: KnockoutState | undefined = EmptyKnockoutState, action: typeof AllActions): KnockoutState {
    switch (action.type) {
        case KnockoutLoadedAction.type: {
            return {
                knockout: action.knockout,
            };
        }
        default: {
            return state;
        }
    }
}
