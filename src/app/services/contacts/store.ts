import crypto from "crypto";
import config from "../../config";
import {
  ContactDocument,
  IContactEncrypted,
  IContactRequestBody,
} from "../../models/contacts";
import ContactRepo from "../../repositories/contact";
import { encryptString } from "../../utils/encryptHelper";
import { isEmpty } from "../../utils/helpers";
import Utils from "../../utils/response";

const { internalResponse } = Utils;

export const newContacts = async ({
  requestBody,
}: {
  requestBody: IContactRequestBody;
}) => {
  try {
    const secretKey = crypto.randomBytes(32).toString("hex");
    const encrypted = await encryptInfo({ requestBody, secretKey });

    const contact: IContactEncrypted = {
      secretKey,
      firstName: encrypted.firstName,
      lastName: encrypted.lastName,
      email: encrypted.email,
      address: encrypted.address,
      phoneNumber: encrypted.phoneNumber,
      notes: encrypted.notes,
      birthday: encrypted.birthday,
    };

    await ContactRepo.create(contact);

    return internalResponse(false, 202, "Success", {});
  } catch (error: Error | unknown) {
    console.error({ error });
    return internalResponse(true, 422, String(error), null);
  }
};

export const updateAContact = async ({
  contactId,
  update,
}: {
  contactId: string;
  update: IContactRequestBody;
}) => {
  try {
    if (isEmpty(contactId))
      return internalResponse(true, 400, "Supply contactId", null);

    const {
      firstName,
      lastName,
      email,
      address,
      birthday,
      phoneNumber,
      notes,
    } = update;

    const newUpdate: IContactRequestBody = {};

    if (!isEmpty(firstName)) {
      newUpdate.firstName = firstName;
    }

    if (!isEmpty(lastName)) {
      newUpdate.lastName = lastName;
    }

    if (!isEmpty(email)) {
      newUpdate.email = email;
    }

    if (!isEmpty(address)) {
      newUpdate.address = address;
    }

    if (!isEmpty(birthday)) {
      newUpdate.birthday = birthday;
    }

    if (!isEmpty(phoneNumber)) {
      newUpdate.phoneNumber = phoneNumber;
    }

    if (!isEmpty(notes)) {
      newUpdate.notes = notes;
    }

    const contact: ContactDocument | null = await ContactRepo.findOne({
      _id: contactId,
    });

    if (contact === null)
      return internalResponse(true, 404, "No such contact", null);

    const encrypted = await encryptInfo({
      requestBody: newUpdate,
      secretKey: String(contact.secretKey),
    });

    const updatedContact: IContactEncrypted = {
      firstName: encrypted.firstName,
      lastName: encrypted.lastName,
      email: encrypted.email,
      address: encrypted.address,
      phoneNumber: encrypted.phoneNumber,
      notes: encrypted.notes,
      birthday: encrypted.birthday,
    };

    await ContactRepo.update({ _id: contactId }, updatedContact);

    return internalResponse(false, 204, "Updated successfully", {});
  } catch (error: Error | unknown) {
    console.error({ error });
    return internalResponse(true, 422, String(error), null);
  }
};

const encryptInfo = async ({
  requestBody,
  secretKey,
}: {
  requestBody: IContactRequestBody;
  secretKey: string;
}) => {
  const data: Record<string, any> = {};

  Object.values(requestBody).map(async (value: string, index: number) => {
    const key = Object.keys(requestBody)[index] as keyof typeof requestBody;

    const initVector = String(config.INIT_VECTOR);

    const authKey = `${initVector}_${secretKey}`;
    console.log({ authKey });

    if (!isEmpty(value)) {
      const theValue = await encryptString(value, authKey);
      console.log({ theValue });

      data[key] = theValue;
    }
  });

  console.log({ data });

  return data;
};
