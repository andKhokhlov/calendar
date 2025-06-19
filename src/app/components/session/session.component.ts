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
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    this.scheduleService.getImage('session', dateStr).subscribe({
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
