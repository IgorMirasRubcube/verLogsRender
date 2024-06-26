import { Request, Response } from "express";
import { AddressIn, AddressOut } from "dtos/AddressesDTO";
import AddressModel from "models/AddressModel";
import UserModel from "models/UserModel";
import { UserOut } from "dtos/UsersDTO";
import { MapTo } from 'utils/mapToUtil';

const addressModel = new AddressModel();
const userModel = new UserModel();

export default class AddressController {
  create = async (req: Request, res: Response) => {
    try {
      let address: AddressIn = req.body;
      const newAddress: AddressOut = await addressModel.create(address);
      res.status(201).json(newAddress);
    } catch (e) {
      console.log("Failed to create address", e);
      res.status(500).send({
        error: "ADR-01",
        message: "Failed to create address",
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const newAddress: AddressOut | null = await addressModel.get(id);

      if (newAddress) {
        res.status(200).json(newAddress);
      } else {
        res.status(404).json({
          error: "ADR-06",
          message: "Address not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get address", e);
      res.status(500).send({
        error: "ADR-02",
        message: "Failed to get address",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const addresses: AddressOut[] | null = await addressModel.getAll();
      res.status(200).json(addresses);
    } catch (e) {
      console.log("Failed to get all addresses", e);
      res.status(500).send({
        error: "ADR-03",
        message: "Failed to get all addresses",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const user_id: string = req.user.id;
      const updateAddress: AddressIn = MapTo.AddressIn(req.body);

      const user: UserOut | null = await userModel.get(user_id, {address_id: true}) as UserOut;

      if (!user.address_id) {
        return res.status(404).json({
          error: "ADR-06",
          message: "Address not found.",
        });
      }

      const addressUpdated: AddressOut | null = await addressModel.update(
        user.address_id,
        updateAddress
      );

      if (addressUpdated) {
        res.status(200).json(addressUpdated);
      } else {
        res.status(404).json({
          error: "ADR-06",
          message: "Address not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update address", e);
      res.status(500).send({
        error: "ADR-04",
        message: "Failed to update address",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const addressDeleted = await addressModel.delete(id);
      res.status(204).json(addressDeleted);
    } catch (e) {
      console.log("Failed to delete address", e);
      res.status(500).send({
        error: "ADR-05",
        message: "Failed to delete address",
      });
    }
  };

  verify = async (req: Request, res: Response) => {
    res.status(200).send('Sucess');
  };
}