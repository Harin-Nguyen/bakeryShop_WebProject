import React from 'react';
import './table.css';

export const Table = ({ children }) => (
  <table className="table">
    {children}
  </table>
);

export const TableHeader = ({ children }) => (
  <thead className="table-header">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="table-body">
    {children}
  </tbody>
);

export const TableRow = ({ children }) => (
  <tr className="table-row">
    {children}
  </tr>
);

export const TableCell = ({ children, className }) => (
  <td className={`table-cell ${className}`}>
    {children}
  </td>
);