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

function mergeFirstKnockoutMatch(actualKnockoutMatch, predictedHomeTeam, predictedAwayTeam) {
  return {
    homeTeam: actualKnockoutMatch.homeTeam || predictedHomeTeam,
    awayTeam: actualKnockoutMatch.awayTeam || predictedAwayTeam,
    date: actualKnockoutMatch.date,
  };
}

function mergeLaterKnockoutMatch(actualKnockoutMatch, previousRound1, previousRound2, predictionRound1, predictionRound2, pickLoser = false) {
  let homeTeam = actualKnockoutMatch.homeTeam;
  if (!homeTeam && predictionRound1) {
    const round1HomeWinner = predictionRound1.homeScore > predictionRound1.awayScore;
    homeTeam = pickLoser ?
      (round1HomeWinner ? previousRound1.homeTeam : previousRound1.awayTeam) :
      (round1HomeWinner ? previousRound1.awayTeam : previousRound1.homeTeam);
  }
  let awayTeam = actualKnockoutMatch.awayTeam;  
  if (!awayTeam && predictionRound2) {
    const round2HomeWinner = predictionRound2.homeScore > predictionRound2.awayScore;
    awayTeam = pickLoser ?
      (round2HomeWinner ? previousRound2.homeTeam : previousRound2.awayTeam) :
      (round2HomeWinner ? previousRound2.awayTeam : previousRound2.homeTeam);
  }
  return {
    homeTeam: homeTeam || null,
    awayTeam: awayTeam || null,
    date: actualKnockoutMatch.date,
  };
}

function calculateKnockoutBracket(results, groups, matches, predictions) {
  if (!predictions) {
    preditions = {};
  }
  if (!predictions.knockout) {
    predictions.knockout = {};
    for (const round in ['16', '8', '4', '2', '1']) {
      if (!predictions.knockout[round]) {
        predictions.knockout[round] = [];
      }
    }
  }
  const groupResults = calculateGroupResults(results, groups, matches, predictions);
  const actualKnockout = matches.knockout;
  const predicted16 = [
    mergeFirstKnockoutMatch(actualKnockout['16'][0], groupResults['A'][0].team, groupResults['B'][1].team),
    mergeFirstKnockoutMatch(actualKnockout['16'][1], groupResults['C'][0].team, groupResults['D'][1].team),
    mergeFirstKnockoutMatch(actualKnockout['16'][2], groupResults['E'][0].team, groupResults['F'][1].team),
    mergeFirstKnockoutMatch(actualKnockout['16'][3], groupResults['G'][0].team, groupResults['H'][1].team),
    mergeFirstKnockoutMatch(actualKnockout['16'][4], groupResults['B'][0].team, groupResults['A'][1].team),
    mergeFirstKnockoutMatch(actualKnockout['16'][5], groupResults['D'][0].team, groupResults['C'][1].team),
    mergeFirstKnockoutMatch(actualKnockout['16'][6], groupResults['F'][0].team, groupResults['E'][1].team),
    mergeFirstKnockoutMatch(actualKnockout['16'][7], groupResults['H'][0].team, groupResults['G'][1].team),
  ];
  const predicted8 = [
    mergeLaterKnockoutMatch(actualKnockout['8'][0], predicted16[0], predicted16[1], predictions.knockout['16'][0], predictions.knockout['16'][1]),
    mergeLaterKnockoutMatch(actualKnockout['8'][1], predicted16[2], predicted16[3], predictions.knockout['16'][2], predictions.knockout['16'][3]),
    mergeLaterKnockoutMatch(actualKnockout['8'][2], predicted16[4], predicted16[5], predictions.knockout['16'][4], predictions.knockout['16'][5]),
    mergeLaterKnockoutMatch(actualKnockout['8'][3], predicted16[6], predicted16[7], predictions.knockout['16'][6], predictions.knockout['16'][7]),
  ];
  const predicted4 = [
    mergeLaterKnockoutMatch(actualKnockout['4'][0], predicted8[0], predicted8[1], predictions.knockout['8'][0], predictions.knockout['8'][1]),
    mergeLaterKnockoutMatch(actualKnockout['4'][1], predicted8[2], predicted8[3], predictions.knockout['8'][2], predictions.knockout['8'][3]),
  ];
  const predicted2 = [
    mergeLaterKnockoutMatch(actualKnockout['2'][0], predicted4[0], predicted4[1], predictions.knockout['4'][0], predictions.knockout['4'][1], true),
  ];
  const predicted1 = [
    mergeLaterKnockoutMatch(actualKnockout['1'][0], predicted4[0], predicted4[1], predictions.knockout['4'][0], predictions.knockout['4'][1]),
  ];
  return {
    'knockout': {
      '16': predicted16,
      '8': predicted8,
      '4': predicted4,
      '2': predicted2,
      '1': predicted1,
    },
  };
}

module.exports = { calculateGroupResults, calculateKnockoutBracket };