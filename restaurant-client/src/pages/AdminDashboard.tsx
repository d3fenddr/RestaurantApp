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

  // Состояния для хранения списков
  const [users, setUsers] = useState<IUser[]>([]);
  const [dishes, setDishes] = useState<IDish[]>([]);

  // Состояния для редактирования
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [editDish, setEditDish] = useState<IDish | null>(null);

  // При переключении вкладки (users/dishes) получаем соответствующие данные
  useEffect(() => {
    if (view === 'users') {
      fetch('/api/admin/users')
        .then(res => res.json())
        .then((data: IUser[]) => setUsers(data))
        .catch(err => console.error('Error fetching users:', err));
    } else {
      fetch('/api/admin/dishes')
        .then(res => res.json())
        .then((data: IDish[]) => setDishes(data))
        .catch(err => console.error('Error fetching dishes:', err));
    }
  }, [view]);

  // ========== УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ ==========
  const handleDeleteUser = async (id: number) => {
    try {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      // Удаляем пользователя из локального массива
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // ========== УДАЛЕНИЕ БЛЮДА ==========
  const handleDeleteDish = async (id: number) => {
    try {
      await fetch(`/api/admin/dishes/${id}`, { method: 'DELETE' });
      // Удаляем блюдо из локального массива
      setDishes(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting dish:', err);
    }
  };

  // ========== РЕДАКТИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ ==========
  const handleEditUser = (user: IUser) => {
    // Создаём копию пользователя для редактирования
    setEditUser({ ...user });
  };

  // Сохранение изменений пользователя
  const handleUserUpdate = async () => {
    if (!editUser) return;
    try {
      await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser),
      });

      // Обновляем локально
      setUsers(prev => prev.map(u => (u.id === editUser.id ? editUser : u)));
      setEditUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  // ========== РЕДАКТИРОВАНИЕ БЛЮДА ==========
  const handleEditDish = (dish: IDish) => {
    // Создаём копию блюда для редактирования
    setEditDish({ ...dish });
  };

  // Сохранение изменений блюда
  const handleDishUpdate = async () => {
    if (!editDish) return;
    try {
      await fetch(`/api/admin/dishes/${editDish.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDish),
      });

      // Обновляем локально
      setDishes(prev => prev.map(d => (d.id === editDish.id ? editDish : d)));
      setEditDish(null);
    } catch (err) {
      console.error('Error updating dish:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      {/* Кнопки переключения вкладок */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setView('users')}>Users</button>
        <button onClick={() => setView('dishes')} style={{ marginLeft: '1rem' }}>
          Dishes
        </button>
      </div>

      {/* ===== Вкладка: Пользователи ===== */}
      {view === 'users' && (
        <div>
          <h2>List of Users</h2>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Full Name</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Role</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.fullName}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.email}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.role}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <button onClick={() => handleEditUser(u)}>Edit</button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ marginLeft: '1rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Форма редактирования пользователя */}
          {editUser && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Edit User</h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Full Name: </label>
                <input
                  type="text"
                  value={editUser.fullName}
                  onChange={e => setEditUser({ ...editUser, fullName: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Email: </label>
                <input
                  type="text"
                  value={editUser.email}
                  onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Role: </label>
                <input
                  type="text"
                  value={editUser.role}
                  onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                />
              </div>
              <button onClick={handleUserUpdate}>Save</button>
              <button onClick={() => setEditUser(null)} style={{ marginLeft: '1rem' }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== Вкладка: Блюда ===== */}
      {view === 'dishes' && (
        <div>
          <h2>List of Dishes</h2>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map(d => (
                <tr key={d.id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.name}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.price}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <button onClick={() => handleEditDish(d)}>Edit</button>
                    <button
                      onClick={() => handleDeleteDish(d.id)}
                      style={{ marginLeft: '1rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Форма редактирования блюда */}
          {editDish && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Edit Dish</h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Name: </label>
                <input
                  type="text"
                  value={editDish.name}
                  onChange={e => setEditDish({ ...editDish, name: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Price: </label>
                <input
                  type="number"
                  value={editDish.price}
                  onChange={e =>
                    setEditDish({ ...editDish, price: Number(e.target.value) })
                  }
                />
              </div>
              <button onClick={handleDishUpdate}>Save</button>
              <button onClick={() => setEditDish(null)} style={{ marginLeft: '1rem' }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
