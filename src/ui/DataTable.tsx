import {type ReactNode} from 'react';
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  type TableProps,
} from 'react-aria-components';

export interface DataColumn<T> {
  id: string;
  label: string;
  render: (row: T) => ReactNode;
  isRowHeader?: boolean;
  allowsSorting?: boolean;
}

export interface DataRow {
  id: string;
}

export interface DataTableProps<T extends DataRow> extends Omit<TableProps, 'children' | 'className'> {
  columns: DataColumn<T>[];
  rows: T[];
  emptyLabel?: string;
}

export function DataTable<T extends DataRow>({columns, rows, emptyLabel = '暂无结果', ...props}: DataTableProps<T>) {
  return (
    <div className="nacre-table-shell">
      <Table {...props} className="nacre-table">
        <TableHeader columns={columns}>
          {(column) => (
            <Column id={column.id} isRowHeader={column.isRowHeader} allowsSorting={column.allowsSorting}>
              {({sortDirection}) => <>{column.label}{sortDirection && <span aria-hidden="true">{sortDirection === 'ascending' ? '↑' : '↓'}</span>}</>}
            </Column>
          )}
        </TableHeader>
        <TableBody items={rows} renderEmptyState={() => <span className="nacre-table__empty">{emptyLabel}</span>}>
          {(row) => (
            <Row id={row.id} columns={columns}>
              {(column) => <Cell>{column.render(row)}</Cell>}
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
