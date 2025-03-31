import CryptoJS from "crypto-js";
import { loginValidation, registerValidation } from "./validationSchema.js";

const decryptValue = (value) => {
  return CryptoJS.AES.decrypt(value, process.env.DECRYPT_KEY).toString(
    CryptoJS.enc.Utf8
  );
};

export const inputValidation = ({
  userName,
  email,
  password,
  confirmPassword,
  profileImage,
}) => {
  // console.log(userName, "user");

  const decryptEmail = decryptValue(email);
  const decryptPassword = decryptValue(password);
  const decryptConfirmPassword = confirmPassword
    ? decryptValue(confirmPassword)
    : null;

  let validationData;
  if (userName && confirmPassword) {
    validationData = {
      userName: userName,
      email: decryptEmail,
      password: decryptPassword,
      confirmPassword: decryptConfirmPassword,
      profileImage: profileImage,
    };
  } else {
    validationData = {
      email: decryptEmail,
      password: decryptPassword,
    };
  }

  const validatedData =
    userName && confirmPassword
      ? registerValidation(validationData)
      : loginValidation(validationData);
  return validatedData;
};
