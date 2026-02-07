import { Modal } from '@/components/ui/Modal';

interface WorkDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWorkDone: { date: string; workDone: string } | null;
}

export function WorkDoneModal({ isOpen, onClose, selectedWorkDone }: WorkDoneModalProps) {
  if (!selectedWorkDone) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="업무 내용" size="md">
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">{selectedWorkDone.date}</p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-wrap">{selectedWorkDone.workDone}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
      >
        닫기
      </button>
    </Modal>
  );
}
