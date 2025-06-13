import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-week-indicator',
  standalone: true,
  templateUrl: './week-indicator.component.html',
  imports: [CommonModule],
  styleUrls: ['./week-indicator.component.scss'],
})
export class WeekIndicatorComponent implements OnInit {
  currentWeekType: 'numerator' | 'denominator' = 'numerator';
  weekTypeText: { [key: string]: string } = {
    numerator: 'Числитель',
    denominator: 'Знаменатель',
  };

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.currentWeekType = this.scheduleService.getCurrentWeekType();
  }
}
