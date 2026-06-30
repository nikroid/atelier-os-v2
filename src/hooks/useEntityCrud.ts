import { useCallback, useState } from 'react';

export interface EntityCrudState<TForm> {
  modalOpen: boolean;
  editingId: string | null;
  form: TForm;
  openCreate: (initial: TForm) => void;
  openEdit: (id: string, form: TForm) => void;
  closeModal: () => void;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  updateForm: (patch: Partial<TForm>) => void;
}

export function useEntityCrud<TForm>(): EntityCrudState<TForm> {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TForm>(() => ({} as TForm));

  const openCreate = useCallback((initial: TForm) => {
    setEditingId(null);
    setForm(initial);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((id: string, nextForm: TForm) => {
    setEditingId(id);
    setForm(nextForm);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const updateForm = useCallback((patch: Partial<TForm>) => {
    setForm((f) => ({ ...f, ...patch }));
  }, []);

  return {
    modalOpen,
    editingId,
    form,
    openCreate,
    openEdit,
    closeModal,
    setForm,
    updateForm,
  };
}
