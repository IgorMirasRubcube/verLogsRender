import { NextFunction, Request, Response } from "express";
import { validate, ValidationRules } from "validators/validator";

export const conditionalValidation = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.hasOwnProperty('full_name')) {
       console.log('hasOwnProperty full_name');
       return validate(ValidationRules.userWithoutPassword)(req, res, next);
    }

    if (req.body.hasOwnProperty('cep')) {
      console.log('hasOwnProperty cep');
       return validate(ValidationRules.address)(req, res, next);
    }

    if (req.body.hasOwnProperty('transfer_password')) {
      console.log('hasOwnProperty transfer_password');
      return validate(ValidationRules.transferPassword)(req, res, next);
   }
   
    // If no condition is met
    console.log('deu erro')
    res.status(400).send({ message: "Bad request" });

    throw new Error('Bad request');
};