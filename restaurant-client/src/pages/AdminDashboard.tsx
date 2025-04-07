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
  description: string;
  imageUrl: string;
  dishCategoryId: number;
}

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<'users' | 'dishes'>('users');
  const [users, setUsers] = useState<IUser[]>([]);
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [error, setError] = useState<string>('');

  // Состояния для редактирования
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [editDish, setEditDish] = useState<IDish | null>(null);

  // Состояния для добавления нового элемента
  const [newUser, setNewUser] = useState({ fullName: '', email: '', role: '', password: '' });
  const [newDish, setNewDish] = useState({ name: '', price: 0, description: '', imageUrl: '', dishCategoryId: 0 });

  const getToken = () => localStorage.getItem('token') || '';

  // Функция для получения данных при переключении вкладок
  useEffect(() => {
    setError('');
    const token = getToken();

    if (view === 'users') {
      fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          return res.json();
        })
        .then((data: IUser[]) => setUsers(data))
        .catch(err => {
          console.error('Error fetching users:', err);
          setError(err.message);
        });
    } else if (view === 'dishes') {
      fetch('/api/admin/dishes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          return res.json();
        })
        .then((data: IDish[]) => setDishes(data))
        .catch(err => {
          console.error('Error fetching dishes:', err);
          setError(err.message);
        });
    }
  }, [view]);

  // ===== Пользователи =====

  // Удаление пользователя
  const handleDeleteUser = async (id: number) => {
    const token = getToken();
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Редактирование пользователя (сохранение изменений)
  const handleUserUpdate = async () => {
    if (!editUser) return;
    const token = getToken();
    try {
      await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editUser)
      });
      setUsers(prev => prev.map(u => (u.id === editUser.id ? editUser : u)));
      setEditUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  // Добавление нового пользователя
  const handleAddUser = async () => {
    const token = getToken();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const addedUser = await res.json();
      setUsers(prev => [...prev, addedUser]);
      setNewUser({ fullName: '', email: '', role: '', password: '' });
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  // ===== Блюда =====

  // Удаление блюда
  const handleDeleteDish = async (id: number) => {
    const token = getToken();
    try {
      await fetch(`/api/admin/dishes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDishes(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting dish:', err);
    }
  };

  // Редактирование блюда (сохранение изменений)
  const handleDishUpdate = async () => {
    if (!editDish) return;
    const token = getToken();
    try {
      await fetch(`/api/admin/dishes/${editDish.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editDish)
      });
      setDishes(prev => prev.map(d => (d.id === editDish.id ? editDish : d)));
      setEditDish(null);
    } catch (err) {
      console.error('Error updating dish:', err);
    }
  };

  // Добавление нового блюда
  const handleAddDish = async () => {
    const token = getToken();
    try {
      const res = await fetch('/api/admin/dishes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDish)
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const addedDish = await res.json();
      setDishes(prev => [...prev, addedDish]);
      setNewDish({ name: '', price: 0, description: '', imageUrl: '', dishCategoryId: 0 });
    } catch (err) {
      console.error('Error adding dish:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setView('users')}>Users</button>
        <button onClick={() => setView('dishes')} style={{ marginLeft: '1rem' }}>Dishes</button>
      </div>

      {view === 'users' && (
        <div>
          <h2>List of Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
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
                      <button onClick={() => setEditUser(u)}>Edit</button>
                      <button onClick={() => handleDeleteUser(u.id)} style={{ marginLeft: '1rem' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Форма редактирования пользователя */}
          {editUser && (
            <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
              <h3>Edit User</h3>
              <div>
                <label>Full Name:</label>
                <input type="text" value={editUser.fullName} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} />
              </div>
              <div>
                <label>Email:</label>
                <input type="text" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
              </div>
              <div>
                <label>Role:</label>
                <input type="text" value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })} />
              </div>
              <button onClick={handleUserUpdate}>Save</button>
              <button onClick={() => setEditUser(null)} style={{ marginLeft: '1rem' }}>Cancel</button>
            </div>
          )}

          {/* Форма добавления нового пользователя */}
          <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
            <h3>Add New User</h3>
            <div>
              <label>Full Name:</label>
              <input type="text" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} />
            </div>
            <div>
              <label>Email:</label>
              <input type="text" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
            </div>
            <div>
              <label>Role:</label>
              <input type="text" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
            </div>
            <button onClick={handleAddUser}>Add User</button>
          </div>
        </div>
      )}

      {view === 'dishes' && (
        <div>
          <h2>List of Dishes</h2>
          {dishes.length === 0 ? (
            <p>No dishes found.</p>
          ) : (
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
                      <button onClick={() => setEditDish(d)}>Edit</button>
                      <button onClick={() => handleDeleteDish(d.id)} style={{ marginLeft: '1rem' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Форма редактирования блюда */}
          {editDish && (
            <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
              <h3>Edit Dish</h3>
              <div>
                <label>Name:</label>
                <input type="text" value={editDish.name} onChange={e => setEditDish({ ...editDish, name: e.target.value })} />
              </div>
              <div>
                <label>Price:</label>
                <input type="number" value={editDish.price} onChange={e => setEditDish({ ...editDish, price: Number(e.target.value) })} />
              </div>
              <div>
                <label>Description:</label>
                <input type="text" value={editDish.description} onChange={e => setEditDish({ ...editDish, description: e.target.value })} />
              </div>
              <div>
                <label>Image URL:</label>
                <input type="text" value={editDish.imageUrl} onChange={e => setEditDish({ ...editDish, imageUrl: e.target.value })} />
              </div>
              <div>
                <label>Dish Category Id:</label>
                <input type="number" value={editDish.dishCategoryId} onChange={e => setEditDish({ ...editDish, dishCategoryId: Number(e.target.value) })} />
              </div>
              <button onClick={handleDishUpdate}>Save</button>
              <button onClick={() => setEditDish(null)} style={{ marginLeft: '1rem' }}>Cancel</button>
            </div>
          )}

          {/* Форма добавления нового блюда */}
          <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
            <h3>Add New Dish</h3>
            <div>
              <label>Name:</label>
              <input type="text" value={newDish.name} onChange={e => setNewDish({ ...newDish, name: e.target.value })} />
            </div>
            <div>
              <label>Price:</label>
              <input type="number" value={newDish.price} onChange={e => setNewDish({ ...newDish, price: Number(e.target.value) })} />
            </div>
            <div>
              <label>Description:</label>
              <input type="text" value={newDish.description} onChange={e => setNewDish({ ...newDish, description: e.target.value })} />
            </div>
            <div>
              <label>Image URL:</label>
              <input type="text" value={newDish.imageUrl} onChange={e => setNewDish({ ...newDish, imageUrl: e.target.value })} />
            </div>
            <div>
              <label>Dish Category Id:</label>
              <input type="number" value={newDish.dishCategoryId} onChange={e => setNewDish({ ...newDish, dishCategoryId: Number(e.target.value) })} />
            </div>
            <button onClick={handleAddDish}>Add Dish</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
