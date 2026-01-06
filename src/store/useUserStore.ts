// src/store/useUserStore.ts
import { create } from 'zustand';

interface UserState {
    name: string;
}

// حتما کلمه export را اینجا بنویسید
export const useUserStore = create<UserState>((set) => ({
    name: 'Guest',
}));