'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatFileSize, FILE_CONSTRAINTS, validateUploadFile } from '@/lib/file';
import type { AnnouncementItem } from '@/types/announcement';

const MAX_IMAGES = 10;

type NewFileEntry = { file: File; url: string };

interface AnnouncementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    input: { title: string; content: string; deleteImageIds?: string[] },
    newImages: File[],
  ) => Promise<void>;
  isSubmitting: boolean;
  initialData?: AnnouncementItem;
}

export default function AnnouncementForm({ isOpen, onClose, onSubmit, isSubmitting, initialData }: AnnouncementFormProps) {
  const toast = useToast();
  // 부모가 열릴 때만 마운트하므로(닫으면 언마운트) 초기값을 그대로 초기 상태로 쓴다.
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [newFiles, setNewFiles] = useState<NewFileEntry[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<Set<string>>(new Set());
  const existingImages = initialData?.images ?? [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 미리보기용 blob URL은 개별 삭제 시점과 언마운트 시점에 모두 정리한다.
  const objectUrlsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const createPreviewUrl = (file: File) => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.add(url);
    return url;
  };

  const revokePreviewUrl = (url: string) => {
    URL.revokeObjectURL(url);
    objectUrlsRef.current.delete(url);
  };

  const visibleExistingImages = existingImages.filter((img) => !deleteImageIds.has(img.id));
  const totalCount = visibleExistingImages.length + newFiles.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const slots = MAX_IMAGES - totalCount;
    if (slots <= 0) {
      toast.error(`이미지는 최대 ${MAX_IMAGES}장까지 등록할 수 있습니다.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const accepted: NewFileEntry[] = [];
    for (const file of files.slice(0, slots)) {
      const error = validateUploadFile(file, FILE_CONSTRAINTS.CONTENT_IMAGE);
      if (error) {
        toast.error(error);
        continue;
      }
      accepted.push({ file, url: createPreviewUrl(file) });
    }

    if (files.length > slots) {
      toast.error(`${files.length - slots}개 초과분은 추가되지 않았습니다.`);
    }

    if (accepted.length > 0) {
      setNewFiles((prev) => [...prev, ...accepted]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveExisting = (id: string) => {
    setDeleteImageIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleRemoveNew = (target: NewFileEntry) => {
    revokePreviewUrl(target.url);
    setNewFiles((prev) => prev.filter((entry) => entry !== target));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    const ids = Array.from(deleteImageIds);
    await onSubmit(
      {
        title: title.trim(),
        content: content.trim(),
        deleteImageIds: isEdit && ids.length > 0 ? ids : undefined,
      },
      newFiles.map((e) => e.file),
    );
  };

  const isEdit = !!initialData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? '공고 수정' : '공고 등록'} size="lg" closeOnOverlayClick={false}>
      <div className="space-y-4">
        <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="공고 제목을 입력하세요" />
        <Textarea
          label="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
          placeholder="공고 내용을 입력하세요"
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            이미지 (선택) <span className="text-gray-400 font-normal">— {totalCount}/{MAX_IMAGES}</span>
          </label>

          {totalCount > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
              {visibleExistingImages.map((img) => (
                <div key={img.id} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageThumbUrl || img.imageUrl}
                    alt={img.imageAlt || '기존 이미지'}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(img.id)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border border-gray-200"
                    aria-label="이미지 삭제"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}
              {newFiles.map((entry) => (
                <div key={entry.url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.url}
                    alt="미리보기"
                    className="w-full h-28 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNew(entry)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border border-gray-200"
                    aria-label="이미지 삭제"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">{formatFileSize(entry.file.size)}</p>
                </div>
              ))}
            </div>
          )}

          {totalCount < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              이미지 추가
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF (최대 10MB, {MAX_IMAGES}장까지)</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || isSubmitting}
          >
            {isSubmitting ? '저장 중...' : isEdit ? '수정' : '등록'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
