'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  category: '부모님' | '기업' | '병원';
  rating: number;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: '김영희',
    role: '장애인 자녀 어머니',
    category: '부모님',
    rating: 5,
    content: '우리 아이가 처음으로 안정적인 직장에 다니게 되었어요. 출퇴근 관리도 체계적이고, 담당자분들이 세심하게 챙겨주셔서 정말 감사합니다.',
    avatar: '👩'
  },
  {
    id: 2,
    name: '이철수',
    role: '제조업체 대표',
    category: '기업',
    rating: 5,
    content: '장애인 고용 의무를 이행하면서도 우수한 인력을 확보할 수 있었습니다. 출퇴근 관리 시스템이 너무 편리해서 업무 효율이 크게 향상되었어요.',
    avatar: '👨‍💼'
  },
  {
    id: 3,
    name: '박수진',
    role: '대학병원 인사팀장',
    category: '병원',
    rating: 5,
    content: '병원 내 다양한 부서에 장애인 근로자를 배치했는데, 이루빛터 덕분에 관리가 정말 수월합니다. 실시간 근태 확인과 급여 정산이 자동화되어 있어 편리해요.',
    avatar: '👩‍⚕️'
  },
  {
    id: 4,
    name: '최민호',
    role: '장애인 아들 아버지',
    category: '부모님',
    rating: 5,
    content: '아들이 직장에서 인정받고 성장하는 모습을 보니 정말 뿌듯합니다. 매달 꼬박꼬박 급여도 받고, 회사에서도 칭찬을 많이 받아요.',
    avatar: '👨'
  },
  {
    id: 5,
    name: '강지영',
    role: 'IT 기업 HR 담당자',
    category: '기업',
    rating: 5,
    content: '장애인 고용에 대한 막연한 걱정이 있었는데, 이루빛터가 처음부터 끝까지 케어해주셔서 정말 만족스럽습니다. 이제는 우리 회사 핵심 인력이에요.',
    avatar: '👩‍💻'
  },
  {
    id: 6,
    name: '정우성',
    role: '종합병원 원무과장',
    category: '병원',
    rating: 5,
    content: '환자 안내, 문서 정리 등 다양한 업무에 장애인 근로자들이 정말 열심히 일해주고 있습니다. 관리 시스템도 직관적이고 효율적이에요.',
    avatar: '👨‍⚕️'
  }
];

const categories = ['전체', '부모님', '기업', '병원'] as const;

export default function TestimonialsSection() {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('전체');

  const filteredTestimonials = selectedCategory === '전체'
    ? testimonials
    : testimonials.filter(t => t.category === selectedCategory);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-duru-ivory overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-duru-text-main mb-4">
            <span className="bg-gradient-to-r from-duru-orange to-duru-orange-200 bg-clip-text text-transparent">
              이용자 후기
            </span>
          </h2>
          <p className="text-lg text-duru-text-sub max-w-2xl mx-auto">
            이루빛터와 함께한 분들의 생생한 경험을 확인해보세요
          </p>
        </motion.div>

        {/* 카테고리 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-3 mb-12 flex-wrap"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-duru-orange text-white shadow-lg shadow-duru-orange/30 scale-105'
                  : 'bg-white text-duru-text-sub hover:bg-duru-orange-50 hover:text-duru-orange'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* 후기 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-duru-orange-50"
            >
              {/* 별점 */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* 후기 내용 */}
              <p className="text-duru-text-main mb-6 leading-relaxed min-h-[120px]">
                {`"${testimonial.content}"`}
              </p>

              {/* 작성자 정보 */}
              <div className="flex items-center gap-3 pt-4 border-t border-duru-orange-50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-duru-orange-50 to-duru-orange-100 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-duru-text-main">{testimonial.name}</p>
                  <p className="text-sm text-duru-text-sub">{testimonial.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-duru-orange-50 text-duru-orange">
                    {testimonial.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { label: '평균 만족도', value: '4.9', unit: '점' },
            { label: '누적 후기', value: '1,200+', unit: '건' },
            { label: '재계약률', value: '98', unit: '%' },
            { label: '추천 의향', value: '99', unit: '%' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl font-bold text-duru-orange mb-1">
                {stat.value}
                <span className="text-xl">{stat.unit}</span>
              </div>
              <div className="text-sm text-duru-text-sub">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
