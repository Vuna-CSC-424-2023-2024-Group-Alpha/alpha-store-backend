const isTesting = process.env.NODE_ENV === "test"

if (isTesting)
  require('husky').install()

