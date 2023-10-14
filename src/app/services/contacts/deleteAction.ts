import { ContactDocument } from "../../models/contacts";
import ContactRepo from "../../repositories/contact";
import Utils from "../../utils/response";

const { internalResponse } = Utils;

export const deleteActionService = async ({
  contactId,
}: {
  contactId: string;
}) => {
  try {
    if (!contactId)
      return internalResponse(true, 400, "Supply the contactId", null);

    const contact: ContactDocument | null = await ContactRepo.findOne({
      _id: contactId,
    });

    if (contact === null)
      return internalResponse(true, 404, "No such contact", null);

    await ContactRepo.deleteOne({ _id: contactId });

    return internalResponse(false, 200, "Success", {});
  } catch (error: Error | unknown) {
    console.error({ error });
    return internalResponse(true, 422, String(error), null);
  }
};
