import { create } from 'zustand'

interface ModalState {
  open: boolean
  confirmLoading: boolean
  modalText: string
  setOpen: (status: boolean) => void
  setConfirmLoading: (status: boolean) => void
  setModalText: (text: string) => void
  handleOk: () => void
  handleCancel: () => void
}

export const useModal = create<ModalState>()((set) => ({
  open: false,
  confirmLoading: false,
  modalText: '',
  setOpen: (status: boolean) => set(() => ({ open: status })),
  setConfirmLoading: (status: boolean) => set(() => ({ confirmLoading: status })),
  setModalText: (text: string) => set(() => ({ modalText: text })),
  handleOk: () =>
    set(() => ({
      modalText: 'The modal will be closed after two seconds',
      open: false,
      confirmLoading: true
    })),
  handleCancel: () => set(() => ({ open: false }))
}))
