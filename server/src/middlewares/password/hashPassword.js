/* global process  */
import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
  return await bcrypt.hash(password, saltRounds);
};

export default hashPassword;