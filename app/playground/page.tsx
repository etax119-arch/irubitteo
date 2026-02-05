'use client';

import { useState } from 'react';
import { Search, Bell, User, Settings, ChevronRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { IconButton } from '@/components/ui/IconButton';
import { Modal } from '@/components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="min-h-screen bg-duru-ivory p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">UI 컴포넌트 Playground</h1>
          <p className="text-gray-600">공용 컴포넌트 시각적 검증 페이지 (임시)</p>
        </div>

        {/* Button */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Button</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">XL Button</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button leftIcon={<Search className="w-4 h-4" />}>With Left Icon</Button>
              <Button rightIcon={<ChevronRight className="w-4 h-4" />}>With Right Icon</Button>
              <Button disabled>Disabled</Button>
            </div>
            <Button fullWidth>Full Width Button</Button>
          </div>
        </section>

        {/* Badge */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Badge</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="orange">Orange</Badge>
            <Badge variant="info">Info</Badge>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
          </div>
        </section>

        {/* Card */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Card</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold">Card Title</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Card content goes here. This is a basic card with header, content, and footer.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
            <Card hover>
              <CardContent>
                <p className="text-gray-600">Hover card - 마우스를 올려보세요</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Avatar */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Avatar</h2>
          <div className="flex items-end gap-4">
            <Avatar size="xs" name="홍길동" />
            <Avatar size="sm" name="홍길동" />
            <Avatar size="md" name="홍길동" />
            <Avatar size="lg" name="홍길동" />
            <Avatar size="xl" name="홍길동" />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Avatar name="김철수" />
            <Avatar name="John Doe" />
            <Avatar />
          </div>
        </section>

        {/* Input */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Input</h2>
          <div className="space-y-4 max-w-md">
            <Input
              label="기본 입력"
              placeholder="텍스트를 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="아이콘 포함"
              placeholder="검색어를 입력하세요"
              leftIcon={<Search className="w-5 h-5" />}
            />
            <Input
              label="에러 상태"
              placeholder="이메일을 입력하세요"
              error="올바른 이메일 형식을 입력해주세요."
            />
            <div className="flex gap-3">
              <Input size="sm" placeholder="Small" />
              <Input size="md" placeholder="Medium" />
              <Input size="lg" placeholder="Large" />
            </div>
          </div>
        </section>

        {/* Textarea */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Textarea</h2>
          <div className="space-y-4 max-w-md">
            <Textarea
              label="문의 내용"
              placeholder="내용을 입력해주세요"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
            <Textarea
              label="에러 상태"
              placeholder="필수 입력 항목입니다"
              error="내용을 입력해주세요."
            />
          </div>
        </section>

        {/* Checkbox */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Checkbox</h2>
          <div className="space-y-3">
            <Checkbox
              label="동의합니다"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <Checkbox size="sm" label="Small 체크박스" />
            <Checkbox size="md" label="Medium 체크박스" />
            <Checkbox size="lg" label="Large 체크박스" />
          </div>
        </section>

        {/* IconButton */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">IconButton</h2>
          <div className="flex flex-wrap gap-3">
            <IconButton icon={<Search />} label="검색" />
            <IconButton icon={<Bell />} label="알림" variant="ghost" />
            <IconButton icon={<User />} label="사용자" variant="outline" />
            <IconButton icon={<Settings />} label="설정" size="lg" />
            <IconButton icon={<Check />} label="확인" size="sm" />
          </div>
        </section>

        {/* Modal */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>모달 열기</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="모달 제목"
          >
            <p className="text-gray-600 mb-4">
              모달 내용입니다. ESC 키를 누르거나 바깥 영역을 클릭하면 닫힙니다.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>취소</Button>
              <Button onClick={() => setIsModalOpen(false)}>확인</Button>
            </div>
          </Modal>
        </section>

        {/* Tabs */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Tabs</h2>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1" icon={<User className="w-5 h-5" />}>사용자</TabsTrigger>
              <TabsTrigger value="tab2" icon={<Settings className="w-5 h-5" />}>설정</TabsTrigger>
              <TabsTrigger value="tab3" icon={<Bell className="w-5 h-5" />}>알림</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <Card>
                <CardContent>
                  <p>사용자 탭 내용입니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab2">
              <Card>
                <CardContent>
                  <p>설정 탭 내용입니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab3">
              <Card>
                <CardContent>
                  <p>알림 탭 내용입니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <div className="text-center text-sm text-gray-400 pt-8 border-t">
          이 페이지는 개발 확인용이며 나중에 삭제됩니다.
        </div>
      </div>
    </div>
  );
}
