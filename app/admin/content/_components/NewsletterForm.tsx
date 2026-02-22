'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatFileSize, FILE_CONSTRAINTS, validateUploadFile } from '@/lib/file';
import type { NewsletterItem } from '@/types/newsletter';

interface NewsletterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: { title: string; content: string; removeImage?: boolean }, image?: File) => Promise<void>;
  isSubmitting: boolean;
  initialData?: NewsletterItem;
}

export default function NewsletterForm({ isOpen, onClose, onSubmit, isSubmitting, initialData }: NewsletterFormProps) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track object URLs for cleanup
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- 모달 열릴 때 기존 데이터로 폼 초기화
        setTitle(initialData.title);
        setContent(initialData.content);
        setPreview(initialData.imageThumbUrl || initialData.imageUrl || null);
        setRemoveExistingImage(false);
      } else {
        setTitle('');
        setContent('');
        setPreview(null);
        setRemoveExistingImage(false);
      }
      setSelectedFile(null);
      // Clean up any previous object URL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    }
  }, [isOpen, initialData]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateUploadFile(file, FILE_CONSTRAINTS.CONTENT_IMAGE);
      if (error) {
        toast.error(error);
        return;
      }
      setSelectedFile(file);
      // Revoke previous object URL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreview(url);
      setRemoveExistingImage(false);
    }
  };

  const handleRemoveFile = () => {
    const existingImagePreview = initialData?.imageThumbUrl || initialData?.imageUrl || null;

    if (selectedFile) {
      setSelectedFile(null);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreview(removeExistingImage ? null : existingImagePreview);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (existingImagePreview) {
      setPreview(null);
      setRemoveExistingImage(true);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    await onSubmit(
      {
        title: title.trim(),
        content: content.trim(),
        removeImage: isEdit && removeExistingImage && !selectedFile ? true : undefined,
      },
      selectedFile || undefined,
    );
  };

  const isEdit = !!initialData;

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

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">이미지 (선택)</label>
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="미리보기" className="w-40 h-28 object-cover rounded-lg" />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border border-gray-200"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
              {selectedFile && (
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(selectedFile.size)}</p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              이미지 선택
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF (최대 10MB)</p>
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
