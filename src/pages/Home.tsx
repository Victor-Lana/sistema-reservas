import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Home: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [tables, setTables] = useState<any[]>([]); // Estado para armazenar as mesas
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null); // ID da mesa selecionada

  // Função para buscar mesas disponíveis
  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tables'); // Endpoint para buscar mesas
      const availableTables = response.data.filter((table: any) => table.status === 'disponível');
      setTables(availableTables);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      alert('Erro ao carregar mesas, tente novamente.');
    }
  };

  useEffect(() => {
    fetchTables(); // Chama a função ao montar o componente
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reservation = {
      name,
      phone,
      people_count: Number(peopleCount),
      reservation_date: date,
      reservation_time: time,
      table_id: selectedTableId, // Inclui o ID da mesa na reserva
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
      setSelectedTableId(null); // Limpar a mesa selecionada
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      alert('Erro ao criar reserva, tente novamente.');
    }
  };

  return (
    <div>
      <h1>Faça sua Reserva</h1>
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
        <label>
          Selecione uma Mesa:
          <select 
            value={selectedTableId || ''} 
            onChange={(e) => setSelectedTableId(Number(e.target.value))}
            required
          >
            <option value="" disabled>Escolha uma mesa</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                Mesa {table.table_number} (Capacidade: {table.capacity})
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Reservar</button>
      </form>
    </div>
  );
};

export default Home;
