function getOutcome(matchResult) {
    if (matchResult.homeScore === matchResult.awayScore) {
        return 'draw';
    } else if (matchResult.homeScore > matchResult.awayScore) {
        return 'home';
    } else {
        return 'away';
    }
}

function updateTeamResults(matchResult, homeTeam, awayTeam) {
    homeTeam.goalsScored += matchResult.homeScore;
    homeTeam.goalsAllowed += matchResult.awayScore;
    awayTeam.goalsScored += matchResult.awayScore;
    awayTeam.goalsAllowed += matchResult.homeScore;
    const outcome = getOutcome(matchResult);
    homeTeam.points += outcome === 'home' ? 3 : outcome === 'draw' ? 1 : 0;
    awayTeam.points += outcome === 'away' ? 3 : outcome === 'draw' ? 1 : 0;
}

function calculateGroupResults(results, groups, matches, predictions) {
    predictions = predictions || { groups: {} };
    const groupMapping = {};
    for (const groupName in results.groups) {
        if (!(groupName in predictions.groups)) {
            predictions.groups[groupName] = [];
        }
        groupMapping[groupName] = {};
        for (const team of groups.filter(g => g.name === groupName)[0].teams) {
            groupMapping[groupName][team] = { points: 0, goalsScored: 0, goalsAllowed: 0 };
        }
        let idx = 0;
        for (let matchResult of results.groups[groupName]) {
            if (!matchResult && groupName in predictions.groups) {
                matchResult = predictions.groups[groupName][idx];
            }
            if (matchResult) {
                const match = matches.groups[groupName][idx];
                const homeTeam = groupMapping[groupName][match.homeTeam];
                const awayTeam = groupMapping[groupName][match.awayTeam];
                updateTeamResults(matchResult, homeTeam, awayTeam);
            }
            idx++;
        }
    }
    return groupMapping;
}

function calculateKnockout(results, groups, matches, predictions) {
    const groupResults = calculateGroupResults(results, groups, matches, predictions);
    return {};
}

module.exports = { calculateGroupResults, calculateKnockout };