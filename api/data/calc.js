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

function compareTeams(team1, team2) {
  const pointDiff = team2.points - team1.points;
  if (pointDiff !== 0) {
    return pointDiff;
  }
  const goalDiff = (team2.goalsScored - team2.goalsAllowed) - (team1.goalsScored - team1.goalsAllowed);
  if (goalDiff !== 0) {
    return goalDiff;
  }
  return team2.goalsScored - team1.goalsScored;
}

function breakTie(teams, results, matches, predictions) {
  // TODO: fix
  if (teams.length === 4) {
    return [0, 1, 2, 3];
  }
  const teamNames = teams.map(t => t.team);
  result = [];
  for (let idx = 0; idx < teams.length; idx++) {
    result.push(idx);
  }
  return result;
}

function calculateGroupOrder(groupResults, results, matches, predictions) {
  const ordered = Object.keys(groupResults)
    .map(k => ({ team: k, ...groupResults[k] }))
    .sort(compareTeams);
  const finalResults = Array(ordered.length).fill(null);
  let idx = 0;
  while (idx < ordered.length) {
    let currentTeam = ordered[idx];
    let tieBreakIdx = idx;
    while (tieBreakIdx < ordered.length - 1 && compareTeams(currentTeam, ordered[tieBreakIdx + 1]) === 0) {
      tieBreakIdx++;
    }
    if (tieBreakIdx > idx) {
      const tieBrokenOrder = breakTie(ordered.slice(idx, tieBreakIdx + 1), results, matches, predictions);
      let newIdx = idx;
      for (const tieBrokenIdx of tieBrokenOrder) {
        finalResults[newIdx++] = ordered[idx + tieBrokenIdx];
      }
    } else {
      finalResults[idx] = currentTeam;
    }
    idx = tieBreakIdx + 1;
  }
  return finalResults.map(t => t.team);
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
    const groupOrder = calculateGroupOrder(
      groupMapping[groupName],
      results.groups[groupName] || [],
      matches.groups[groupName] || [],
      predictions.groups[groupName] || []);
    groupMapping[groupName] = groupOrder.map(team => ({ team: team, ...groupMapping[groupName][team] }));
  }
  return groupMapping;
}

function mergeKnockoutMatch(actualKnockoutMatch, predictedHomeTeam, predictedAwayTeam) {
  return {
    homeTeam: actualKnockoutMatch.homeTeam || predictedHomeTeam,
    awayTeam: actualKnockoutMatch.awayTeam || predictedAwayTeam,
    date: actualKnockoutMatch.date,
  };
}

function predictedKnockoutWinner(round, idx, matches, predictions) {
  return 
}

function calculateKnockoutBracket(results, groups, matches, predictions) {
  const groupResults = calculateGroupResults(results, groups, matches, predictions);
  const actualKnockout = matches.knockout;
  const predicted16 = [
    mergeKnockoutMatch(actualKnockout['16'][0], groupResults['A'][0], groupResults['B'][1]),
    mergeKnockoutMatch(actualKnockout['16'][1], groupResults['C'][0], groupResults['D'][1]),
    mergeKnockoutMatch(actualKnockout['16'][2], groupResults['E'][0], groupResults['F'][1]),
    mergeKnockoutMatch(actualKnockout['16'][3], groupResults['G'][0], groupResults['H'][1]),
    mergeKnockoutMatch(actualKnockout['16'][4], groupResults['B'][0], groupResults['A'][1]),
    mergeKnockoutMatch(actualKnockout['16'][5], groupResults['D'][0], groupResults['C'][1]),
    mergeKnockoutMatch(actualKnockout['16'][6], groupResults['F'][0], groupResults['E'][1]),
    mergeKnockoutMatch(actualKnockout['16'][7], groupResults['H'][0], groupResults['G'][1]),
  ];
  const predicted8 = [
    mergeKnockoutMatch(actualKnockout['8'][0], predictions.knockout['16'][0], predictions.knockout['16'][1]),
    mergeKnockoutMatch(actualKnockout['8'][1], predictions.knockout['16'][2], predictions.knockout['16'][3]),
    mergeKnockoutMatch(actualKnockout['8'][2], predictions.knockout['16'][4], predictions.knockout['16'][5]),
    mergeKnockoutMatch(actualKnockout['8'][3], predictions.knockout['16'][6], predictions.knockout['16'][7]),
  ];
  const predicted4 = [
    mergeKnockoutMatch(actualKnockout['4'][0], predictions.knockout['8'][0], predictions.knockout['8'][1]),
    mergeKnockoutMatch(actualKnockout['4'][1], predictions.knockout['8'][2], predictions.knockout['8'][3]),
  ];
  const predicted2 = [
    mergeKnockoutMatch(actualKnockout['2'][0], predictions.knockout['4'][0], predictions.knockout['4'][1]),
  ];
  const predicted1 = [
    mergeKnockoutMatch(actualKnockout['1'][0], predictions.knockout['4'][0], predictions.knockout['4'][1]),
  ];
}

module.exports = { calculateGroupResults, calculateKnockout };