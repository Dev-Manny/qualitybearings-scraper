var csv = require('fast-csv');
const path = require('path');

let csvToArray = (file) =>
  new Promise((resolve) => {
    let returnList = [];
    csv
      .parseFile(path.resolve(__dirname, `../input/${file}.csv`), {
        headers: true,
      })
      .on('data', (data) => {
        returnList.push(data.catalog_number);
      })
      .on('end', () => {
        resolve(returnList);
      });
  });

module.exports = csvToArray;
