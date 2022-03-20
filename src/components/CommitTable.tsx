import React from 'react';
import { Table } from 'react-bootstrap';
import { LFFEntry } from './ResponseDataHandler';

interface Props{
  entries: LFFEntry[];
}

const CommitTable: React.FC<Props> = ({entries}) => {
  return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Disturbances</th>
            <th>Time</th>
            <th>Activity</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, k) => {
            return (
              <tr key={k}>
                <td>{entry.date}</td>
                <td>{entry.from}</td>
                <td>{entry.to}</td>
                <td>
                {entry.disturbances?.join(', ')}
                </td>
                <td>{entry.time}</td>
                <td>{entry.activity}</td>
                <td>{entry.comments}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
  );
};

export default CommitTable;