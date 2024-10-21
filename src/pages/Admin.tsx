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
  status: 'pendente' | 'confirmada' | 'recusada' | 'espera'; // Atualizando os status possíveis
}

const AdminPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/reservations/${id}/accept`, { status: 'confirmada' });
      alert('Reserva confirmada!');
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status: 'confirmada' } : reservation
        )
      );
    } catch (error) {
      console.error('Erro ao aceitar reserva:', error);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/reservations/${id}/decline`, { status: 'recusada' });
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
      await axios.put(`http://localhost:5000/reservations/${id}`, { status: 'espera' });
      alert('Reserva movida para a lista de espera!');
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status: 'espera' } : reservation
        )
      );
    } catch (error) {
      console.error('Erro ao mover reserva para lista de espera:', error);
    }
  };

  const handleConfirmFromWaitlist = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/reservations/${id}/accept`, { status: 'confirmada' });
      alert('Reserva confirmada da lista de espera!');
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? { ...reservation, status: 'confirmada' } : reservation
        )
      );
    } catch (error) {
      console.error('Erro ao confirmar reserva da lista de espera:', error);
    }
  };

  if (loading) {
    return <div>Carregando reservas...</div>; // Mensagem de carregamento
  }

  // Filtrando as reservas que colidem com outras
  const waitlistReservations = reservations.filter(reservation =>
    reservation.status === 'espera'
  );

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
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.name}</td>
              <td>{reservation.phone}</td>
              <td>{reservation.people_count}</td>
              <td>{reservation.reservation_date}</td>
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
                {reservation.status === 'confirmada' && (
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
              <td>{reservation.reservation_date}</td>
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
