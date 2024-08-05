import { create } from 'zustand';

interface Child {
    childName: string; 
    parentTel: string; 
    status: string;    
    checked: string;   
}

interface Bus {
    busStopId: number; 
    busStopName: string; 
    children: Child[]; 
}

interface BusState {
    busInfo: Bus | null; 
    setBusInfo: (bus: Bus) => void;
    updateChildChecked: (childName: string, checked: string) => void;
}

export const useBusStore = create<BusState>((set) => ({
    busInfo: null,
    setBusInfo: (bus) => set({ busInfo: bus }), 

    updateChildChecked: (childName, checked) => set((state) => {
        if (state.busInfo) {
            const updatedChildren = state.busInfo.children.map((child) =>
                child.childName === childName ? { ...child, checked } : child
            );
            return { busInfo: { ...state.busInfo, children: updatedChildren } };
        }
        return state;
    }),
}));
