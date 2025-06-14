import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TuiComboBoxModule } from '@taiga-ui/legacy';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiButton } from '@taiga-ui/core';
import {
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiStringifyContentPipe,
  TuiBadge,
} from '@taiga-ui/kit';
import { HostListener } from '@angular/core';
import { MobileTeacherScheduleComponent } from '../mobile-teacher-schedule/mobile-teacher-schedule.component';

@Component({
  selector: 'app-teacher-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiComboBoxModule,
    TuiTable,
    TuiButton,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiStringifyContentPipe,
    TuiBadge,
    MobileTeacherScheduleComponent,
  ],
  templateUrl: './teacher-schedule.component.html',
  styleUrls: ['./teacher-schedule.component.scss'],
})
export class TeacherScheduleComponent implements OnInit {
  teachers: string[] = [];
  selectedTeacher: string | null = null;
  schedule: any[] = [];
  loading = false;
  isMobile = false;
  daysOfWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];
  uniqueTimes: string[] = [];
  groupedSchedule: { [day: string]: { [time: string]: any } } = {};

  constructor(private http: HttpClient) {}

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.fetchTeachers();
    this.checkScreenSize();
  }

  fetchTeachers() {
    this.http.get<string[]>('/api/schedule/teachers').subscribe(
      (data) => {
        this.teachers = data; // Теперь данные уже чистые с бэкенда
      },
      (error) => {
        console.error('Ошибка при получении преподавателей:', error);
      }
    );
  }

  onTeacherSelect(teacher: string) {
    this.selectedTeacher = teacher;
    this.fetchSchedule(teacher);
  }

  fetchSchedule(teacher: string) {
    this.loading = true;
    this.http
      .get<any[]>(`/api/schedule/teacher/${encodeURIComponent(teacher)}`)
      .subscribe(
        (data) => {
          this.schedule = data;
          this.prepareTableData();
          this.loading = false;
        },
        (error) => {
          console.error('Ошибка при получении расписания:', error);
          this.loading = false;
        }
      );
  }

  prepareTableData() {
    // Собираем уникальные времена занятий
    const times = new Set<string>();
    this.groupedSchedule = {};
    for (const day of this.daysOfWeek) {
      this.groupedSchedule[day] = {};
    }
    for (const item of this.schedule) {
      times.add(item.time);
      if (!this.groupedSchedule[item.day]) {
        this.groupedSchedule[item.day] = {};
      }
      this.groupedSchedule[item.day][item.time] = item;
    }
    this.uniqueTimes = Array.from(times).sort((a, b) => this.sortByTime(a, b));
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

  stringify = (item: string | null | undefined): string => item || '';

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

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
}
