'use client';
// 임시 검증용 페이지 (검증 후 삭제)
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function PopoverCheck() {
  const [open, setOpen] = useState(true);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  return (
    <div className="p-10">
      <Button onClick={() => setOpen(true)}>모달 열기</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="공휴일 추가">
        <div className="space-y-4">
          <DatePicker label="날짜" value={date} onChange={setDate} allowManualInput
            minDate="2026-01-01" maxDate="2026-12-31" />
          <Input label="명칭" value={name} onChange={(e) => setName(e.target.value)} />
          <p className="text-sm text-gray-500">
            같은 날짜에 공휴일이 겹칠 수 있어 명칭이 다르면 함께 등록됩니다.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary">취소</Button>
            <Button>추가</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
