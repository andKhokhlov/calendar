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

  ngOnInit(): void {
    // Ensure initial schedule processing happens if data is already available
    this.groupScheduleByDay();
  }

  get uniqueTimes(): string[] {
    const times = new Set<string>();
    this.schedule.forEach((item) => times.add(item.time));
    return Array.from(times).sort((a, b) => this.sortByTime(a, b));
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
