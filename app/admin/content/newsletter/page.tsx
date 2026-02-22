'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { useAdminNewsletters } from '../../_hooks/useNewsletterQuery';
import { useCreateNewsletter, useUpdateNewsletter, useDeleteNewsletter } from '../../_hooks/useNewsletterMutations';
import type { NewsletterItem } from '@/types/newsletter';
import NewsletterAdminCard from '../_components/NewsletterAdminCard';
import NewsletterForm from '../_components/NewsletterForm';

export default function AdminNewsletterPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<NewsletterItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data, isLoading } = useAdminNewsletters(page);
  const createMutation = useCreateNewsletter();
  const updateMutation = useUpdateNewsletter();
  const deleteMutation = useDeleteNewsletter();

  const handleCreate = async (input: { title: string; content: string; imageAlt?: string }, image?: File) => {
    try {
      await createMutation.mutateAsync({ input, image });
      toast.success('소식지가 등록되었습니다.');
      setFormOpen(false);
    } catch {
      // Global error handler from QueryClient handles this
    }
  };

  const handleEdit = async (
    input: { title?: string; content?: string; imageAlt?: string; removeImage?: boolean; isPublished?: boolean },
    image?: File,
  ) => {
    if (!editTarget) return;
    try {
      await updateMutation.mutateAsync({ id: editTarget.id, input, image });
      toast.success('소식지가 수정되었습니다.');
      setEditTarget(null);
    } catch {
      // Global error handler
    }
  };

  const handleTogglePublish = (item: NewsletterItem) => {
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
        toast.success('소식지가 삭제되었습니다.');
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

  const newsletters = data?.newsletters ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setFormOpen(true)}>
          소식지 등록
        </Button>
      </div>

      {newsletters.length === 0 ? (
        <div className="text-center py-16 text-gray-400">등록된 소식지가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {newsletters.map((item) => (
            <NewsletterAdminCard
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
      <NewsletterForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Modal */}
      {editTarget && (
        <NewsletterForm
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
