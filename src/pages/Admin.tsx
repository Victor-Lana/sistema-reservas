import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface Reservation {
  id: number;
  name: string;
  phone: string;
  people_count: number;
  reservation_date: string;
  reservation_time: string;
  status: string;
}

const AdminPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null); // Limpa o erro ao iniciar a busca
      try {
        const response = await axios.get('http://localhost:5000/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        setError('Erro ao buscar reservas. Tente novamente mais tarde.'); // Mensagem de erro
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };


  const handleAccept = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/reservations/${id}/accept`);
      alert('Reserva confirmada!');
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status: 'reservada' } : reservation
        )
      );
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/reservations/${id}/decline`);
      alert('Reserva recusada!');
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status: 'recusada' } : reservation
        )
      );
    } catch (error) {
      console.error('Erro ao recusar reserva:', error);
    }
  };

  const handleMoveToWaitlist = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/reservations/${id}/waitlist`);
      alert('Reserva movida para a lista de espera!');
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status: 'lista de espera' } : reservation
        )
      );
    } catch (error) {
      console.error('Erro ao mover reserva para lista de espera:', error);
      alert('Erro ao mover reserva para a lista de espera, tente novamente.');
    }
  };

  const handleConfirmFromWaitlist = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/reservations/${id}/accept`);
      alert('Reserva confirmada da lista de espera!');
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status: 'reservada' } : reservation
        )
      );
    } catch (error) {
      console.error('Erro ao confirmar reserva da lista de espera:', error);
    }
  };

  if (loading) {
    return <div>Carregando reservas...</div>; // Mensagem de carregamento
  }

  // Filtrar reservas que não estão na lista de espera (para exibir em "Todas as Reservas")
  const activeReservations = reservations.filter(reservation => reservation.status !== 'lista de espera');
  
  // Filtrar reservas que estão na lista de espera
  const waitlistReservations = reservations.filter(reservation => reservation.status === 'lista de espera');

  return (
    <div>
      <h1>Painel de Administração</h1>
      
      {/* Tabela de Todas as Reservas */}
      <h2>Todas as Reservas</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Número de Pessoas</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {activeReservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.name}</td>
              <td>{reservation.phone}</td>
              <td>{reservation.people_count}</td>
              <td>{formatDate(reservation.reservation_date)}</td>
              <td>{reservation.reservation_time}</td>
              <td>{reservation.status}</td>
              <td>
                {reservation.status === 'pendente' && (
                  <>
                    <FaCheck
                      onClick={() => handleAccept(reservation.id)}
                      style={{ cursor: 'pointer', color: 'green', marginRight: '10px' }}
                      title="Confirmar"
                    />
                    <FaTimes
                      onClick={() => handleDecline(reservation.id)}
                      style={{ cursor: 'pointer', color: 'red' }}
                      title="Recusar"
                    />
                  </>
                )}
                {reservation.status === 'reservada' && (
                  <FaArrowDown
                    onClick={() => handleMoveToWaitlist(reservation.id)}
                    style={{ cursor: 'pointer', color: 'orange' }}
                    title="Mover para Lista de Espera"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabela de Reservas na Lista de Espera */}
      <h2>Lista de Espera</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Número de Pessoas</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {waitlistReservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.name}</td>
              <td>{reservation.phone}</td>
              <td>{reservation.people_count}</td>
              <td>{formatDate(reservation.reservation_date)}</td>
              <td>{reservation.reservation_time}</td>
              <td>
                <FaArrowUp
                  onClick={() => handleConfirmFromWaitlist(reservation.id)}
                  style={{ cursor: 'pointer', color: 'blue' }}
                  title="Confirmar da Lista de Espera"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;