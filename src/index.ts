import "dotenv/config";
import express from "express";
import usersRoutes from "routes/UserRoute";
import addressesRoutes from "routes/AddressRoute";
import accountsRoutes from "routes/AccountRoute";
import validationsRoutes from "routes/ValidationRoute";
import authRoutes from "routes/AuthRoute";
import transfersRoutes from "routes/TransferRoute"
import adminRoutes from "routes/AdminRoute"
import notificationsRoutes from "routes/NotificationRoute";
import { authentication, authenticationAdmin } from "middlewares/auth";
import { DateTime } from "luxon";
import { schedule } from "node-cron";
import PayScheduledTransfers from "application/PayScheduledTransfers"
import ResetUserAttempt from "application/ResetUserAttempt";
import axios from "axios";
import cors from 'cors'
import { Request, Response, NextFunction } from 'express';
import PaySavingsIncome from "application/PaySavingsIncome";


DateTime.local().setZone("America/Sao_Paulo");

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*'
}));

schedule("1 0 * * *", () => {
  const payScheduledTransfers = new PayScheduledTransfers();
  payScheduledTransfers.execute();
}, {
  timezone: "America/Sao_Paulo"
});

schedule("0 2 15 * *", () => {
  const resetUserAttempt = new ResetUserAttempt();
  resetUserAttempt.execute();
}, {
  timezone: "America/Sao_Paulo"
});

schedule("1 0 1 * *", () => {
  const paySavingsIncome = new PaySavingsIncome();
  paySavingsIncome.execute();
}, {
  timezone: "America/Sao_Paulo"
});

schedule("*/5 * * * *", () => {
  try {
    axios.get('https://acordadordebackend.onrender.com/');
  } catch (e) {
    console.log('Error on GET deployed API: ', e);
  }
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
app.use("/auth", authRoutes);
app.use("/transfers", authentication, transfersRoutes);
app.use("/admin", authenticationAdmin, adminRoutes); // add adminAuth later
app.use("/notifications", authentication, notificationsRoutes);
app.listen(process.env.PORT || 3344);
