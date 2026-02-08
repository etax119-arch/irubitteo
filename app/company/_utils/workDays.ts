export const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;

export const LABEL_TO_NUM: Record<string, number> = {
  '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7,
};

export const NUM_TO_LABEL: Record<number, string> = {
  1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', 7: '일',
};
