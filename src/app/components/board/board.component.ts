import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiStringifyContentPipe,
} from '@taiga-ui/kit';
import {
  TuiComboBoxModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { TuiTable } from '@taiga-ui/addon-table';
import { CalendarComponent } from '../calendar/calendar.component';
import { NgForOf, NgIf } from '@angular/common';
import {
  TuiBlockStatus,
  TuiCardLarge,
  TuiCell,
  TuiHeader,
} from '@taiga-ui/layout';
import { TuiAppearance } from '@taiga-ui/core';
import { ScheduleService } from '../../service/schedule.service';
import { Subject, ScheduleDay } from '../../models/subject.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiComboBoxModule,
    TuiStringifyContentPipe,
    ReactiveFormsModule,
    TuiTable,
    CalendarComponent,
    NgIf,
    TuiCardLarge,
    TuiAppearance,
    TuiBlockStatus,
    NgForOf,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  protected readonly control = new FormControl<{
    name: string;
    key: string; // Добавим ключ для специальности
  } | null>(null);

  protected readonly control2 = new FormControl<{
    name: string;
  } | null>(null);

  protected readonly items = [
    { name: '15.02.17', key: 'specialty1' },
    { name: '21.02.03', key: 'specialty2' },
    { name: '38.02.01', key: 'specialty3' },
    { name: '23.02.07', key: 'specialty4' },
    { name: '09.02.07', key: 'specialty5' },
    { name: '22.02.03', key: 'specialty6' },
    { name: '08.02.01', key: 'specialty7' },
    { name: '18.02.09', key: 'specialty8' },
    { name: '08.02.08', key: 'specialty9' },
  ];

  protected readonly groups = [
    { name: '21М-1', specialtyKey: 'specialty1' },
    { name: '22М-1', specialtyKey: 'specialty1' },
    { name: '23М-1', specialtyKey: 'specialty1' },
    { name: '24М-1', specialtyKey: 'specialty1' },

    { name: '21Г-1', specialtyKey: 'specialty2' },
    { name: '22Г-1', specialtyKey: 'specialty2' },
    { name: '23Г-1', specialtyKey: 'specialty2' },
    { name: '24Г-1', specialtyKey: 'specialty2' },

    { name: '21Э-1', specialtyKey: 'specialty3' },
    { name: '22Э-1', specialtyKey: 'specialty3' },
    { name: '23Э-1', specialtyKey: 'specialty3' },
    { name: '24Э-1', specialtyKey: 'specialty3' },

    { name: '21А-1', specialtyKey: 'specialty4' },
    { name: '22А-1', specialtyKey: 'specialty4' },
    { name: '23А-1', specialtyKey: 'specialty4' },
    { name: '24А-1', specialtyKey: 'specialty4' },

    { name: '21И-1', specialtyKey: 'specialty5' },
    { name: '22И-1', specialtyKey: 'specialty5' },
    { name: '23И-1', specialtyKey: 'specialty5' },
    { name: '24И-1', specialtyKey: 'specialty5' },

    { name: '21Л-1', specialtyKey: 'specialty6' },
    { name: '22Л-1', specialtyKey: 'specialty6' },
    { name: '23Л-1', specialtyKey: 'specialty6' },
    { name: '24Л-1', specialtyKey: 'specialty6' },

    { name: '21С-1', specialtyKey: 'specialty7' },
    { name: '22С-1', specialtyKey: 'specialty7' },
    { name: '23С-1', specialtyKey: 'specialty7' },
    { name: '24С-1', specialtyKey: 'specialty7' },

    { name: '21Н-1', specialtyKey: 'specialty8' },
    { name: '22Н-1', specialtyKey: 'specialty8' },
    { name: '23Н-1', specialtyKey: 'specialty8' },
    { name: '24Н-1', specialtyKey: 'specialty8' },

    { name: '21П-1', specialtyKey: 'specialty9' },
    { name: '22П-1', specialtyKey: 'specialty9' },
    { name: '23П-1', specialtyKey: 'specialty9' },
    { name: '24П-1', specialtyKey: 'specialty9' },
  ];

  // Изменен тип schedule на ScheduleDay[]
  schedule: ScheduleDay[] = [];

  // Порядок дней недели для календаря
  private readonly daysOrder = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
  ];

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.load();

    this.control.valueChanges.subscribe((value) => {
      this.availableGroups = value
        ? this.groups.filter((group) => group.specialtyKey === value.key)
        : [];
    });

    this.control2.valueChanges.subscribe((group) => {
      this.filteredSchedule = group
        ? this.filterScheduleByGroup(group.name)
        : [];
    });
  }

  load() {
    this.scheduleService.getAll().subscribe((data: Subject[]) => {
      // Преобразуем плоский массив в ScheduleDay[]
      const groupedSchedule: { [key: string]: Subject[] } = {};
      this.daysOrder.forEach((day) => (groupedSchedule[day] = [])); // Инициализируем все дни пустыми массивами

      data.forEach((item: Subject) => {
        // Указываем тип item как Subject
        const dayName = item.day;
        if (dayName && groupedSchedule[dayName]) {
          groupedSchedule[dayName].push({
            ...item,
            icon: item.icon || 'assets/icons/default.svg',
          });
        }
      });

      // Преобразуем объект в массив ScheduleDay[] и сортируем по дням недели
      this.schedule = this.daysOrder.map((day) => ({
        day: day,
        subjects: groupedSchedule[day],
      }));

      // Принудительно обновляем отфильтрованное расписание после загрузки
      if (this.control2.value) {
        this.filteredSchedule = this.filterScheduleByGroup(
          this.control2.value.name
        );
      } else {
        this.filteredSchedule = this.schedule;
      }
    });
  }

  private filterScheduleByGroup(groupName: string): ScheduleDay[] {
    return this.schedule.map((day) => ({
      ...day,
      subjects:
        day.subjects?.filter((subject) => subject.group === groupName) || [],
    }));
  }

  protected readonly stringify = (item: { name: string }): string => item.name;
  protected readonly stringify2 = (group: { name: string }): string =>
    group.name;
  protected availableGroups: { name: string }[] = [];
  protected filteredSchedule: ScheduleDay[] = []; // Изменен тип
}
