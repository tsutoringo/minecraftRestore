const path = require('path');
const version = process.argv[2];
const fs = require('fs');
const mcPath = require("minecraft-folder-path");
const getFiles = require('./getFiles.js');
const mkdirp = require('mkdirp');

const loadJSON = _path => JSON.parse(fs.readFileSync(_path, { encoding: 'utf8' }));

const objects = getFiles(path.join(mcPath, 'assets/objects'), f => true).reduce((a, c) => {
	a.set(c.match(/[0-9a-z]+$/)[0], c);
	return a;
}, new Map());
const {objects: indexes} = loadJSON(path.join(mcPath, 'assets/indexes', `${version}.json`));

for (const [k, v] of Object.entries(indexes)) {
	const file = path.parse(k);
	mkdirp.sync(path.join('dist', file.dir));
	const from = objects.get(v.hash);
	fs.copyFileSync(from, path.join('dist', k));
	console.log(`Copying ${from} to ${k}`);
}
