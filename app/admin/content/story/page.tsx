'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { useAdminStories } from '../../_hooks/useStoryQuery';
import { useCreateStory, useUpdateStory, useDeleteStory } from '../../_hooks/useStoryMutations';
import type { StoryCreateInput, StoryItem, StoryUpdateInput } from '@/types/story';
import StoryAdminCard from '../_components/StoryAdminCard';
import StoryForm from '../_components/StoryForm';

export default function AdminStoryPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StoryItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data, isLoading } = useAdminStories(page);
  const createMutation = useCreateStory();
  const updateMutation = useUpdateStory();
  const deleteMutation = useDeleteStory();

  const handleCreate = async (
    input: StoryCreateInput,
    images: File[],
    coverImage?: File | null,
  ) => {
    try {
      await createMutation.mutateAsync({ input, images, coverImage });
      toast.success('이야기가 등록되었습니다.');
      setFormOpen(false);
    } catch {
      // Global error handler from QueryClient handles this
    }
  };

  const handleEdit = async (
    input: StoryUpdateInput,
    newImages: File[],
    coverImage?: File | null,
  ) => {
    if (!editTarget) return;
    try {
      await updateMutation.mutateAsync({ id: editTarget.id, input, newImages, coverImage });
      toast.success('이야기가 수정되었습니다.');
      setEditTarget(null);
    } catch {
      // Global error handler
    }
  };

  const handleTogglePublish = (item: StoryItem) => {
    updateMutation.mutate(
      { id: item.id, input: { isPublished: !item.isPublished } },
      {
        onSuccess: () => toast.success(item.isPublished ? '비공개로 변경되었습니다.' : '공개로 변경되었습니다.'),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId, {
      onSuccess: () => {
        toast.success('이야기가 삭제되었습니다.');
        setDeleteTargetId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const stories = data?.stories ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setFormOpen(true)}>
          이야기 등록
        </Button>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">등록된 이야기가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {stories.map((item) => (
            <StoryAdminCard
              key={item.id}
              item={item}
              onEdit={() => setEditTarget(item)}
              onDelete={() => setDeleteTargetId(item.id)}
              onTogglePublish={() => handleTogglePublish(item)}
            />
          ))}
        </div>
      )}

      {pagination && (
        <PaginationBar
          currentPage={page}
          pagination={pagination}
          onPrevPage={() => setPage((p) => p - 1)}
          onNextPage={() => setPage((p) => p + 1)}
        />
      )}

      {/* Create Modal */}
      <StoryForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Modal */}
      {editTarget && (
        <StoryForm
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={handleEdit}
          isSubmitting={updateMutation.isPending}
          initialData={editTarget}
        />
      )}

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} title="삭제 확인" size="sm">
        <p className="text-gray-600 mb-6">정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)}>
            취소
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
