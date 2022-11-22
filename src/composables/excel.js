import exportFromJSON from "export-from-json";

export const useExcel = () => {
  const exportDataFromJSON = ({
    data,
    newFileName = null,
    fileExportType = null,
  }) => {
    if (!data) return;
    try {
      const fileName = newFileName || "exported-data";
      const exportType = exportFromJSON.types[fileExportType || "xls"];
      exportFromJSON({ data, fileName, exportType });
    } catch (e) {
      throw new Error("Parsing failed!");
    }
  };

  return {
    exportDataFromJSON,
  };
};
