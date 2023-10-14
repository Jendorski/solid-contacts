import { NextFunction, Request, Response } from "express";
import Utils from "../utils/response";
import Validation from "./Validation";

const { failed } = Utils;
const { createContactField } = Validation;

const ValidationMiddleware = {
  validateNewContact: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, isValid } = createContactField(req.body);
      if (!isValid) {
        const values = Object.values(errors);
        return failed(
          res,
          errors,
          `Validation issues. ${JSON.stringify(values[0])}`,
          400
        );
      }
      next();
    } catch (error: Error | unknown) {
      return failed(res, null, String(error), 500);
    }
  },
};

export default ValidationMiddleware;
