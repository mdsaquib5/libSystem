import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: true,

    signup: async (data, router) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/auth/signup', data);
            set({ user: res.data.data, isAuthenticated: true, isLoading: false });
            toast.success("Signup successful!");
            router.push('/');
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Signup failed");
        }
    },

    login: async (data, router) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/auth/login', data);
            set({ user: res.data.data, isAuthenticated: true, isLoading: false });
            toast.success("Login successful!");
            router.push('/');
        } catch (error) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "Login failed");
        }
    },

    logout: async (router) => {
        try {
            await api.post('/auth/logout');
            set({ user: null, isAuthenticated: false });
            toast.success("Logged out successfully");
            if (router) router.push('/login');
        } catch (error) {
            toast.error("Logout failed");
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await api.get('/auth/me');
            set({ user: res.data.data, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, isCheckingAuth: false });
        }
    }
}));
