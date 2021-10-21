const xlsx = require("xlsx");
const path = require("path");

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumnNames, ...data];
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(filePath));
};

const exportDataToExcel = (
  jsonData,
  workSheetColumnNames,
  workSheetName,
  filePath
) => {
  const data = jsonData.map((res) => {
    return [
      res["Product ID"],
      res["Shaft Diameter"],
      res["Dynamic Load Rating"],
      res["Static Load Rating"],
      res["Weight"],
      res["D"],
      res["U"],
      res["B"],
      res["C"],
      res["L"],
      res["Bi"],
      res["Be"],
      res["r"],
      res["R"],
      res["n"],
      res["N"],
      res["m"],
      res["M"],
      res["G"],
      res["Z"],
      res["O"],
      res["T"],
      res["YMax"],
      res["Y"],
      res["W"],
      res["J"],
      res["K"],
      res["ds"],
    ];
  });
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};

module.exports = exportDataToExcel;
