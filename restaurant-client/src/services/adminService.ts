import axios from 'axios';

export interface IUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface IDish {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  dishCategoryId: number;
}

export interface IOrderItem {
  dishId: number;
  quantity: number;
  price: number;
}

export interface IOrder {
  id: number;
  userId: number;
  total: number;
  orderDate: string;
  orderItems: IOrderItem[];
}

const adminAPI = axios.create({
  baseURL: '/api/admin',
  withCredentials: true,
});

adminAPI.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getUsers = async (): Promise<IUser[]> => {
  const response = await adminAPI.get('/users');
  return response.data;
};

export const updateUser = async (user: IUser): Promise<void> => {
  await adminAPI.put(`/users/${user.id}`, user);
};

export const deleteUser = async (id: number): Promise<void> => {
  await adminAPI.delete(`/users/${id}`);
};

export const addUser = async (newUser: any): Promise<IUser> => {
  const response = await adminAPI.post('/users', newUser);
  return response.data;
};

export const getDishes = async (): Promise<IDish[]> => {
  const response = await adminAPI.get('/dishes');
  return response.data;
};

export const updateDish = async (dish: IDish): Promise<void> => {
  await adminAPI.put(`/dishes/${dish.id}`, dish);
};

export const deleteDish = async (id: number): Promise<void> => {
  await adminAPI.delete(`/dishes/${id}`);
};

export const addDish = async (newDish: any): Promise<IDish> => {
  const response = await adminAPI.post('/dishes', newDish);
  return response.data;
};

export const getOrders = async (): Promise<IOrder[]> => {
  const response = await axios.get('/api/orders', { withCredentials: true });
  return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await axios.delete(`/api/orders/${id}`, { withCredentials: true });
};

export const updateOrder = async (order: IOrder): Promise<void> => {
  await axios.put(`/api/orders/${order.id}`, order, { withCredentials: true });
};

export const addOrder = async (newOrder: IOrder): Promise<IOrder> => {
  const response = await axios.post('/api/orders', newOrder, { withCredentials: true });
  return response.data;
};


export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  await axios.post(
    '/api/users/change-password',
    { oldPassword, newPassword },
    { withCredentials: true }
  );
};