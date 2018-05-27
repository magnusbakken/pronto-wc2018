import { Component, OnInit } from '@angular/core';

import { AppService } from './store';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public constructor(public service: AppService) { }
    
    public ngOnInit(): void {
        this.service.loadInitialData();
    }
}