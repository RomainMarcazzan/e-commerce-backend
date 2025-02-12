export const generateRandomResetCode = (length = 6) => {
  const charset = "0123456789";
  let resetCode = "";
  for (let i = 0; i < length; i++) {
    resetCode += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return resetCode;
};
