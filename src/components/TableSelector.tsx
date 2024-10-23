import React from 'react';

interface Table {
  id: number;
  table_number: number;
  capacity: number;
  position_x: number;
  position_y: number;
  status: string;
}

interface TableSelectorProps {
  tables: Table[];
  selectedTableId: number | null;
  onTableSelect: (id: number) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ tables, selectedTableId, onTableSelect }) => {
  const handleTableClick = (id: number, status: string) => {
    if (status === 'disponível') {
      onTableSelect(id);
    }
  };

  return (
    <div className="restaurant-layout">
      <div className="tables">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table ${table.status === 'disponível' ? '' : 'reserved'} ${selectedTableId === table.id ? 'selected' : ''}`}
            style={{
              left: `${table.position_x}px`,
              top: `${table.position_y}px`,
            }}
            onClick={() => handleTableClick(table.id, table.status)}
          >
            <img src="/measas.png" alt={`Mesa ${table.table_number}`} />
            <div className="table-text">
              <p>Mesa {table.table_number} ({table.capacity} pessoas)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSelector;
