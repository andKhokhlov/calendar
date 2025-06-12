import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Subject } from '../models/subject.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  constructor(private http: HttpClient, private auth: AuthService) {}

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
}
