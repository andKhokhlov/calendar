import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiAppearance } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge } from '@taiga-ui/kit';
import { Subject, ScheduleDay } from '../../models/subject.model';
import { MobileCalendarComponent } from '../mobile-calendar/mobile-calendar.component';
import { WeekIndicatorComponent } from '../week-indicator/week-indicator.component';

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
    MobileCalendarComponent,
    WeekIndicatorComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  @Input() schedule: ScheduleDay[] = [];
  isMobile = false;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

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
