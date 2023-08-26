/*
This function will read all the files in the parameter directory
and return all the filepaths in that directory.
*/

const fs = require("fs");
const path = require("path");

//This function is exported and takes in 2 parameters
module.exports = (directory, foldersOnly = false) => {
  let fileNames = [];
  //Reads the content of the directory and returns an array of folder names
  const files = fs.readdirSync(directory, { withFileTypes: true });

  //Loops over every file in the directory
  for (const file of files) {
    //Produces the path of each file
    const filePath = path.join(directory, file.name);

    if (foldersOnly) {
      if (file.isDirectory()) {
        fileNames.push(filePath);
      }
    } else {
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
};
