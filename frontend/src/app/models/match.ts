import { Team } from "./team";

export interface Match {
    homeTeam: Team;
    awayTeam: Team;
    date: Date;
}