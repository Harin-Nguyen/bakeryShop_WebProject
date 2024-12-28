import Account from "../models/bank.model";

const initializeSystem = async () => {
  const defaultAccount = new Account({
    accountId: "default123",
    accountName: "Default Payment Account",
    accountType: "bank",
    balance: 0,
  });

  try {
    const exists = await Account.findOne({
      accountId: defaultAccount.accountId,
    });
    if (!exists) {
      await defaultAccount.save();
      console.log("Default account initialized.");
    } else {
      console.log("Default account already exists.");
    }
  } catch (err) {
    console.error("Error initializing system:", err);
  }
};

export default initializeSystem;