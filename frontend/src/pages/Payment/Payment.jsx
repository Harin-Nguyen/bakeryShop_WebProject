import React, { useState } from 'react';
import axios from 'axios';

const MakePayment = () => {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/bank/payments', {
        fromAccountId,
        toAccountId,
        amount: parseFloat(amount),
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error making payment:', error);
      alert('Error making payment.');
    }
  };

  return (
    <div>
      <h2>Make Payment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>From Account ID:</label>
          <input
            type="text"
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>To Account ID:</label>
          <input
            type="text"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Make Payment</button>
      </form>
    </div>
  );
};

export default MakePayment;