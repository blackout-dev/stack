#!/usr/bin/env node

import {promises} from 'fs';
import {join} from 'path';

const {readdir, readFile, writeFile} = promises;

readdir(__dirname).then(async files => {
	const envFiles = files.filter(file => file.endsWith('.env') && !file.endsWith('.example.env'));

	const writeOperations = envFiles.map(async file => {
		const path = join(__dirname, file);
		const contents = await readFile(path, 'utf-8');

		return writeFile(
			path.replace(/(^.+)\.env$/, (match, fileName) => `${fileName}.example.env`),
			contents.replace(/(^.+=).+$/gm, (match, name) => name)
		);
	});

	await Promise.all(writeOperations);

	process.exit(0);
});
