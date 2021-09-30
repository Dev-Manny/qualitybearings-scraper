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
      
      res["productName"],
      res["productSku"],
      res["productDescription"],
      res["productAdditionalDescription"],
      res["diameter"],
      res["articleCode"],
      res["threadType"],
      res["threadSize"],
      res["minMaterialThickness"],
      res["maxMaterialThickness"],
      res["finishing"],
      res["shaftDiameter"],
      res["workLength"],
      res["material1"],
      res["spindleSpeed"],
      res["feed"],
      res["power"],
      res["material2"],
      res["spindleSpeed2"],
      res["feed2"],
      res["power2"],
    ];
  });
  exportExcel(data, workSheetColumnNames, workSheetName, filePath);
};

module.exports = exportDataToExcel;
