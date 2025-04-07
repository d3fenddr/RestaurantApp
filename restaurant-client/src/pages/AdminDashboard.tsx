// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';

interface IUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface IDish {
  id: number;
  name: string;
  price: number;
}

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<'users' | 'dishes'>('users');
  const [users, setUsers] = useState<IUser[]>([]);
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [error, setError] = useState<string>('');

  // Функция для получения токена из localStorage
  const getToken = () => localStorage.getItem('token') || '';

  useEffect(() => {
    setError('');
    const token = getToken();

    if (view === 'users') {
      fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          return res.json();
        })
        .then((data: IUser[]) => setUsers(data))
        .catch(err => {
          console.error('Error fetching users:', err);
          setError(err.message);
        });
    } else if (view === 'dishes') {
      fetch('/api/admin/dishes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          return res.json();
        })
        .then((data: IDish[]) => setDishes(data))
        .catch(err => {
          console.error('Error fetching dishes:', err);
          setError(err.message);
        });
    }
  }, [view]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setView('users')}>Users</button>
        <button onClick={() => setView('dishes')} style={{ marginLeft: '1rem' }}>
          Dishes
        </button>
      </div>

      {view === 'users' && (
        <div>
          <h2>List of Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul>
              {users.map(u => (
                <li key={u.id}>
                  {u.fullName} ({u.email}) — {u.role}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {view === 'dishes' && (
        <div>
          <h2>List of Dishes</h2>
          {dishes.length === 0 ? (
            <p>No dishes found.</p>
          ) : (
            <ul>
              {dishes.map(d => (
                <li key={d.id}>
                  {d.name} — {d.price}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
