import express from 'express'
import auth from './src/routes/authentication.js'
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(auth)

export default app;