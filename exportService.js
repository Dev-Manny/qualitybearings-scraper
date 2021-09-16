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
      res["Bore Size"],
      res["Casting Material"],
      res["Keyway Size"],
      res["Product ID"],
      res["Bushing Size"],
      res["Bushing Length"],
    ];
  });
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};

module.exports = exportDataToExcel;
