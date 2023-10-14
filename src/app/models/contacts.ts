import { Document, Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface IContactRequestBody {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  birthday?: string;
  address?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
}

export interface IContactEncrypted {
  _id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  birthday?: string;
  address?: string;
  secretKey?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
}

export interface IContact {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  birthday: string;
  address: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
}

export interface ContactDocument extends IContactEncrypted, Document {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema: Schema = new Schema(
  {
    secretKey: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    notes: {
      type: String,
    },
    birthday: {
      type: String,
    },
    address: { type: String },
    company: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
  },
  { timestamps: true }
);

schema.plugin(uniqueValidator);

export default model<ContactDocument>("Contact", schema);
