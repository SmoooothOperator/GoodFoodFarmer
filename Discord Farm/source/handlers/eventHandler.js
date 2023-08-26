const path = require("path");

const getAllFiles = require("../utils/getAllFiles");

//export function
module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  //loops over every folder
  for (const eventFolder of eventFolders) {
    //gets all the files in the current folder in the loop
    const eventFiles = getAllFiles(eventFolder);
    //sort the files
    eventFiles.sort((a, b) => a > b);
    //get the name of the event functions (pop gets the last string)
    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    });
  }
};
