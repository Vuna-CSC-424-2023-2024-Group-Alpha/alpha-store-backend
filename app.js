import express from "express";
import cors from "cors";

import connectDB from "./src/utilities/connectDb.js";
import authRoute from "./src/routes/auth.route.js";
import ecommerceRoute from "./src/routes/ecommerce.route.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/ecommerce", ecommerceRoute);

app.get("/", (req, res) => {
  res.send(
    `<h1>Alpha Store API Built by Adekolu Samuel Oluwaseun (Samixx Yasuke)</h1>`
  );
});

await connectDB(app);
