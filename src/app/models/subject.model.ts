export interface Subject {
  id: number;
  subject: string;
  time: string;
  group: string;
  teacher: string;
  day: string;
  icon?: string; // Поле icon сделано опциональным, так как оно не приходит с бэкенда
}

export interface ScheduleDay {
  day: string;
  subjects: Subject[];
}
