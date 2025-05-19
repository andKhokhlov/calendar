import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiAppearance } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge } from '@taiga-ui/kit';

interface Subject {
  name: string;
  teacher: string;
  icon: string;
  group: string;
  time: string;
}

interface ScheduleDay {
  day: string;
  subjects: Subject[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    TuiCardLarge,
    NgFor,
    TuiAppearance,
    TuiBadge,
    TuiAvatar,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  @Input() schedule: ScheduleDay[] = [];

  getSubjectsTime(row: ScheduleDay): string {
    return row.subjects.map((subject) => subject.time).join(', ');
  }

  days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  // Уникальные времена занятий с сортировкой
  get uniqueTimes(): string[] {
    const times = new Set<string>();
    this.schedule.forEach((day) =>
      day.subjects.forEach((subject) => times.add(subject.time))
    );

    return Array.from(times).sort((a, b) => this.sortByTime(a, b));
  }

  // Получаем предмет для конкретного дня и времени
  getSubjectByDayAndTime(day: string, time: string) {
    const scheduleDay = this.schedule.find((d) => d.day === day);
    return scheduleDay?.subjects.find((s) => s.time === time) || null;
  }

  // Функция сортировки по времени
  private sortByTime(a: string, b: string): number {
    const [aStart] = a.split('-').map((t) => this.convertTimeToMinutes(t));
    const [bStart] = b.split('-').map((t) => this.convertTimeToMinutes(t));

    return aStart - bStart;
  }

  // Преобразуем время в минуты
  private convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
