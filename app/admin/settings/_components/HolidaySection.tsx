'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DatePicker } from '@/components/ui/DatePicker';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import { useHolidays } from '../../_hooks/useHolidayQuery';
import {
  useCreateHoliday,
  useDeleteHoliday,
  useUpdateHoliday,
} from '../../_hooks/useHolidayMutations';
import type { Holiday } from '@/types/holiday';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/** "YYYY-MM-DD" → "3월 1일 (일)" */
function formatHolidayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  // UTC 정오로 만들어 타임존에 따라 날짜가 밀리지 않게 한다
  const day = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
  return `${m}월 ${d}일 (${DAY_LABELS[day]})`;
}

export function HolidaySection() {
  const toast = useToast();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const { data: holidays, isLoading, isError, refetch } = useHolidays(year);

  const [editing, setEditing] = useState<Holiday | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDate, setFormDate] = useState('');
  const [formName, setFormName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null);

  const createMutation = useCreateHoliday(year);
  const updateMutation = useUpdateHoliday(year);
  const deleteMutation = useDeleteHoliday(year);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const yearRange = useMemo(
    () => ({ min: `${year}-01-01`, max: `${year}-12-31` }),
    [year],
  );

  const openAddForm = () => {
    setEditing(null);
    setFormDate('');
    setFormName('');
    setIsFormOpen(true);
  };

  const openEditForm = (holiday: Holiday) => {
    setEditing(holiday);
    setFormDate(holiday.date);
    setFormName(holiday.name);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formDate) {
      toast.error('날짜를 선택해주세요.');
      return;
    }
    if (!formName.trim()) {
      toast.error('명칭을 입력해주세요.');
      return;
    }

    const input = { date: formDate, name: formName.trim() };
    const onSuccess = (message: string) => () => {
      toast.success(message);
      setIsFormOpen(false);
    };
    const onError = (err: unknown) => toast.error(extractErrorMessage(err));

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input },
        { onSuccess: onSuccess('공휴일이 수정되었습니다.'), onError },
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: onSuccess('공휴일이 추가되었습니다.'),
        onError,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('공휴일이 삭제되었습니다.');
        setDeleteTarget(null);
      },
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">공휴일 관리</h2>
            <p className="text-sm text-gray-600 mt-1">
              공휴일에는 근로자가 출근하지 않아도 결근으로 처리되지 않고 &lsquo;공휴&rsquo;로
              기록됩니다. 임시공휴일·선거일처럼 나중에 정해지는 날짜를 여기서 추가하세요.
            </p>
          </div>
          <Button
            onClick={openAddForm}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            공휴일 추가
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 연도 선택 */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setYear((y) => y - 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="이전 연도"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[88px] text-center">
            {year}년
          </span>
          <button
            type="button"
            onClick={() => setYear((y) => y + 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="다음 연도"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">공휴일을 불러올 수 없습니다</p>
            <Button variant="secondary" className="mt-3" onClick={() => void refetch()}>
              다시 시도
            </Button>
          </div>
        )}

        {!isLoading && !isError && holidays?.length === 0 && (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">{year}년 공휴일이 없습니다</p>
            <p className="text-sm text-gray-500 mt-1">
              기본 공휴일은 2026~2030년까지 등록되어 있습니다.
            </p>
          </div>
        )}

        {!isLoading && !isError && holidays && holidays.length > 0 && (
          <>
            <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {holidays.map((holiday) => (
                <li
                  key={holiday.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-32 shrink-0 text-sm font-semibold text-red-600 tabular-nums">
                    {formatHolidayDate(holiday.date)}
                  </span>
                  <span className="flex-1 min-w-0 text-gray-900 truncate">
                    {holiday.name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditForm(holiday)}
                      className="p-2 text-gray-500 hover:text-duru-orange-600 hover:bg-white rounded-lg transition-colors"
                      aria-label={`${holiday.name} 수정`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(holiday)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      aria-label={`${holiday.name} 삭제`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 text-right">총 {holidays.length}일</p>
          </>
        )}
      </CardContent>

      {/* 추가 / 수정 */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editing ? '공휴일 수정' : '공휴일 추가'}
      >
        <div className="space-y-4">
          <DatePicker
            label="날짜"
            value={formDate}
            onChange={setFormDate}
            disabled={isSaving}
            minDate={yearRange.min}
            maxDate={yearRange.max}
            allowManualInput
          />

          <Input
            label="명칭"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            disabled={isSaving}
            maxLength={50}
            placeholder="예: 임시공휴일, 대체공휴일"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />

          <p className="text-sm text-gray-500">
            같은 날짜에 공휴일이 겹칠 수 있어(예: 추석과 개천절이 같은 날) 명칭이 다르면
            함께 등록됩니다.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsFormOpen(false)}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              leftIcon={
                isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined
              }
            >
              {isSaving ? '저장 중...' : editing ? '수정' : '추가'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 삭제 확인 */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="공휴일 삭제"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            <span className="font-semibold">
              {deleteTarget && formatHolidayDate(deleteTarget.date)} {deleteTarget?.name}
            </span>
            을 삭제하시겠습니까?
          </p>
          <p className="text-sm text-gray-500">
            이 날짜는 더 이상 공휴일로 처리되지 않습니다. 지난 날짜의 기존 출퇴근 기록은
            그대로 유지됩니다.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              leftIcon={
                deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : undefined
              }
            >
              {deleteMutation.isPending ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
