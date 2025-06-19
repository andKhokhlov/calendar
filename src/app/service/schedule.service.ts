import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Subject } from '../models/subject.model';
import { BehaviorSubject } from 'rxjs';
import {
  WeeklySchedule,
  WeeklySubject,
  getCurrentWeekType,
} from '../models/schedule.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private scheduleSubject = new BehaviorSubject<WeeklySchedule>({
    numerator: [],
    denominator: [],
  });

  constructor(private http: HttpClient, private auth: AuthService) {
    // Initialize with empty schedule
    this.loadSchedule();
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.getToken()}`,
      }),
    };
  }

  getAll(): Observable<Subject[]> {
    return this.http.get<Subject[]>('/api/schedule');
  }

  create(schedule: Subject) {
    return this.http.post<Subject>(
      '/api/schedule',
      schedule,
      this.getHeaders()
    );
  }

  update(id: number, schedule: Subject) {
    return this.http.put<Subject>(
      `/api/schedule/${id}`,
      schedule,
      this.getHeaders()
    );
  }

  delete(id: number) {
    return this.http.delete<Subject>(`/api/schedule/${id}`, this.getHeaders());
  }

  private loadSchedule(): void {
    // Here you would typically load the schedule from your backend
    // For now, we'll use a sample schedule
    const sampleSchedule: WeeklySchedule = {
      numerator: [
        {
          day: 'Понедельник',
          subjects: [
            {
              numerator: 'Химия',
              denominator: 'ОБЖ',
              time: '9:00-10:30',
              group: 'Группа 1',
              teacher: 'Иванов И.И.',
              day: 'Понедельник',
            },
            // Add more subjects as needed
          ],
        },
        // Add more days as needed
      ],
      denominator: [
        {
          day: 'Понедельник',
          subjects: [
            {
              numerator: 'Химия',
              denominator: 'ОБЖ',
              time: '9:00-10:30',
              group: 'Группа 1',
              teacher: 'Иванов И.И.',
              day: 'Понедельник',
            },
            // Add more subjects as needed
          ],
        },
        // Add more days as needed
      ],
    };

    this.scheduleSubject.next(sampleSchedule);
  }

  getCurrentSchedule(): Observable<WeeklySchedule> {
    return this.scheduleSubject.asObservable();
  }

  getCurrentWeekType(): 'numerator' | 'denominator' {
    return getCurrentWeekType();
  }

  getSubjectsForDay(day: string): WeeklySubject[] {
    const currentWeekType = this.getCurrentWeekType();
    const schedule = this.scheduleSubject.value;
    const daySchedule = schedule[currentWeekType].find((d) => d.day === day);
    return daySchedule ? daySchedule.subjects : [];
  }

  addSubject(subject: WeeklySubject): void {
    const schedule = this.scheduleSubject.value;
    const dayIndex = schedule.numerator.findIndex((d) => d.day === subject.day);

    if (dayIndex === -1) {
      // Add new day
      schedule.numerator.push({ day: subject.day, subjects: [subject] });
      schedule.denominator.push({ day: subject.day, subjects: [subject] });
    } else {
      // Add subject to existing day
      schedule.numerator[dayIndex].subjects.push(subject);
      schedule.denominator[dayIndex].subjects.push(subject);
    }

    this.scheduleSubject.next(schedule);
  }

  updateSubject(updatedSubject: WeeklySubject): void {
    const schedule = this.scheduleSubject.value;
    const dayIndex = schedule.numerator.findIndex(
      (d) => d.day === updatedSubject.day
    );

    if (dayIndex !== -1) {
      const subjectIndex = schedule.numerator[dayIndex].subjects.findIndex(
        (s) =>
          s.time === updatedSubject.time && s.group === updatedSubject.group
      );

      if (subjectIndex !== -1) {
        schedule.numerator[dayIndex].subjects[subjectIndex] = updatedSubject;
        schedule.denominator[dayIndex].subjects[subjectIndex] = updatedSubject;
        this.scheduleSubject.next(schedule);
      }
    }
  }

  deleteSubject(day: string, time: string, group: string): void {
    const schedule = this.scheduleSubject.value;
    const dayIndex = schedule.numerator.findIndex((d) => d.day === day);

    if (dayIndex !== -1) {
      schedule.numerator[dayIndex].subjects = schedule.numerator[
        dayIndex
      ].subjects.filter((s) => !(s.time === time && s.group === group));
      schedule.denominator[dayIndex].subjects = schedule.denominator[
        dayIndex
      ].subjects.filter((s) => !(s.time === time && s.group === group));
      this.scheduleSubject.next(schedule);
    }
  }

  uploadImage(type: 'replacement' | 'session', date: string, file: File) {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('date', date);
    formData.append('file', file);
    return this.http.post('/api/schedule/image', formData, this.getHeaders());
  }

  getImage(type: 'replacement' | 'session', date: string) {
    return this.http.get(`/api/schedule/image?type=${type}&date=${date}`, {
      responseType: 'blob',
    });
  }
}
