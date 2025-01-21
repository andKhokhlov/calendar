import { AsyncPipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import {
  TuiAppearance,
  TuiButton,
  TuiFormatNumberPipe,
  TuiTitle,
} from '@taiga-ui/core';
import { schedule } from '../../data/schedule';
import { TuiCardLarge, TuiCell, TuiHeader } from '@taiga-ui/layout';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    TuiTable,
    TuiFormatNumberPipe,
    AsyncPipe,
    NgForOf,
    TuiCardLarge,
    TuiAppearance,
    TuiButton,
    TuiTitle,
    TuiHeader,
    TuiAvatar,
    TuiCell,
    TuiHeader,
    TuiTitle,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  @Input() schedule: typeof schedule = schedule;
  constructor() {}

  ngOnInit() {}
}
