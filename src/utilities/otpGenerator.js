const otpGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a random number between 100000 and 999999
};

export default otpGenerator;
