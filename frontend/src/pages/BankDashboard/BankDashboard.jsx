import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/component/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/component/ui/table";

const BankDashboard = () => {
  const [transactions, setTransactions] = useState({ received: [], sent: [] });

  useEffect(() => {
    axios.get('/api/bank/reconcile')
      .then(response => {
        const data = response.data;
        setTransactions({
          sent: Array.isArray(data.sentTransactions) ? data.sentTransactions : [],
          received: Array.isArray(data.receivedTransactions) ? data.receivedTransactions : [],
        });
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        setTransactions({ received: [], sent: [] });
      });
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Bank Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <h3>Sent Transactions</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Account ID</TableCell>
                  <TableCell className="text-right">Total Sent</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.sent.map((tx) => (
                  <TableRow key={tx._id}>
                    <TableCell>{tx._id}</TableCell>
                    <TableCell className="text-right">${tx.totalSent.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3>Received Transactions</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Account ID</TableCell>
                  <TableCell className="text-right">Total Received</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.received.map((tx) => (
                  <TableRow key={tx._id}>
                    <TableCell>{tx._id}</TableCell>
                    <TableCell className="text-right">${tx.totalReceived.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankDashboard;