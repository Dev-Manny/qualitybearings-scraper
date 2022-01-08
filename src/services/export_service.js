let converter = require('json-2-csv');
const fs = require('fs');

const exportDataToCSV = (data, filePath) => {
  converter.json2csv(data, (err, csv) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync(filePath, csv);
  });
};

module.exports = exportDataToCSV;
