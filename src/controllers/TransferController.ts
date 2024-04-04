import { Request, Response } from "express";
import { TransferIn, TransferOut } from "dtos/TransfersDTO";
import { ExtractIn } from "dtos/ExtractsDTO";
import UserModel from "models/UserModel";
import TransferModel from "models/TransferModel";
import CreateTransfer from "application/CreateTransfer";
import { MapTo } from 'utils/mapToUtil'
import { subtractDays } from "utils/dateUtil";
import AccountModel from "models/AccountModel";
import { AccountOut } from "dtos/AccountsDTO";
import { UserOut } from "dtos/UsersDTO";

const userModel = new UserModel();
const transferModel = new TransferModel();
const accountModel = new AccountModel();

export default class TransferController {
  create = async (req: Request, res: Response) => {
    const transfer: TransferIn = MapTo.TransferIn(req.body);
    const transfer_password: string = req.body.transfer_password;
    const createTransfer = new CreateTransfer();
    
    try {
      let balances: {} = await createTransfer.execute(transfer, transfer_password);
      res.status(201).json(balances);
    } catch (e) {
      console.log("Failed to create transfer", e);
      res.status(500).send({
        error: "TFR-01",
        message: "Failed to create transfer",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const detailedTransfer: TransferOut | null = await transferModel.get(
        id,
        {
          from_account_id: true, to_account_id: true, value: true, description: true,
          type: true, is_scheduled: true, schedule_date: true, status: true,
          created_at: true, updated_at: true
        }
      ) as TransferOut;

      if (!detailedTransfer) {
        return res.status(404).json({
          error: "TRF-06",
          message: "Transfer not found.",
        });
      }

      const [fromAccount, toAccount] = await Promise.all([
        accountModel.get(
           detailedTransfer.from_account_id,
           {user_id: true, bank: true, agency: true, account_number: true, type: true}
        ) as Promise<AccountOut | null>,
        accountModel.get(
           detailedTransfer.to_account_id,
           {user_id: true, bank: true, agency: true, account_number: true, type: true}
        ) as Promise<AccountOut | null>
       ]);

      if (!fromAccount?.user_id || !toAccount?.user_id) {
        return res.status(404).json({
          error: "ACC-06",
          message: "Account not found",
        });
      }

      const [fromUser, toUser] = await Promise.all([
        userModel.get(
          fromAccount.user_id,
          {full_name: true}
        ) as Promise<UserOut | null>,
        userModel.get(
          toAccount.user_id,
          {full_name: true}
        ) as Promise<UserOut | null>,
      ]);

      if (!(fromUser && toUser)) {
        return res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }

      res.status(200).json({
        value: detailedTransfer.value,
        description: detailedTransfer.value,
        type: detailedTransfer.type,
        is_scheduled: detailedTransfer.is_scheduled,
        status: detailedTransfer.status,
        created_at: detailedTransfer.created_at,
        updated_at: detailedTransfer.updated_at,
        from_bank: fromAccount.bank,
        from_agency: fromAccount.agency,
        from_account_number: fromAccount.account_number,
        from_type: fromAccount.type,
        to_bank: toAccount.bank,
        to_agency: toAccount.agency,
        to_account_number: toAccount.account_number,
        to_type: toAccount.type,
        from_full_name: fromUser.full_name,
        to_full_name: toUser.full_name
      })
      
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(404).json({
        error: "TRF-06",
        message: "Transfer not found.",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const users: UserOut[] | null = await userModel.getAll();
      res.status(200).json(users);
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
    }
  };

  updatePassword = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const password: string = req.body.password;
      const userUpdated: UserOut | null = await userModel.update(
        id,
        password
      );

      if (userUpdated) {
        res.status(200).json(userUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update user", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update user",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const userDeleted: UserOut = await userModel.delete(id);
      res.status(200).json(userDeleted);
    } catch (e) {
      console.log("Failed to delete user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete user",
      });
    }
  };

  getExtract = async (req: Request, res: Response) => {
    const extract: ExtractIn = MapTo.ExtractIn(req.query);
    const account_id: string = req.params.account_id;
    let periodStartDate: Date;
    let periodEndDate: Date;
    let transfers: TransferOut[] | null;

    if (extract.periodStartDate && extract.periodEndDate) {
      periodStartDate = extract.periodStartDate;
      periodEndDate = extract.periodEndDate;
    } else {
      if (extract.period){
        periodStartDate = subtractDays(new Date(), extract.period);
        periodEndDate = new Date();
      } else {
        return res.status(400).send({
          message: "Bad Request"
        })
      }
    }
    
    
    if (extract.period) {
      periodStartDate = subtractDays(new Date(), extract.period);
    } else {
      if (extract.periodStartDate !== undefined) {
        periodStartDate = extract.periodStartDate;
      } else {

      }
      extract.periodEndDate !== undefined ? periodEndDate = extract.periodEndDate : null;
    }

    try {
      switch (extract.type) {
        case 'all':
          transfers = await transferModel.getAllByAccountId(
            account_id,
            periodStartDate,
            periodEndDate,
            extract.sort,
            { id: true, value: true, type: true, status: true, created_at: true },
          ) as TransferOut[];
  
          res.status(200).json(transfers);
          break;
        
        case 'entrance':
          transfers = await transferModel.getEntrancesByAccountId(
            account_id,
            periodStartDate,
            periodEndDate,
            extract.sort,
            { id: true, value: true, type: true, status: true, created_at: true },
          ) as TransferOut[];
  
          res.status(200).json(transfers);
          break;
  
        case 'exit':
          transfers = await transferModel.getExitsByAccountId(
            account_id,
            periodStartDate,
            periodEndDate,
            extract.sort,
            { id: true, value: true, type: true, status: true, created_at: true },
          ) as TransferOut[];
  
          res.status(200).json(transfers);
          break;
  
        case 'future':
          transfers = await transferModel.getFuturesByAccountId(
            account_id,
            extract.sort,
            { id: true, value: true, type: true, status: true, created_at: true },
          ) as TransferOut[];
  
          res.status(200).json(transfers);
          break;
  
        default:
          return res.status(500).send({
            error: "EXT-03",
            message: "Failed to get extract",
          });
      }
    } catch (e) {
      console.log('Failed to get extract', e);
      res.status(500).send({
        error: "EXT-03",
        message: "Failed to get extract",
      });
    }
  }
}