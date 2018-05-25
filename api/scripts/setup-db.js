const Database = require('better-sqlite3');

const options = {
	memory: false,
	readonly: false,
	fileMustExist: false,
}

const db = new Database('db/app.db', options);

db.exec(`CREATE TABLE IF NOT EXISTS predictions (
    username VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL
)`);

db.exec(`DELETE FROM predictions`);

db.exec(`INSERT INTO predictions (username, value) values ('dummyuser', '{
  "groups": {
    "A": [
      { "homeScore": 3, "awayScore": 3 },
      { "homeScore": 2, "awayScore": 1 },
      { "homeScore": 2, "awayScore": 4 },
      { "homeScore": 3, "awayScore": 0 },
      { "homeScore": 4, "awayScore": 4 },
      { "homeScore": 5, "awayScore": 3 }
    ],
    "B": [
      { "homeScore": 2, "awayScore": 0 },
      { "homeScore": 3, "awayScore": 4 },
      { "homeScore": 5, "awayScore": 5 },
      { "homeScore": 4, "awayScore": 5 },
      { "homeScore": 5, "awayScore": 2 },
      { "homeScore": 3, "awayScore": 3 }
    ],
    "C": [
      { "homeScore": 2, "awayScore": 2 },
      { "homeScore": 3, "awayScore": 5 },
      { "homeScore": 0, "awayScore": 5 },
      { "homeScore": 4, "awayScore": 3 },
      { "homeScore": 0, "awayScore": 3 },
      { "homeScore": 2, "awayScore": 4 }
    ],
    "D": [
      { "homeScore": 5, "awayScore": 5 },
      { "homeScore": 1, "awayScore": 5 },
      { "homeScore": 3, "awayScore": 3 },
      { "homeScore": 1, "awayScore": 5 },
      { "homeScore": 5, "awayScore": 1 },
      { "homeScore": 2, "awayScore": 5 }
    ],
    "E": [
      { "homeScore": 3, "awayScore": 3 },
      { "homeScore": 1, "awayScore": 1 },
      { "homeScore": 0, "awayScore": 1 },
      { "homeScore": 1, "awayScore": 2 },
      { "homeScore": 4, "awayScore": 3 },
      { "homeScore": 0, "awayScore": 3 }
    ],
    "F": [
      { "homeScore": 4, "awayScore": 3 },
      { "homeScore": 2, "awayScore": 0 },
      { "homeScore": 5, "awayScore": 4 },
      { "homeScore": 4, "awayScore": 1 },
      { "homeScore": 3, "awayScore": 2 },
      { "homeScore": 2, "awayScore": 1 }
    ],
    "G": [
      { "homeScore": 0, "awayScore": 1 },
      { "homeScore": 1, "awayScore": 3 },
      { "homeScore": 1, "awayScore": 1 },
      { "homeScore": 4, "awayScore": 5 },
      { "homeScore": 3, "awayScore": 0 },
      { "homeScore": 4, "awayScore": 4 }
    ],
    "H": [
      { "homeScore": 3, "awayScore": 5 },
      { "homeScore": 2, "awayScore": 1 },
      { "homeScore": 1, "awayScore": 4 },
      { "homeScore": 4, "awayScore": 0 },
      { "homeScore": 2, "awayScore": 3 },
      { "homeScore": 2, "awayScore": 5 }
    ]
  },
  "knockout": {
    "16": [
      { "homeScore": 2, "awayScore": 4 },
      { "homeScore": 2, "awayScore": 0 },
      { "homeScore": 0, "awayScore": 1 },
      { "homeScore": 3, "awayScore": 4 },
      { "homeScore": 3, "awayScore": 1 },
      { "homeScore": 3, "awayScore": 4 },
      { "homeScore": 3, "awayScore": 4 },
      { "homeScore": 4, "awayScore": 3 }
    ],
    "8": [
      { "homeScore": 5, "awayScore": 2 },
      { "homeScore": 5, "awayScore": 4 },
      { "homeScore": 0, "awayScore": 5 },
      { "homeScore": 1, "awayScore": 4 }
    ],
    "4": [
      { "homeScore": 2, "awayScore": 3 },
      { "homeScore": 4, "awayScore": 1 }
    ],
    "2": [
      { "homeScore": 1, "awayScore": 4 }
    ],
    "1": [
      { "homeScore": 5, "awayScore": 4 }
    ]
  }
}')`);