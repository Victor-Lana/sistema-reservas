import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import TableSelector from '../components/TableSelector';

const Home: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const tables = [
    { id: 1, table_number: 1, capacity: 4, position_x: 200, position_y: 550, status: 'disponível' },
    { id: 2, table_number: 2, capacity: 4, position_x: 450, position_y: 550, status: 'disponível' },
    { id: 3, table_number: 3, capacity: 6, position_x: 600, position_y: 550, status: 'disponível' },
    { id: 4, table_number: 4, capacity: 2, position_x: 200, position_y: 700, status: 'disponível' },
    { id: 5, table_number: 5, capacity: 2, position_x: 450, position_y: 700, status: 'reservada' },
    { id: 6, table_number: 6, capacity: 6, position_x: 600, position_y: 700, status: 'disponível' },
    { id: 7, table_number: 7, capacity: 8, position_x: 850, position_y: 700, status: 'disponível' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTableId === null) {
      setError('Por favor, selecione uma mesa antes de fazer a reserva.');
      return;
    }

    const reservation = {
      name,
      phone,
      people_count: Number(peopleCount),
      reservation_date: date,
      reservation_time: time,
      table_id: selectedTableId,
    };

    try {
      await axios.post('http://localhost:5000/reservations', reservation);
      alert('Reserva criada com sucesso!');
      setName('');
      setPhone('');
      setPeopleCount('');
      setDate('');
      setTime('');
      setSelectedTableId(null);

    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      setError('Erro ao criar reserva, tente novamente.');
    }
  };

  return (
    <div>
      <h1>Faça sua Reserva</h1>
      {loading && <p>Carregando mesas disponíveis...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Telefone:
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Número de Pessoas:
          <input
            type="number"
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            min="1"
            required
          />
        </label>
        <br />
        <label>
          Data:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Horário:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Reservar</button>
      </form>

      {/* Utilize o componente TableSelector */}
      <TableSelector
        tables={tables}
        selectedTableId={selectedTableId}
        onTableSelect={setSelectedTableId}
      />
    </div>
  );
};

export default Home;
