import "dotenv/config";
import express from "express";
import usersRoutes from "routes/UserRoute";
import addressesRoutes from "routes/AddressRoute";
import accountsRoutes from "routes/AccountRoute";
import validationsRoutes from "routes/ValidationRoute";
import loginRoutes from "routes/LoginRoute";
import transfersRoutes from "routes/TransferRoute"
import adminRoutes from "routes/AdminRoute"
import notificationsRoutes from "routes/NotificationRoute";
import { authentication } from "middlewares/auth";
import { DateTime } from "luxon";
import { schedule } from "node-cron";
import PayScheduledTransfers from "application/PayScheduledTransfers"
import ResetUserAttempt from "application/ResetUserAttempt";

DateTime.local().setZone("America/Sao_Paulo");

const app = express();

app.use(express.json());

schedule("1 0 * * *", () => {
  const payScheduledTransfers = new PayScheduledTransfers();
  payScheduledTransfers.execute();
  console.log("Scheduled transfers paid");
}, {
  timezone: "America/Sao_Paulo"
});

schedule("0 2 15 * *", () => {
  const resetUserAttempt = new ResetUserAttempt();
  resetUserAttempt.execute();
  console.log("n_attempt of non-blocked users reseted");
}, {
  timezone: "America/Sao_Paulo"
});

app.get("/", (req, res) => {
  return res.send("Hello World");
});
app.use("/users", usersRoutes);
app.use("/addresses", authentication, addressesRoutes);
app.use("/accounts", authentication, accountsRoutes);
app.use("/validations", validationsRoutes);
app.use("/login", loginRoutes);
app.use("/transfers", authentication, transfersRoutes);
app.use("/admin", adminRoutes); // add adminAuth later
app.use("/notifications", authentication, notificationsRoutes);
app.listen(process.env.PORT || 3344);
