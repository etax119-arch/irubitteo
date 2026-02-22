'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatFileSize, FILE_CONSTRAINTS, validateUploadFile } from '@/lib/file';
import { DISABILITY_TYPES } from '@/types/employee';
import type { GalleryItem } from '@/types/gallery';

interface GalleryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    input: {
      title: string;
      artistName: string;
      description?: string;
      disabilityType?: string;
      imageAlt?: string;
      removeImage?: boolean;
      sortOrder?: number;
    },
    image?: File,
  ) => Promise<void>;
  isSubmitting: boolean;
  initialData?: GalleryItem;
}

export default function GalleryForm({ isOpen, onClose, onSubmit, isSubmitting, initialData }: GalleryFormProps) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [description, setDescription] = useState('');
  const [disabilityType, setDisabilityType] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
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
        setArtistName(initialData.artistName);
        setDescription(initialData.description || '');
        setDisabilityType(initialData.disabilityType || '');
        setImageAlt(initialData.imageAlt || '');
        setSortOrder(initialData.sortOrder);
        setPreview(initialData.imageThumbUrl || initialData.imageUrl);
        setRemoveExistingImage(false);
      } else {
        setTitle('');
        setArtistName('');
        setDescription('');
        setDisabilityType('');
        setImageAlt('');
        setSortOrder(0);
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
    const existingImagePreview = initialData ? (initialData.imageThumbUrl || initialData.imageUrl) : null;

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
    if (!title.trim() || !artistName.trim()) return;
    if (!isEdit && !selectedFile) return;
    await onSubmit(
      {
        title: title.trim(),
        artistName: artistName.trim(),
        description: description.trim() || undefined,
        disabilityType: disabilityType || undefined,
        imageAlt: imageAlt.trim() || undefined,
        removeImage: isEdit && removeExistingImage && !selectedFile ? true : undefined,
        sortOrder,
      },
      selectedFile || undefined,
    );
  };

  const isEdit = !!initialData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? '갤러리 수정' : '갤러리 등록'} size="lg" closeOnOverlayClick={false}>
      <div className="space-y-4">
        <Input label="작품 제목" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="작품 제목을 입력하세요" />
        <Input label="작가명" value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="작가 이름을 입력하세요" />

        {/* Disability type select */}
        <div className="w-full">
          <label htmlFor="disabilityType" className="block text-sm font-semibold text-gray-700 mb-2">
            장애 유형
          </label>
          <select
            id="disabilityType"
            value={disabilityType}
            onChange={(e) => setDisabilityType(e.target.value)}
            className="w-full px-4 py-3.5 border border-gray-200 bg-white hover:border-gray-300 rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-duru-orange-400 focus:border-transparent"
          >
            <option value="">선택 안 함</option>
            {DISABILITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Textarea
          label="작품 설명 (선택)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px]"
          placeholder="작품에 대한 설명을 입력하세요"
        />

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            이미지 {isEdit ? '(선택)' : '(필수)'}
          </label>
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="미리보기" className="w-48 h-36 object-cover rounded-lg" />
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
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF (최대 10MB) -- 가로 1600px 이상 권장</p>
        </div>

        <Input
          label="이미지 대체 텍스트 (접근성)"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
          placeholder="이미지를 설명하는 텍스트"
        />

        <Input
          label="정렬 순서"
          type="number"
          value={String(sortOrder)}
          onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
          placeholder="0"
        />
        <p className="text-xs text-gray-400 -mt-3">숫자가 작을수록 먼저 표시됩니다.</p>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !artistName.trim() || (!isEdit && !selectedFile) || isSubmitting}
          >
            {isSubmitting ? '저장 중...' : isEdit ? '수정' : '등록'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
