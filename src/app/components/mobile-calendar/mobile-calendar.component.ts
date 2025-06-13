import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiAppearance } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge } from '@taiga-ui/kit';
import { Subject, ScheduleDay } from '../../models/subject.model';
import { WeekIndicatorComponent } from '../week-indicator/week-indicator.component';

@Component({
  selector: 'app-mobile-calendar',
  standalone: true,
  imports: [
    CommonModule,
    TuiCardLarge,
    TuiAppearance,
    TuiBadge,
    TuiAvatar,
    WeekIndicatorComponent,
  ],
  templateUrl: './mobile-calendar.component.html',
  styleUrls: ['./mobile-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileCalendarComponent {
  @Input() schedule: ScheduleDay[] = [];

  currentDayIndex = 0;
  days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  // Уникальные времена занятий с сортировкой
  get uniqueTimes(): string[] {
    const times = new Set<string>();
    this.schedule.forEach((day) =>
      day.subjects.forEach((subject) => times.add(subject.time))
    );

    return Array.from(times).sort((a, b) => this.sortByTime(a, b));
  }

  // Получаем предметы для текущего дня
  getCurrentDaySubjects(): Subject[] {
    const currentDay = this.schedule.find(
      (d) => d.day === this.days[this.currentDayIndex]
    );
    return currentDay?.subjects || [];
  }

  // Получаем предмет для конкретного времени
  getSubjectForTime(time: string): Subject | undefined {
    return this.getCurrentDaySubjects().find((s) => s.time === time);
  }

  // Переключение на следующий день
  nextDay() {
    if (this.currentDayIndex < this.days.length - 1) {
      this.currentDayIndex++;
    }
  }

  // Переключение на предыдущий день
  prevDay() {
    if (this.currentDayIndex > 0) {
      this.currentDayIndex--;
    }
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

  // Генерируем цвет для карточки предмета на основе его названия
  getSubjectCardColor(subjectName: string): string {
    const colors = [
      'subject-card--color-1',
      'subject-card--color-2',
      'subject-card--color-3',
    ];
    let hash = 0;
    for (let i = 0; i < subjectName.length; i++) {
      hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  }
}
