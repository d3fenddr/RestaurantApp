import React, { useEffect, useState } from 'react';
import './css/AdminDashboard.css';
import AdminModal from '../components/AdminModal';
import Pagination from '../components/Pagination';
import {
  getUsers, deleteUser, updateUser, addUser, IUser,
  getDishes, deleteDish, updateDish, addDish, IDish
} from '../services/adminService';

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<'users' | 'dishes'>('users');
  const [users, setUsers] = useState<IUser[]>([]);
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddDishModal, setShowAddDishModal] = useState(false);

  // Edit/Add Forms
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', role: 'User', password: '' });

  const [editDish, setEditDish] = useState<IDish | null>(null);
  const [newDish, setNewDish] = useState({ name: '', price: 0, description: '', imageUrl: '', dishCategoryId: 0 });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchDishes = async () => {
    try {
      const data = await getDishes();
      setDishes(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setError('');
    setCurrentPage(1); // сбрасываем пагинацию
    view === 'users' ? fetchUsers() : fetchDishes();
  }, [view]);

  // Pagination logic
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedDishes = dishes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // User Handlers
  const handleUserDelete = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  const handleUserUpdate = async () => {
    if (!editUser) return;
    await updateUser(editUser);
    setUsers(users.map(u => (u.id === editUser.id ? editUser : u)));
    setEditUser(null);
  };

  const handleUserAdd = async () => {
    const added = await addUser(newUser);
    setUsers([...users, added]);
    setNewUser({ fullName: '', email: '', role: 'User', password: '' });
    setShowAddUserModal(false);
  };

  // Dish Handlers
  const handleDishDelete = async (id: number) => {
    await deleteDish(id);
    setDishes(dishes.filter(d => d.id !== id));
  };

  const handleDishUpdate = async () => {
    if (!editDish) return;
    await updateDish(editDish);
    setDishes(dishes.map(d => (d.id === editDish.id ? editDish : d)));
    setEditDish(null);
  };

  const handleDishAdd = async () => {
    const added = await addDish(newDish);
    setDishes([...dishes, added]);
    setNewDish({ name: '', price: 0, description: '', imageUrl: '', dishCategoryId: 0 });
    setShowAddDishModal(false);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="tab-buttons">
        <button onClick={() => setView('users')}>Users</button>
        <button onClick={() => setView('dishes')}>Dishes</button>
      </div>

      {view === 'users' && (
        <div>
          <h2>Users</h2>
          <button onClick={() => setShowAddUserModal(true)}>Add User</button>

          {paginatedUsers.map(u => (
            <li key={u.id}>
              {u.fullName} - {u.email} - {u.role}
              <button onClick={() => setEditUser(u)}>Edit</button>
              <button onClick={() => handleUserDelete(u.id)}>Delete</button>
            </li>
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(users.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
          {editUser && (
            <div className="form-section">
              <h3>Edit User</h3>
              <input value={editUser.fullName} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} />
              <input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
              <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <button onClick={handleUserUpdate}>Save</button>
              <button onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          )}
          <AdminModal title="Add New User" isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)}>
            <div className="form-section">
              <input placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} />
              <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              <button onClick={handleUserAdd}>Add</button>
            </div>
          </AdminModal>
        </div>
      )}

      {view === 'dishes' && (
        <div>
          <h2>Dishes</h2>
          <button onClick={() => setShowAddDishModal(true)}>Add Dish</button>

          {paginatedDishes.map(d => (
            <li key={d.id}>
              {d.name} - ${d.price}
              <button onClick={() => setEditDish(d)}>Edit</button>
              <button onClick={() => handleDishDelete(d.id)}>Delete</button>
            </li>
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(dishes.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
          {editDish && (
            <div className="form-section">
              <h3>Edit Dish</h3>
              <input value={editDish.name} onChange={e => setEditDish({ ...editDish, name: e.target.value })} />
              <input type="number" value={editDish.price} onChange={e => setEditDish({ ...editDish, price: Number(e.target.value) })} />
              <input value={editDish.description} onChange={e => setEditDish({ ...editDish, description: e.target.value })} />
              <input value={editDish.imageUrl} onChange={e => setEditDish({ ...editDish, imageUrl: e.target.value })} />
              <input type="number" value={editDish.dishCategoryId} onChange={e => setEditDish({ ...editDish, dishCategoryId: Number(e.target.value) })} />
              <button onClick={handleDishUpdate}>Save</button>
              <button onClick={() => setEditDish(null)}>Cancel</button>
            </div>
          )}
          <AdminModal title="Add New Dish" isOpen={showAddDishModal} onClose={() => setShowAddDishModal(false)}>
            <div className="form-section">
              <input placeholder="Name" value={newDish.name} onChange={e => setNewDish({ ...newDish, name: e.target.value })} />
              <input placeholder="Price" type="number" value={newDish.price} onChange={e => setNewDish({ ...newDish, price: Number(e.target.value) })} />
              <input placeholder="Description" value={newDish.description} onChange={e => setNewDish({ ...newDish, description: e.target.value })} />
              <input placeholder="Image URL" value={newDish.imageUrl} onChange={e => setNewDish({ ...newDish, imageUrl: e.target.value })} />
              <input placeholder="Category Id" type="number" value={newDish.dishCategoryId} onChange={e => setNewDish({ ...newDish, dishCategoryId: Number(e.target.value) })} />
              <button onClick={handleDishAdd}>Add</button>
            </div>
          </AdminModal>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
