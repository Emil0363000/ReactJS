import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStoreTalks = create(
    persist(
        (set) => ({
            talks: [],
            addTalk: (newTalk) => set((state) => ({
                talks: [...state.talks, newTalk],
            })),
            removeTalk: (id) => set((state) => ({
                talks: state.talks.filter((talk) => talk.id !== id),
            })),
            modifyTalk: (id, updatedTalk) => set((state) => ({
                talks: state.talks.map((talk) =>
                    talk.id === id ? { ...talk, ...updatedTalk } : talk
                ),
            })),
            toggleTalk: (id) => set((state) => ({
                talks: state.talks.map((talk) =>
                    talk.id === id ? { ...talk, done: !talk.done } : talk
                ),
            })),
        }),
        {
            name: 'talks-storage', // Nom de la clé dans le localStorage
        }
    )
);