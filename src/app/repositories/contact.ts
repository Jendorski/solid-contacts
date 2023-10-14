import contacts, { IContactEncrypted } from "../models/contacts";

const ContactRepo = {
  findAll: async (filter: Record<string, any>) => {
    return await contacts
      .find({ ...filter })
      .sort({ createdAt: -1 })
      .lean();
  },
  findOne: async (filter: IContactEncrypted) => {
    return await contacts.findOne({ ...filter }).lean();
  },
  create: async (data: IContactEncrypted) => {
    return await contacts.create(data);
  },
  update: async (filter: IContactEncrypted, updateData: IContactEncrypted) => {
    return await contacts.updateOne(
      { ...filter },
      {
        ...updateData,
      }
    );
  },
  deleteOne: async (filter: IContactEncrypted) => {
    return await contacts.deleteOne({ ...filter });
  },
};

export default ContactRepo;
