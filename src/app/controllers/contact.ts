import { Request, Response } from "express";
import { deleteActionService } from "../services/contacts/deleteAction";
import { fetchAContactService, fetchAll } from "../services/contacts/fetch";
import { newContacts, updateAContact } from "../services/contacts/store";
import { isEmpty } from "../utils/helpers";
import Utils from "../utils/response";

const { success, failed } = Utils;

export const ContactController = {
  create: async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      address,
      birthday,
      notes,
      phoneNumber,
    } = req.body;
    const resp = await newContacts({
      requestBody: {
        firstName,
        lastName,
        email,
        address,
        notes,
        birthday,
        phoneNumber,
      },
    });
    if (resp.error)
      return failed(res, resp.data, resp.message, resp.statusCode);
    return success(res, resp.data, resp.message, resp.statusCode);
  },
  findAll: async (req: Request, res: Response) => {
    const resp = await fetchAll({ ...req.query });
    if (resp.error)
      return failed(res, resp.data, resp.message, resp.statusCode);
    return success(res, resp.data, resp.message, resp.statusCode);
  },
  findAContact: async (req: Request, res: Response) => {
    const id = req.params.id;
    const resp = await fetchAContactService({ contactId: String(id) });
    if (resp.error)
      return failed(res, resp.data, resp.message, resp.statusCode);
    return success(res, resp.data, resp.message, resp.statusCode);
  },
  update: async (req: Request, res: Response) => {
    const id = req.params.id;
    const {
      firstName,
      lastName,
      email,
      address,
      birthday,
      notes,
      phoneNumber,
    } = req.body;
    if (isEmpty(req.body)) return failed(res, null, "No fields to update", 400);
    const resp = await updateAContact({
      contactId: id,
      update: {
        firstName,
        lastName,
        email,
        address,
        birthday,
        notes,
        phoneNumber,
      },
    });
    if (resp.error)
      return failed(res, resp.data, resp.message, resp.statusCode);
    return success(res, resp.data, resp.message, resp.statusCode);
  },
  deleteAction: async (req: Request, res: Response) => {
    const id = req.params.id;
    const resp = await deleteActionService({ contactId: String(id) });
    if (resp.error)
      return failed(res, resp.data, resp.message, resp.statusCode);
    return success(res, resp.data, resp.message, resp.statusCode);
  },
};
