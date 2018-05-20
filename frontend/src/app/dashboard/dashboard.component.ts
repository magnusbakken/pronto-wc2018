import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { nameof, toObject } from "../../utils";
import { Group } from '../models';
import { PredictionState, ResultState } from '../store';
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

    @Output() public readonly predictionsChanged = new EventEmitter<PredictionState>();
    
    public formGroup: FormGroup;

    private hasGroups: boolean = false;
    private hasPredictions: boolean = false;
    private hasResults: boolean = false;

    public constructor(private fb: FormBuilder) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (nameof<DashboardComponent>("groups") in changes && !changes.groups.firstChange) {
            this.hasGroups = true;
        }
        if (nameof<DashboardComponent>("predictions") in changes && !changes.predictions.firstChange) {
            this.hasPredictions = true;
        }
        if (nameof<DashboardComponent>("results") in changes && !changes.results.firstChange) {
            this.hasResults = true;
        }
        if (this.hasGroups && this.hasPredictions && this.hasResults) {
            const groupControls = this.groups.map(g => [g.name, this.createFormArray(g)] as [string, FormArray]);
            this.formGroup = this.fb.group({
                groups: this.fb.group(toObject(groupControls)),
            });
            this.formGroup.valueChanges.pipe(
                filter(_ => this.formGroup.dirty),
                distinctUntilChanged((x, y) => comparePredictions(x, y)),
                debounceTime(1000)
            ).subscribe(s => this.predictionsChanged.emit(s));
        }
    }

    private createFormArray(group: Group) {
        return this.fb.array(group.matches.map((m, idx) => this.createMatchGroup(group.name, idx)));
    }

    private createMatchGroup(groupName: string, matchIndex: number): FormGroup {
        const prediction = (this.predictions.groups[groupName] || [])[matchIndex] || { homeScore: "", awayScore: "" };
        const hasResult = this.results.groups[groupName][matchIndex] !== null;
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
    return true;
}