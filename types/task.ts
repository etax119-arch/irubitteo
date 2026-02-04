/** 업무 */
export type Task = {
  id: string;
  employeeId: string;
  attendanceId: string | null;
  title: string;
  content: string | null;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/** 업무 생성 입력 */
export type TaskCreateInput = {
  employeeId: string;
  attendanceId?: string;
  title: string;
  content?: string;
  startTime?: Date;
  endTime?: Date;
};

/** 업무 수정 입력 */
export type TaskUpdateInput = Partial<Omit<TaskCreateInput, 'employeeId'>>;