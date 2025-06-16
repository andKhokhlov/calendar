import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiAppearance } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';

@Component({
  selector: 'app-mobile-teacher-schedule',
  standalone: true,
  imports: [CommonModule, TuiCardLarge, TuiAppearance, TuiBadge],
  templateUrl: './mobile-teacher-schedule.component.html',
  styleUrls: ['./mobile-teacher-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileTeacherScheduleComponent implements OnInit {
  @Input() schedule: any[] = [];

  days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  currentDayIndex = 0;

  // Фиксированные временные слоты для разных типов дней
  mondayTimes = [
    { name: '8:30-10:05' },
    { name: '10:15-11:50' },
    { name: '12:30-14:05' },
    { name: '14:15-15:50' },
    { name: '16:00-17:35' },
  ];

  saturdayTimes = [
    { name: '8:30-10:05' },
    { name: '10:15-11:50' },
    { name: '12:30-14:05' },
  ];

  otherDayTimes = [
    { name: '8:30-10:05' },
    { name: '10:15-11:50' },
    { name: '12:30-14:05' },
    { name: '14:15-15:50' },
    { name: '16:00-17:35' },
    { name: '17:45-19:20' },
  ];

  ngOnInit(): void {
    this.groupScheduleByDay();
  }

  get uniqueTimes(): string[] {
    const currentDay = this.days[this.currentDayIndex];
    let timesForCurrentDay: { name: string }[] = [];

    if (currentDay === 'Понедельник') {
      timesForCurrentDay = this.mondayTimes;
    } else if (currentDay === 'Суббота') {
      timesForCurrentDay = this.saturdayTimes;
    } else {
      timesForCurrentDay = this.otherDayTimes;
    }
    return timesForCurrentDay
      .map((t) => t.name)
      .sort((a, b) => this.sortByTime(a, b));
  }

  groupedScheduleByDay: { [day: string]: any[] } = {};

  groupScheduleByDay() {
    this.groupedScheduleByDay = {};
    for (const day of this.days) {
      this.groupedScheduleByDay[day] = this.schedule
        .filter((item) => item.day === day)
        .sort((a, b) => this.sortByTime(a.time, b.time));
    }
  }

  getSubjectForTime(day: string, time: string): any | null {
    const daySchedule = this.groupedScheduleByDay[day] || [];
    return daySchedule.find((item) => item.time === time) || null;
  }

  sortByTime(a: string, b: string): number {
    const [aStart] = a.split('-').map((t) => this.convertTimeToMinutes(t));
    const [bStart] = b.split('-').map((t) => this.convertTimeToMinutes(t));
    return aStart - bStart;
  }

  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

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

  // Mobile navigation
  nextDay() {
    if (this.currentDayIndex < this.days.length - 1) {
      this.currentDayIndex++;
    }
  }

  prevDay() {
    if (this.currentDayIndex > 0) {
      this.currentDayIndex--;
    }
  }
}
