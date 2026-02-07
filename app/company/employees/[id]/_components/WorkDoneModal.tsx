import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

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
      <Button variant="outline" onClick={onClose} fullWidth>
        닫기
      </Button>
    </Modal>
  );
}
