
import { create } from "zustand";

type ModalConfig =
    | {
        formAction: "create";
    }
    | {
        formAction: "edit";
        id: number;
    };

interface ModalState {
    modal: ModalConfig | null;
    openCreate: () => void;
    openEdit: (id: number) => void;
    closeModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
    modal: null,

    openCreate: () =>
        set({
            modal: {
                formAction: "create",
            },
        }),

    openEdit: (id) =>
        set({
            modal: {
                formAction: "edit",
                id,
            },
        }),

    closeModal: () =>
        set({
            modal: null,
        }),
}));
