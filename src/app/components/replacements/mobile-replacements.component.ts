import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-mobile-replacements',
  standalone: true,
  templateUrl: './mobile-replacements.component.html',
  styleUrls: ['./mobile-replacements.component.scss'],
  imports: [NgIf, NgClass],
})
export class MobileReplacementsComponent implements OnInit {
  imageUrl: string | null = null;
  loading = true;
  notFound = false;
  isModalOpen = false;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
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

  goBack() {
    window.history.back();
  }

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
}
