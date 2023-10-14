import config from "../../config";
import { ContactDocument, IContactEncrypted } from "../../models/contacts";
import ContactRepo from "../../repositories/contact";
import { decryptString } from "../../utils/encryptHelper";
import { isEmpty } from "../../utils/helpers";
import Utils from "../../utils/response";

const { internalResponse } = Utils;

export const fetchAll = async (filter: Record<string, any>) => {
  try {
    console.log({ filter });
    const contacts: ContactDocument[] = await ContactRepo.findAll(filter);

    const resp = await decryptContacts(contacts);
    if (resp.error)
      return internalResponse(true, resp.statusCode, resp.message, resp.data);

    return internalResponse(false, 200, "Success", resp.data);
  } catch (error: Error | unknown) {
    console.error({ error });
    return internalResponse(true, 422, String(error), null);
  }
};

export const fetchAContactService = async ({
  contactId,
}: {
  contactId: string;
}) => {
  try {
    if (isEmpty(contactId))
      return internalResponse(true, 400, "Supply contactId", null);

    const contact: ContactDocument | null = await ContactRepo.findOne({
      _id: contactId,
    });

    if (contact === null)
      return internalResponse(true, 404, "No such contact", null);

    const decrypted = await decryptAContact(contact);
    if (decrypted.error)
      return internalResponse(
        true,
        decrypted.statusCode,
        decrypted.message,
        decrypted.data
      );

    return internalResponse(false, 200, "Success", decrypted.data);
  } catch (error: Error | unknown) {
    console.error({ error });
    return internalResponse(true, 422, String(error), null);
  }
};

const decryptAContact = async (contact: IContactEncrypted) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      notes,
      birthday,
    } = contact;

    const authKey = `${config.INIT_VECTOR}_${contact.secretKey}`;

    const [
      _firstName,
      _lastName,
      _phoneNumber,
      _email,
      _address,
      _notes,
      _birthday,
    ] = await Promise.all([
      decryptString(String(firstName), authKey),
      decryptString(String(lastName), authKey),
      decryptString(String(phoneNumber), authKey),
      decryptString(String(email), authKey),
      decryptString(String(address), authKey),
      decryptString(String(notes), authKey),
      decryptString(String(birthday), authKey),
    ]);

    const data: IContactEncrypted = {
      _id: String(contact._id),
      firstName: _firstName,
      lastName: _lastName,
      phoneNumber: _phoneNumber,
      email: _email,
      address: _address,
      birthday: _birthday,
      notes: _notes,
    };

    return internalResponse(false, 202, "Success", data);
  } catch (error: Error | unknown) {
    console.error({ error });
    return internalResponse(true, 422, String(error), null);
  }
};

const decryptContacts = async (contacts: IContactEncrypted[]) => {
  try {
    const decrypted: IContactEncrypted[] = [];

    contacts.map(async (contact: IContactEncrypted) => {
      const {
        secretKey,
        firstName,
        lastName,
        email,
        address,
        birthday,
        notes,
        phoneNumber,
      } = contact;
      const initVector = String(config.INIT_VECTOR);

      const authKey = `${initVector}_${secretKey}`;

      const [
        decryptFirstName,
        decryptLastName,
        decryptEmail,
        decryptAddress,
        decryptBirthday,
        decryptNotes,
        decryptPhoneNumber,
      ] = await Promise.all([
        decryptString(String(firstName), authKey),
        decryptString(String(lastName), authKey),
        decryptString(String(email), authKey),
        decryptString(String(address), authKey),
        decryptString(String(birthday), authKey),
        decryptString(String(notes), authKey),
        decryptString(String(phoneNumber), authKey),
      ]);
      console.log({
        decryptFirstName,
        decryptLastName,
        decryptEmail,
        decryptAddress,
        decryptBirthday,
        decryptNotes,
        decryptPhoneNumber,
      });

      decrypted.unshift({
        _id: String(contact._id),
        firstName: decryptFirstName,
        lastName: decryptLastName,
        email: decryptEmail,
        address: decryptAddress,
        birthday: decryptBirthday,
        notes: decryptNotes,
        phoneNumber: decryptPhoneNumber,
      });
    });
    return internalResponse(false, 200, "success", decrypted);
  } catch (error: Error | unknown) {
    console.error({ error });
    return internalResponse(true, 422, String(error), null);
  }
};
