import React, { useState } from 'react';
import axios from 'axios';

const AddAccount = () => {
  const [accountId, setAccountId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/bank/accounts', {
        accountId,
        accountName,
        accountType,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error creating account.');
    }
  };

  return (
    <div>
      <h2>Add New Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Account ID:</label>
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Account Name:</label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Account Type:</label>
          <input
            type="text"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Account</button>
      </form>
    </div>
  );
};

export default AddAccount;