import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, updateUser, addUser, IUser, getDishes, deleteDish, updateDish, addDish, IDish } from '../services/adminService';

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<'users' | 'dishes'>('users');
  const [users, setUsers] = useState<IUser[]>([]);
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [error, setError] = useState<string>('');

  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', role: 'User', password: '' });
  
  const [editDish, setEditDish] = useState<IDish | null>(null);
  const [newDish, setNewDish] = useState({ name: '', price: 0, description: '', imageUrl: '', dishCategoryId: 0 });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    }
    catch (err: any) {
      setError(err.message);
    }
  };

  const fetchDishes = async () => {
    try {
      const data = await getDishes();
      setDishes(data);
    }
    catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setError('');
    if (view === 'users') {
      fetchUsers();
    } else {
      fetchDishes();
    }
  }, [view]);

  const handleUserDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
    catch (err) {
      console.error(err);
    }
  };

  const handleUserUpdate = async () => {
    if (!editUser) return;
    try {
      await updateUser(editUser);
      setUsers(users.map(u => (u.id === editUser.id ? editUser : u)));
      setEditUser(null);
    }
    catch (err) {
      console.error(err);
    }
  };

  const handleUserAdd = async () => {
    try {
      const added = await addUser(newUser);
      setUsers([...users, added]);
      setNewUser({ fullName: '', email: '', role: 'User', password: '' });
    }
    catch (err) {
      console.error(err);
    }
  };

  const handleDishDelete = async (id: number) => {
    try {
      await deleteDish(id);
      setDishes(dishes.filter(d => d.id !== id));
    }
    catch (err) {
      console.error(err);
    }
  };

  const handleDishUpdate = async () => {
    if (!editDish) return;
    try {
      await updateDish(editDish);
      setDishes(dishes.map(d => (d.id === editDish.id ? editDish : d)));
      setEditDish(null);
    }
    catch (err) {
      console.error(err);
    }
  };

  const handleDishAdd = async () => {
    try {
      const added = await addDish(newDish);
      setDishes([...dishes, added]);
      setNewDish({ name: '', price: 0, description: '', imageUrl: '', dishCategoryId: 0 });
    }
    catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setView('users')}>Users</button>
        <button onClick={() => setView('dishes')} style={{ marginLeft: '1rem' }}>Dishes</button>
      </div>

      {view === 'users' && (
        <div>
          <h2>Users</h2>
          {users.length === 0 ? <p>No users found</p> : (
            <ul>
              {users.map(u => (
                <li key={u.id}>
                  {u.fullName} - {u.email} - {u.role}
                  <button onClick={() => setEditUser(u)}>Edit</button>
                  <button onClick={() => handleUserDelete(u.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
          {editUser && (
            <div>
              <h3>Edit User</h3>
              <input
                type="text"
                value={editUser.fullName}
                onChange={e => setEditUser({ ...editUser, fullName: e.target.value })}
              />
              <input
                type="text"
                value={editUser.email}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              />
              <select
                value={editUser.role}
                onChange={e => setEditUser({ ...editUser, role: e.target.value })}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <button onClick={handleUserUpdate}>Save</button>
              <button onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          )}
          <div>
            <h3>Add User</h3>
            <input placeholder="Full Name"
                   value={newUser.fullName}
                   onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} />
            <input placeholder="Email"
                   value={newUser.email}
                   onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
            <select value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <input placeholder="Password" type="password"
                   value={newUser.password}
                   onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
            <button onClick={handleUserAdd}>Add User</button>
          </div>
        </div>
      )}

      {view === 'dishes' && (
        <div>
          <h2>Dishes</h2>
          {dishes.length === 0 ? <p>No dishes found</p> : (
            <ul>
              {dishes.map(d => (
                <li key={d.id}>
                  {d.name} - ${d.price}
                  <button onClick={() => setEditDish(d)}>Edit</button>
                  <button onClick={() => handleDishDelete(d.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
          {editDish && (
            <div>
              <h3>Edit Dish</h3>
              <input
                type="text"
                value={editDish.name}
                onChange={e => setEditDish({ ...editDish, name: e.target.value })}
              />
              <input
                type="number"
                value={editDish.price}
                onChange={e => setEditDish({ ...editDish, price: Number(e.target.value) })}
              />
              <input
                type="text"
                value={editDish.description}
                onChange={e => setEditDish({ ...editDish, description: e.target.value })}
              />
              <input
                type="text"
                value={editDish.imageUrl}
                onChange={e => setEditDish({ ...editDish, imageUrl: e.target.value })}
              />
              <input
                type="number"
                value={editDish.dishCategoryId}
                onChange={e => setEditDish({ ...editDish, dishCategoryId: Number(e.target.value) })}
              />
              <button onClick={handleDishUpdate}>Save</button>
              <button onClick={() => setEditDish(null)}>Cancel</button>
            </div>
          )}
          <div>
            <h3>Add Dish</h3>
            <input placeholder="Name"
                   value={newDish.name}
                   onChange={e => setNewDish({ ...newDish, name: e.target.value })} />
            <input placeholder="Price" type="number"
                   value={newDish.price}
                   onChange={e => setNewDish({ ...newDish, price: Number(e.target.value) })} />
            <input placeholder="Description"
                   value={newDish.description}
                   onChange={e => setNewDish({ ...newDish, description: e.target.value })} />
            <input placeholder="Image URL"
                   value={newDish.imageUrl}
                   onChange={e => setNewDish({ ...newDish, imageUrl: e.target.value })} />
            <input placeholder="Category Id" type="number"
                   value={newDish.dishCategoryId}
                   onChange={e => setNewDish({ ...newDish, dishCategoryId: Number(e.target.value) })} />
            <button onClick={handleDishAdd}>Add Dish</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
