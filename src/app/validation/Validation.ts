import { isEmpty as _isEmpty } from "../utils/helpers";

interface CreateContactField {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  birthday?: string;
  notes?: string;
  phoneNumber?: string;
}

const Validation = {
  isEmpty: (value: unknown) => {
    return _isEmpty(value);
  },

  isValidEmail: (email: string) => {
    //const re = /^\S+@\S+[\.][0-9a-z]+$/;
    const re = /^\S+@\S+[.][0-9a-z]+$/;
    return re.test(email);
  },
  isValidTxPin: (pin: string) => {
    // we only process strings!
    if (typeof pin != "string") return false;
    return !isNaN(Number(pin)) && !isNaN(parseFloat(pin)) && pin.length === 6;
  },
  isValidName: (name: string) => {
    // const re = /^[A-Za-z]+$/;
    const re = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
    return name.length >= 2 && re.test(name) && name.length <= 30;
  },
  isUserName: (name: string) => {
    const re = /^[a-z0-9]+$/;
    return name.length >= 2 && re.test(name);
  },
  isValidphone: (phone: string) => {
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return re.test(String(phone));
  },
  createContactField: (data: CreateContactField) => {
    const errors: CreateContactField = {};
    const {
      firstName,
      lastName,
      address,
      email,
      birthday,
      notes,
      phoneNumber,
    } = data;
    if (!firstName) errors.firstName = "firstName is required";
    if (!lastName) errors.lastName = "lastName is required";
    if (!address) errors.address = "address is required";
    if (!email) errors.email = "email is required";
    if (email && !Validation.isValidEmail(email))
      errors.email = "email must be valid";
    if (!birthday) errors.birthday = "birthday is required";
    if (!phoneNumber) errors.phoneNumber = "phoneNumber is required";
    if (phoneNumber && phoneNumber?.length < 10)
      errors.phoneNumber = "phoneNumber must be proper";
    return {
      errors,
      isValid: Validation.isEmpty(errors),
    };
  },
};

export default Validation;
