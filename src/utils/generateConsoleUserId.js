const { ConsoleUser } = require("../models")

const getNextConsoleUserId = async () => {
  // Find the document with the highest consoleUserId value
  const lastUser = await ConsoleUser.findOne({}, 'consoleUserId').sort({ consoleUserId: -1 }).limit(1);

  // Set the starting value for the sequence
  let startingValue = 467835001;

  // If a document with a consoleUserId exists, increment startingValue
  if (lastUser) {
    startingValue = parseInt(lastUser.consoleUserId) + 1;
  }

  // Generate the next consoleUserId value
  const nextConsoleUserId = await startingValue.toString().padStart(9, '0');
  return nextConsoleUserId;
};

module.exports = getNextConsoleUserId;
