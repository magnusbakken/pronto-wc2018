import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { nameof, toObject } from "../../utils";
import { Group } from '../models';
import { PredictionState, ResultState, KnockoutState, GroupResultState } from '../store';
import { debounceTime, distinctUntilChanged, filter, distinct } from 'rxjs/operators';
import { PropertyBindingType } from '@angular/compiler';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnChanges {
    @Input() public groups: Group[];
    @Input() public predictions: PredictionState;
    @Input() public results: ResultState;
    @Input() public groupResults: GroupResultState;
    @Input() public knockout: KnockoutState;

    @Output() public readonly predictionsChanged = new EventEmitter<PredictionState>();
    
    public formGroup: FormGroup;
    public groupDisplays: { [groupName: string]: "matches" | "table" } = {};

    private hasGroups: boolean = false;
    private hasPredictions: boolean = false;
    private hasResults: boolean = false;
    private hasKnockout: boolean = false;

    public constructor(private fb: FormBuilder) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (nameof<DashboardComponent>("groups") in changes && !changes.groups.firstChange) {
            this.hasGroups = true;
            for (const groupName of this.groups.map(g => g.name)) {
                this.groupDisplays[groupName] = "matches";
            }
        }
        if (nameof<DashboardComponent>("predictions") in changes && !changes.predictions.firstChange) {
            this.hasPredictions = true;
        }
        if (nameof<DashboardComponent>("results") in changes && !changes.results.firstChange) {
            this.hasResults = true;
        }
        if (nameof<DashboardComponent>("knockout") in changes && !changes.knockout.firstChange) {
            this.hasKnockout = true;
        }
        if (this.hasGroups && this.hasPredictions && this.hasResults && this.hasKnockout) {
            const groupControls = this.groups.map(g => [g.name, this.createGroupFormArray(g)] as [string, FormArray]);
            const knockoutRoundControls: Array<[string, FormArray]> = [];
            for (const round in this.knockout.knockout) {
                if (this.knockout.knockout.hasOwnProperty(round)) {
                    knockoutRoundControls.push([round, this.createKnockoutFormArray(round)]);
                }
            }
            this.formGroup = this.fb.group({
                groups: this.fb.group(toObject(groupControls)),
                knockout: this.fb.group(toObject(knockoutRoundControls)),
            });
            this.formGroup.valueChanges.pipe(
                filter(_ => this.formGroup.dirty),
                distinctUntilChanged((x, y) => comparePredictions(x, y)),
                debounceTime(1000),
            ).subscribe(s => this.predictionsChanged.emit(s));
        }
    }

    public singleGroupDisplayChanged(groupName: string, newValue: "matches" | "table"): void {
        this.groupDisplays[groupName] = newValue;
    }

    private createGroupFormArray(group: Group): FormArray {
        return this.fb.array(group.matches.map((m, idx) => this.createGroupMatchGroup(group.name, idx)));
    }

    private createGroupMatchGroup(groupName: string, matchIndex: number): FormGroup {
        const prediction = (this.predictions.groups[groupName] || [])[matchIndex] || { homeScore: "", awayScore: "" };
        const hasResult = this.results.groups[groupName][matchIndex] !== null;
        return this.fb.group({
            homeScore: this.fb.control({ value: prediction.homeScore, disabled: hasResult }),
            awayScore: this.fb.control({ value: prediction.awayScore, disabled: hasResult }),
        });
    }

    private createKnockoutFormArray(roundName: string): FormArray {
        let count = Number.parseInt(roundName);
        if (count === 1) {
            count = 2;
        }
        count = count / 2;
        const indices = Array.from({ length: count }, (value, key) => key);
        return this.fb.array(indices.map(n => this.createKnockoutMatchGroup(roundName, n)));
    }

    private createKnockoutMatchGroup(roundName: string, matchIndex: number): FormGroup {
        const prediction = (this.predictions.knockout[roundName] || [])[matchIndex] || { homeScore: "", awayScore: "" };
        const hasResult = this.results.knockout[roundName][matchIndex] !== null;
        return this.fb.group({
            homeScore: this.fb.control({ value: prediction.homeScore, disabled: hasResult }),
            awayScore: this.fb.control({ value: prediction.awayScore, disabled: hasResult }),
        });
    }
}

function comparePredictions(p1: PredictionState, p2: PredictionState): boolean {
    const groupNames: string[] = [];
    for (const groupName in p1.groups) {
        groupNames.push(groupName);
        if (p1.groups.hasOwnProperty(groupName)) {
            if (!(groupName in p2.groups)) {
                return false;
            }
            if (p1.groups[groupName].length !== p2.groups[groupName].length) {
                return false;
            }
            let idx = 0;
            for (const prediction1 of p1.groups[groupName]) {
                const prediction2 = p2.groups[groupName][idx];
                if (prediction1.homeScore !== prediction2.homeScore || prediction1.awayScore !== prediction2.awayScore) {
                    return false;
                }
                idx++;
            }
        }
    }
    for (const groupName in p2.groups) {
        if (p2.groups.hasOwnProperty(groupName) && !(groupName in groupNames)) {
            return false;
        }
    }
    const knockoutRounds: string[] = [];
    for (const knockoutRound in p1.knockout) {
        knockoutRounds.push(knockoutRound);
        if (p1.knockout.hasOwnProperty(knockoutRound)) {
            if (!(knockoutRound in p2.knockout)) {
                return false;
            }
            if (p1.knockout[knockoutRound].length !== p2.knockout[knockoutRound].length) {
                return false;
            }
            let idx = 0;
            for (const prediction1 of p1.knockout[knockoutRound]) {
                const prediction2 = p2.knockout[knockoutRound][idx];
                if (prediction1.homeScore !== prediction2.homeScore || prediction1.awayScore !== prediction2.awayScore) {
                    return false;
                }
                idx++;
            }
        }
    }
    return true;
}