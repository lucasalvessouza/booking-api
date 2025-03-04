import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers
      .Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

type BookingPayload = {
  role_id: string;
  start_time: string;
};


export const signIn = async (email: string, password: string) => {
  return api.post('/signin', { email, password });
};

export const signUp = async (email: string, password: string) => {
  return api.post('/signup', { email, password });
};

export const getAllTechnicianroles = async () => {
  const response = await api.get('/technician_roles');
  return response.data;
}

export const getAllBookings = async () => {
 const response = await api.get('/bookings');
 return response.data;
}

export const createBooking = async (payload: BookingPayload) => {
  return api.post('/bookings', payload);
}

export const getBookingDetails = async (id: string) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
}

export const deleteBooking = async (id: string) => {
  return api.delete(`/bookings/${id}`);
}