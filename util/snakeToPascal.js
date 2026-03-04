export const snakeToPascal = (snakeCaseName) => {
  let pascalCaseName = snakeCaseName[0].toUpperCase();
  pascalCaseName += snakeCaseName.substring(1);

  let start = 1;
  let underscorePos = -1;
  while ((underscorePos = pascalCaseName.indexOf('_', start)) !== -1) {
    // pascalCaseName =
    //   pascalCaseName.substring(0, underscorePos + 1) +
    //   pascalCaseName[underscorePos + 1].toUpperCase() +
    //   pascalCaseName.substring(underscorePos + 2);
    // // pascalCaseName =
    // //   pascalCaseName.substring(0, underscorePos) +
    // //   pascalCaseName.substring(underscorePos + 1);
    // pascalCaseName = pascalCaseName.replace('_', '');
    pascalCaseName =
      pascalCaseName.substring(0, underscorePos) +
      pascalCaseName[underscorePos + 1].toUpperCase() +
      pascalCaseName.substring(underscorePos + 2);
    start = underscorePos + 1;
  }

  return pascalCaseName;
};
