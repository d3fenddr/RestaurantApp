import React, { useEffect, useState } from 'react';
import './css/AdminDashboard.css';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import {
  getUsers, deleteUser, updateUser, IUser,
  getDishes, deleteDish, updateDish, IDish,
  getOrders, deleteOrder, updateOrder, IOrder
} from '../services/adminService';
import AddDishModal from '../components/AddDishModal';

type ViewType = 'users' | 'dishes' | 'orders';

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<ViewType>('users');
  const [users, setUsers] = useState<IUser[]>([]);
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  const [editItem, setEditItem] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; type: ViewType } | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    const load = async () => {
      setError('');
      setCurrentPage(1);
      try {
        if (view === 'users') setUsers(await getUsers());
        else if (view === 'dishes') setDishes(await getDishes());
        else if (view === 'orders') setOrders(await getOrders());
      } catch (err: any) {
        setError(err.message || 'Failed to load data.');
      }
    };
    load();
  }, [view]);

  const dataList = view === 'users' ? users : view === 'dishes' ? dishes : orders;
  const totalPages = Math.ceil(dataList.length / itemsPerPage);
  const currentItems = dataList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { id, type } = confirmDelete;
    if (type === 'users') {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } else if (type === 'dishes') {
      await deleteDish(id);
      setDishes(prev => prev.filter(d => d.id !== id));
    } else if (type === 'orders') {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    }
    setConfirmDelete(null);
  };

  const handleUpdate = async () => {
    if (!editItem) return;
    if (view === 'users') {
      await updateUser(editItem);
      setUsers(users.map(u => (u.id === editItem.id ? editItem : u)));
    } else if (view === 'dishes') {
      await updateDish(editItem);
      setDishes(dishes.map(d => (d.id === editItem.id ? editItem : d)));
    } else if (view === 'orders') {
      await updateOrder(editItem);
      setOrders(orders.map(o => (o.id === editItem.id ? editItem : o)));
    }
    setEditItem(null);
  };

  return (
    <>
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        {error && <p className="error">{error}</p>}

        <div className="tab-buttons">
          <button onClick={() => setView('users')}>Users</button>
          <button onClick={() => setView('dishes')}>Dishes</button>
          <button onClick={() => setView('orders')}>Orders</button>
        </div>

        {view === 'dishes' && (
          <button className="add-btn-modern" onClick={() => setAddOpen(true)}>
            <span style={{ fontSize: 20, marginRight: 8 }}>＋</span>
            Add Dish
          </button>
        )}

        <ul>
          {currentItems.map(item => (
            <li key={item.id}>
              <div className="item-info">
                {view === 'users' && `${(item as IUser).fullName} - ${(item as IUser).email} - ${(item as IUser).role}`}
                {view === 'dishes' && `${(item as IDish).nameEn} - $${(item as IDish).price}`}
                {view === 'orders' && `Order #${(item as IOrder).id} - User: ${(item as IOrder).userId} - $${(item as IOrder).total}`}
              </div>
              <div className="item-actions">
                <button onClick={() => setEditItem(item)}>Edit</button>
                <button onClick={() => setConfirmDelete({ id: item.id, type: view })}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Edit Modal */}
      <AdminModal
        title={`Edit ${view.slice(0, 1).toUpperCase() + view.slice(1).slice(0, -1)}`}
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
      >
        {editItem && (
          <div className="form-section">
            {view === 'users' && (
              <>
                <input value={editItem.fullName} onChange={e => setEditItem({ ...editItem, fullName: e.target.value })} />
                <input value={editItem.email} onChange={e => setEditItem({ ...editItem, email: e.target.value })} />
                <select value={editItem.role} onChange={e => setEditItem({ ...editItem, role: e.target.value })}>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </>
            )}
            {view === 'dishes' && (
              <>
                <input value={editItem.nameEn} onChange={e => setEditItem({ ...editItem, nameEn: e.target.value })} placeholder="Name (English)" />
                <input value={editItem.nameRu} onChange={e => setEditItem({ ...editItem, nameRu: e.target.value })} placeholder="Name (Russian)" />
                <input value={editItem.nameAz} onChange={e => setEditItem({ ...editItem, nameAz: e.target.value })} placeholder="Name (Azerbaijani)" />
                <input type="number" value={editItem.price} onChange={e => setEditItem({ ...editItem, price: Number(e.target.value) })} placeholder="Price" />
                <input value={editItem.descriptionEn} onChange={e => setEditItem({ ...editItem, descriptionEn: e.target.value })} placeholder="Description (English)" />
                <input value={editItem.descriptionRu} onChange={e => setEditItem({ ...editItem, descriptionRu: e.target.value })} placeholder="Description (Russian)" />
                <input value={editItem.descriptionAz} onChange={e => setEditItem({ ...editItem, descriptionAz: e.target.value })} placeholder="Description (Azerbaijani)" />
                <input value={editItem.imageUrl} onChange={e => setEditItem({ ...editItem, imageUrl: e.target.value })} placeholder="Image URL" />
              </>
            )}
            {view === 'orders' && (
              <>
                <input type="number" value={editItem.userId} onChange={e => setEditItem({ ...editItem, userId: Number(e.target.value) })} />
                <input type="number" value={editItem.total} onChange={e => setEditItem({ ...editItem, total: Number(e.target.value) })} />
              </>
            )}
            <button onClick={handleUpdate}>Save</button>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Add Dish Modal */}
      {addOpen && (
        <AddDishModal
          onClose={() => setAddOpen(false)}
          onAdded={async () => {
            setDishes(await getDishes());
            setAddOpen(false);
          }}
        />
      )}
    </>
  );
};

export default AdminDashboard;
