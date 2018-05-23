function calculateGroupResults(results, groups, matches) {
    const groupMapping = {};
    for (const groupName in results.groups) {
        groupMapping[groupName] = {};
        for (const team of groups.filter(g => g.name === groupName)[0].teams) {
            groupMapping[groupName][team] = { points: 0, goalsScored: 0, goalsAllowed: 0 };
        }
        let idx = 0;
        for (const matchResult of results.groups[groupName]) {
            if (matchResult !== null) {
                const match = matches.groups[groupName][idx];
                groupMapping[groupName][match.homeTeam].goalsScored += matchResult.homeScore;
                groupMapping[groupName][match.homeTeam].goalsAllowed += matchResult.awayScore;
                groupMapping[groupName][match.awayTeam].goalsScored += matchResult.awayScore;
                groupMapping[groupName][match.awayTeam].goalsAllowed += matchResult.homeScore;
                const outcome = matchResult.homeScore === matchResult.awayScore ?
                    'draw' :
                    matchResult.homeScore > matchResult.awayScore ? 'home' : 'away';
                groupMapping[groupName][match.homeTeam].points += outcome === 'home' ? 3 : outcome === 'draw' ? 1 : 0;
                groupMapping[groupName][match.awayTeam].points += outcome === 'away' ? 3 : outcome === 'draw' ? 1 : 0;
            }
            idx++;
        }
    }
    return groupMapping;
}

module.exports = { calculateGroupResults };