import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.min.css';

export default ({ rows, fields, tableWidth, tableHeight }) =>
  rows && rows.length ? (
    <Table
      rowHeight={50}
      headerHeight={50}
      rowsCount={rows.length}
      width={tableWidth}
      height={tableHeight}
    >
      {fields.map(function (columnName) {
        return (
          <Column
            columnKey={columnName}
            header={<Cell>{columnName}</Cell>}
            cell={({ rowIndex, columnKey, ...props }) => (
              <Cell {...props}>{rows[rowIndex][columnKey]}</Cell>
            )}
            width={200}
          />
        );
      })}
    </Table>
  ) : (
    <strong>No data to be displayed</strong>
  );
