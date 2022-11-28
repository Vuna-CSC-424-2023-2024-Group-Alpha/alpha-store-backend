const isProduction = process.env.NODE_ENV === "production"

console.log(process.env.NODE_ENV)
if (!isProduction)
  require('husky').install()

