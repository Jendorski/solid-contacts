import { Document, Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface IEncryptor {
  secretKey: string;
  contact: string;
}

interface EncryptorDocument extends IEncryptor, Document {}

const schema: Schema = new Schema(
  {
    secretKey: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

schema.plugin(uniqueValidator);

export default model<EncryptorDocument>("Encryptor", schema);
