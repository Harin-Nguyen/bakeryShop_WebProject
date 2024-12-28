import Account from "../models/bank.model";

app.post("/accounts", async (req, res) => {
  const { accountId, accountName, accountType } = req.body;

  try {
    const newAccount = new Account({ accountId, accountName, accountType });
    await newAccount.save();
    res
      .status(201)
      .json({ message: "Account created successfully.", account: newAccount });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating account.", error: err.message });
  }
});

app.post("/payments", async (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  try {
    const fromAccount = await Account.findOne({ accountId: fromAccountId });
    const toAccount = await Account.findOne({ accountId: toAccountId });

    if (!fromAccount || !toAccount) throw new Error("Invalid account IDs.");
    if (fromAccount.balance < amount) throw new Error("Insufficient balance.");

    fromAccount.balance -= amount;
    toAccount.balance += amount;
    await fromAccount.save();
    await toAccount.save();

    const transaction = new Transaction({
      transactionId: `txn-${Date.now()}`,
      fromAccountId,
      toAccountId,
      amount,
      status: "completed",
    });
    await transaction.save();

    res.status(200).json({ message: "Payment successful.", transaction });
  } catch (err) {
    res.status(400).json({ message: "Payment failed.", error: err.message });
  }
});

app.get("/reconcile", async (req, res) => {
  try {
    const sentTransactions = await Transaction.aggregate([
      { $group: { _id: "$fromAccountId", totalSent: { $sum: "$amount" } } },
    ]);

    const receivedTransactions = await Transaction.aggregate([
      { $group: { _id: "$toAccountId", totalReceived: { $sum: "$amount" } } },
    ]);

    res.status(200).json({ sentTransactions, receivedTransactions });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Reconciliation failed.", error: err.message });
  }
});
