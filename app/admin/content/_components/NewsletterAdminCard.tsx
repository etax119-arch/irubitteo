'use client';

import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import type { NewsletterItem } from '@/types/newsletter';

interface NewsletterAdminCardProps {
  item: NewsletterItem;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}

export default function NewsletterAdminCard({ item, onEdit, onDelete, onTogglePublish }: NewsletterAdminCardProps) {
  const date = new Date(item.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
          <Badge variant={item.isPublished ? 'success' : 'default'} size="sm">
            {item.isPublished ? '공개' : '비공개'}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mb-1">{date}</p>
        <p className="text-sm text-gray-600 line-clamp-1">{item.content}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <IconButton
          icon={item.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          variant="ghost"
          size="sm"
          label={item.isPublished ? '비공개로 변경' : '공개로 변경'}
          onClick={onTogglePublish}
        />
        <IconButton icon={<Pencil className="w-4 h-4" />} variant="ghost" size="sm" label="수정" onClick={onEdit} />
        <IconButton icon={<Trash2 className="w-4 h-4" />} variant="ghost" size="sm" label="삭제" onClick={onDelete} />
      </div>
    </div>
  );
}
