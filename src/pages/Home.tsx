import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Home: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/seats');
      setTables(response.data); // Carregar todas as mesas
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      setError('Erro ao carregar mesas, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // Limpar o formulário
      setName('');
      setPhone('');
      setPeopleCount('');
      setDate('');
      setTime('');
      setSelectedTableId(null);

      // Recarregar mesas após uma nova reserva
      fetchTables();
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      setError('Erro ao criar reserva, tente novamente.');
    }
  };

  const handleTableClick = (id: number, status: string) => {
    if (status === 'disponível') {
      setSelectedTableId(id);
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

      <div className="restaurant-layout">
        {/* Simulação da entrada e balcão */}
        <div className="entrance">Entrada</div>
        <div className="counter">Balcão</div>

        {/* Renderização dinâmica das mesas */}
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
              Mesa {table.table_number} ({table.capacity} pessoas)
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
