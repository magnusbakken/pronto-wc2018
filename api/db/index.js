const Database = require('better-sqlite3');

const options = {
	memory: false,
	readonly: false,
	fileMustExist: true,
}

const db = new Database('db/app.db', options);

function getPredictions(userName) {
    const result = db.prepare('SELECT value FROM predictions WHERE username=?').get(userName);
    return result ? JSON.parse(result['value']) : {};
}

function setPredictions(userName, obj) {
    const value = JSON.stringify(obj);
    db.prepare('INSERT OR REPLACE INTO predictions (username, value) values (?, ?)').run(userName, value);
}

module.exports = { getPredictions, setPredictions }