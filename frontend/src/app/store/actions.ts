import { action, props, union } from 'ts-action';

import { InitialState, KnockoutState, PredictionState, ResultState, GroupResultState } from './state';

export const LoadInitialDataAction = action('LOAD_INITIAL');
export const InitialDataLoadedAction = action('INITIAL_DATA_LOADED', props<InitialState>());

export const LoadPredictionsAction = action('LOAD_PREDICTIONS');
export const PredictionsLoadedAction = action('PREDICTIONS_LOADED', props<PredictionState>());
export const ChangePredictionsAction = action('PREDICTIONS_CHANGED', props<PredictionState>());

export const SavePredictionsAction = action('SAVE_PREDICTIONS', props<PredictionState>());
export const PredictionsSavedAction = action('PREDICTIONS_SAVED');

export const LoadResultsAction = action('LOAD_RESULTS');
export const ResultsLoadedAction = action('RESULTS_LOADED', props<ResultState>());

export const LoadGroupResultsAction = action('LOAD_GROUP_RESULTS');
export const GroupResultsLoadedAction = action('GROUP_RESULTS_LOADED', props<GroupResultState>());

export const LoadKnockoutAction = action('LOAD_KNOCKOUT');
export const KnockoutLoadedAction = action('KNOCKOUT_LOADED', props<KnockoutState>());

export const AllActions = union({
    LoadInitialDataAction,
    InitialDataLoadedAction,
    LoadPredictionsAction,
    PredictionsLoadedAction,
    ChangePredictionsAction,
    SavePredictionsAction,
    PredictionsSavedAction,
    LoadResultsAction,
    ResultsLoadedAction,
    LoadGroupResultsAction,
    GroupResultsLoadedAction,
    LoadKnockoutAction,
    KnockoutLoadedAction,
});
