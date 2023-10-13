import { Document, Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export type IContactType = "home" | "work" | "mobile";

export interface IContactTypeValue {
  type: IContactType;
  value: string;
}

export interface IContactAddressType {
  type: "home" | "work";
  value: string;
}

export interface IContact {
  firstName: string;
  lastName: string;
  phoneNumber: IContactTypeValue[];
  email: IContactTypeValue[];
  notes: string;
  birthday: string;
  address: IContactAddressType[];
  company: string;
  jobTitle: string;
}

interface ContactDocument extends IContact, Document {
  createdAt?: Date;
  updatedAt?: Date;
}

const schema: Schema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: [
      {
        type: {
          type: String,
          required: true,
          enum: ["home", "work", "mobile"],
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    email: [
      {
        type: {
          type: String,
          required: true,
          enum: ["home", "work", "mobile"],
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    notes: {
      type: String,
    },
    birthday: {
      type: String,
    },
    address: [
      {
        type: {
          type: String,
          enum: ["home", "work"],
        },
        value: {
          type: String,
        },
      },
    ],
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
