const isProduction = process.env.NODE_ENV === "production"

console.log(process.env)
if (!isProduction)
  require('husky').install()

