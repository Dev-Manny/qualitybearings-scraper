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
      res["Bearing Type"],
      res["Shaft Attachment"],
      res["Housing Construction"],
      res["Insert Material"],
      res["Expansion Capability"],
      res["Housing Dimensional Standard"],
      res["Sensor Ready"],
      res["Suitable for Washdown Environment"],
      res["Housing Type"],
      res["Sealing Type"],
      res["Relubricatable"],
      res["Lubrication"],
      res["Grease Name"],
      res["Suitable for High Temperature Application"],
      res["Dynamic Load Capacity"],
      res["Maximum Speed"],
      res["Static Load Capacity"],
      res["Shaft Diameter"],
      res["Bore Length"],
      res["Insert Outer Diameter"],
    ];
  });
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};

module.exports = exportDataToExcel;
