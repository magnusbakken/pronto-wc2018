import { Team } from './team';
import { Match } from './match';

export interface Group {
    name: string;
    teams: Team[];
    matches: Match[];
}
