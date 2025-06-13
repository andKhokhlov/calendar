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
} from '@taiga-ui/kit';

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
  ],
  templateUrl: './teacher-schedule.component.html',
  styleUrls: ['./teacher-schedule.component.scss'],
})
export class TeacherScheduleComponent implements OnInit {
  teachers: string[] = [];
  selectedTeacher: string | null = null;
  schedule: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTeachers();
  }

  fetchTeachers() {
    this.http.get<string[]>('/api/schedule/teachers').subscribe(
      (data) => {
        console.log('Полученные преподаватели:', data);
        this.teachers = data;
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
          console.log('Расписание для', teacher, ':', data);
          this.schedule = data;
          this.loading = false;
        },
        (error) => {
          console.error('Ошибка при получении расписания:', error);
          this.loading = false;
        }
      );
  }

  stringify = (item: string | null | undefined): string => item || '';
}
