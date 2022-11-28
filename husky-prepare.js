const isProduction = process.env.NODE_ENV === "production"

if (!isProduction)
  require('husky').install()

