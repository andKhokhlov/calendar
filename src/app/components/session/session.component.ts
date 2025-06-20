import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';

@Component({
  selector: 'app-session',
  standalone: true,
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  imageUrl: string | null = null;
  loading = true;
  notFound = false;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    // Загружаем одну картинку для сессии без привязки к дате
    this.scheduleService.getImage('session', 'current').subscribe({
      next: (blob) => {
        this.imageUrl = URL.createObjectURL(blob);
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      },
    });
  }

  goBack() {
    window.history.back();
  }
}
