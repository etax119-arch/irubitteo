'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatFileSize, FILE_CONSTRAINTS, validateUploadFile } from '@/lib/file';
import { extractYoutubeId, getYoutubeThumbnail } from '@/lib/youtube';
import type { NewsletterItem, NewsletterImage } from '@/types/newsletter';

const MAX_IMAGES = 10;

type NewFileEntry = { file: File; url: string };

interface NewsletterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    input: {
      title: string;
      content: string;
      videoUrl?: string | null;
      deleteImageIds?: string[];
      deleteCoverImage?: boolean;
    },
    newImages: File[],
    coverImage?: File | null,
  ) => Promise<void>;
  isSubmitting: boolean;
  initialData?: NewsletterItem;
}

export default function NewsletterForm({ isOpen, onClose, onSubmit, isSubmitting, initialData }: NewsletterFormProps) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [newFiles, setNewFiles] = useState<NewFileEntry[]>([]);
  const [existingImages, setExistingImages] = useState<NewsletterImage[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<Set<string>>(new Set());
  const [coverFile, setCoverFile] = useState<NewFileEntry | null>(null);
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        setVideoUrl(initialData.videoUrl ?? '');
        setExistingImages(initialData.images);
        setExistingCover(initialData.coverImageThumbUrl || initialData.coverImageUrl);
      } else {
        setTitle('');
        setContent('');
        setVideoUrl('');
        setExistingImages([]);
        setExistingCover(null);
      }
      setNewFiles((prev) => {
        prev.forEach((e) => URL.revokeObjectURL(e.url));
        return [];
      });
      setCoverFile((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return null;
      });
      setDeleteImageIds(new Set());
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    return () => {
      setNewFiles((prev) => {
        prev.forEach((e) => URL.revokeObjectURL(e.url));
        return prev;
      });
      setCoverFile((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return prev;
      });
    };
  }, []);

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
      accepted.push({ file, url: URL.createObjectURL(file) });
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
    URL.revokeObjectURL(target.url);
    setNewFiles((prev) => prev.filter((entry) => entry !== target));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (!file) return;

    const error = validateUploadFile(file, FILE_CONSTRAINTS.CONTENT_IMAGE);
    if (error) {
      toast.error(error);
      return;
    }

    setCoverFile((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return { file, url: URL.createObjectURL(file) };
    });
  };

  const handleRemoveCover = () => {
    setCoverFile((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
    setExistingCover(null);
  };

  const isEdit = !!initialData;
  const hadCover = !!(initialData?.coverImageThumbUrl || initialData?.coverImageUrl);
  const coverPreview = coverFile?.url ?? existingCover;
  const videoId = extractYoutubeId(videoUrl);
  const hasVideoError = videoUrl.trim() !== '' && !videoId;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    if (hasVideoError) {
      toast.error('올바른 유튜브 링크가 아닙니다.');
      return;
    }

    const ids = Array.from(deleteImageIds);
    await onSubmit(
      {
        title: title.trim(),
        content: content.trim(),
        // 빈 값이면 null → 영상 없음(수정 시 제거)
        videoUrl: videoUrl.trim() || null,
        deleteImageIds: isEdit && ids.length > 0 ? ids : undefined,
        // 원래 있던 대표사진을 지우고 새로 올리지도 않았다면 삭제 요청
        deleteCoverImage:
          isEdit && hadCover && !coverFile && !existingCover ? true : undefined,
      },
      newFiles.map((e) => e.file),
      coverFile?.file ?? null,
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? '소식지 수정' : '소식지 등록'} size="lg" closeOnOverlayClick={false}>
      <div className="space-y-4">
        <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="소식지 제목을 입력하세요" />
        <Textarea
          label="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
          placeholder="소식지 내용을 입력하세요"
        />

        {/* 대표사진 — 글 목록에서만 보이는 사진 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            대표사진 (선택)
          </label>

          {coverPreview ? (
            <div className="relative w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPreview}
                alt="대표사진 미리보기"
                className="w-full h-28 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveCover}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border border-gray-200"
                aria-label="대표사진 삭제"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
              {coverFile && (
                <p className="text-xs text-gray-500 mt-1 truncate">{formatFileSize(coverFile.file.size)}</p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              대표사진 추가
            </button>
          )}

          <input
            ref={coverInputRef}
            type="file"
            accept={FILE_CONSTRAINTS.CONTENT_IMAGE.accept}
            onChange={handleCoverChange}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-1">
            글 목록에만 보이는 사진입니다. 등록하지 않으면 아래 이미지 중 첫 장이 사용됩니다.
          </p>
        </div>

        {/* 유튜브 링크 */}
        <div>
          <Input
            label="유튜브 링크 (선택)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            error={hasVideoError ? '올바른 유튜브 링크가 아닙니다.' : undefined}
          />
          {videoId && (
            <div className="mt-2 w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getYoutubeThumbnail(videoId)}
                alt="유튜브 썸네일 미리보기"
                className="w-full rounded-lg"
              />
              <p className="text-xs text-gray-400 mt-1">글 상세페이지에 영상이 표시됩니다.</p>
            </div>
          )}
        </div>

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
            accept={FILE_CONSTRAINTS.CONTENT_IMAGE.accept}
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
            disabled={!title.trim() || !content.trim() || hasVideoError || isSubmitting}
          >
            {isSubmitting ? '저장 중...' : isEdit ? '수정' : '등록'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
