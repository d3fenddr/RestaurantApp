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

const adminAPI = axios.create({
  baseURL: '/api/admin',
  withCredentials: true,
});

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
