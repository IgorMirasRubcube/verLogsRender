import "dotenv/config";
import express from "express";
import usersRoutes from "routes/UserRoute";
import addressesRoutes from "routes/AddressRoute";
import accountsRoutes from "routes/AccountRoute";
import validationsRoutes from "routes/ValidationRoute";
import { authentication } from "middlewares/auth";
import { DateTime } from "luxon";

DateTime.local().setZone("America/Sao_Paulo");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello World");
});
app.use("/users", usersRoutes);
app.use("/addresses", authentication, addressesRoutes);
app.use("/accounts", authentication, accountsRoutes);
app.use("/validations", validationsRoutes);
app.listen(process.env.PORT || 3344);
