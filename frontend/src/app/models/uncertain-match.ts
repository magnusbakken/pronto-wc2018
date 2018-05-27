import { Team } from './team';

export interface UncertainMatch {
    homeTeam: Team | null;
    awayTeam: Team | null;
    date: Date;
}
