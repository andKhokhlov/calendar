export interface WeeklySubject {
  numerator: string; // Subject for numerator week
  denominator: string; // Subject for denominator week
  time: string;
  group: string;
  teacher: string;
  day: string;
  icon?: string;
}

export interface WeeklyScheduleDay {
  day: string;
  subjects: WeeklySubject[];
}

export interface WeeklySchedule {
  numerator: WeeklyScheduleDay[];
  denominator: WeeklyScheduleDay[];
}

// Helper function to determine current week type (numerator/denominator)
export function getCurrentWeekType(): 'numerator' | 'denominator' {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 +
      startOfYear.getDay() +
      1) /
      7
  );
  return weekNumber % 2 === 0 ? 'denominator' : 'numerator';
}
