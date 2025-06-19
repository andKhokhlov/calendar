import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { MobileReplacementsComponent } from './mobile-replacements.component';

@Component({
  selector: 'app-replacements',
  standalone: true,
  imports: [NgIf, MobileReplacementsComponent],
  templateUrl: './replacements.component.html',
  styleUrls: ['./replacements.component.scss'],
})
export class ReplacementsComponent implements OnInit {
  imageUrl: string | null = null;
  loading = true;
  notFound = false;
  isMobile = false;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.isMobile = window.innerWidth <= 600;
    if (!this.isMobile) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      this.scheduleService.getImage('replacement', dateStr).subscribe({
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
  }

  goBack() {
    window.history.back();
  }
}
