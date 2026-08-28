'use client';

import { Pencil, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { resolvePostThumbnail } from '@/lib/postThumbnail';
import { formatKSTLongDate } from '@/lib/kst';
import type { AnnouncementItem } from '@/types/announcement';

interface AnnouncementAdminCardProps {
  item: AnnouncementItem;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}

export default function AnnouncementAdminCard({ item, onEdit, onDelete, onTogglePublish }: AnnouncementAdminCardProps) {
  const date = formatKSTLongDate(item.createdAt);
  const thumbnail = resolvePostThumbnail(item, 'thumb');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <div className="flex gap-3 sm:contents">
        <div className="w-24 h-20 sm:w-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail.src}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon aria-hidden className="w-6 h-6 text-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-2 gap-y-1 mb-1">
            <h3 className="font-semibold text-gray-900 truncate min-w-0">{item.title}</h3>
            <div className="shrink-0">
              <Badge variant={item.isPublished ? 'success' : 'default'} size="sm">
                {item.isPublished ? '공개' : '비공개'}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">{date}</p>
          <p className="text-sm text-gray-600 line-clamp-1">{item.content}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 justify-end border-t border-gray-100 pt-2 sm:border-t-0 sm:pt-0 sm:self-center">
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
