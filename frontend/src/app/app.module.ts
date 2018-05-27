import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupComponent } from './group/group.component';
import { MatchComponent } from './match/match.component';
import { TeamComponent } from './team/team.component';

import { AppEffects, AppState, initialStateReducer, predictionStateReducer, resultStateReducer, knockoutStateReducer } from './store';
import { KnockoutComponent } from './knockout/knockout.component';

const reducers: ActionReducerMap<AppState> = {
    initial: initialStateReducer,
    predictions: predictionStateReducer,
    results: resultStateReducer,
    knockout: knockoutStateReducer,
};

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([AppEffects]),
        environment.production ? [] : StoreDevtoolsModule.instrument({ maxAge: 100 }),

        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        GroupComponent,
        TeamComponent,
        MatchComponent,
        KnockoutComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
