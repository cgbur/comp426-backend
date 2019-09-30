import Store from 'data-store';
import path from 'path';
import fs from "fs";
import debug from 'debug';

// Loggers used. Environment variables used to limit output
const debugAutoData = debug('auto-data');
let dataStores = {};


debugAutoData(`Loading data stores. Use require() to import.`);

/*
  auto-load data stores. Drop in camelCase JSON files.
  A file name `account.json` will be exported as `userStore`.
 */
const files = fs.readdirSync(path.join(__dirname));
files.forEach(file => {
  if (file.endsWith('.json')) {
    const dataName = `${file.split('.')[0]}Store`;
    dataStores[dataName] = new Store({path: path.join(__dirname, file)});
    debugAutoData(`Loaded '${file}' and exported as '${dataName}'`);
  }
});

module.exports = dataStores;
