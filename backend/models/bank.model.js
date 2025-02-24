import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  accountId: { type: String, unique: true, required: true },
  accountName: { type: String, required: true },
  accountType: { type: String, required: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Account = mongoose.model("Account", accountSchema);

export default Account;