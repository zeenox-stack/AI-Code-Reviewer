const jsDiff = require("diff"); 

module.exports = (oldFile, newFile) => {
  const o = []; 

  jsDiff.diffArrays(oldFile.split("\n"), newFile.split("\n")).forEach(part => {
    const prefix = part.added ? "+" : (part.removed ? "-" : " "); 

    part.value.forEach(line => o.push(`${prefix}${line}`));
  }); 
  return o.join("\n");
}; 