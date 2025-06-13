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
import { TuiAppearance, TuiButton } from '@taiga-ui/core';
import { ScheduleService } from '../../service/schedule.service';
import { Subject, ScheduleDay } from '../../models/subject.model';
import { PinnedGroupsService } from '../../service/pinned-groups.service';

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
    TuiButton,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  protected readonly control = new FormControl<{
    name: string;
    key: string;
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

  schedule: ScheduleDay[] = [];
  protected availableGroups: { name: string }[] = [];
  protected filteredSchedule: ScheduleDay[] = [];
  protected pinnedGroups: string[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private pinnedGroupsService: PinnedGroupsService
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadPinnedGroups();

    this.control.valueChanges.subscribe((value) => {
      this.control2.setValue(null);

      this.availableGroups = value
        ? this.groups.filter((group) => group.specialtyKey === value.key)
        : [];

      // Проверяем, есть ли закрепленная группа для текущей специальности
      if (value) {
        const pinnedGroup = this.availableGroups.find((g) =>
          this.pinnedGroups.includes(g.name)
        );
        if (pinnedGroup) {
          this.control2.setValue(pinnedGroup);
        }
      }
    });

    this.control2.valueChanges.subscribe((group) => {
      this.filteredSchedule = group
        ? this.filterScheduleByGroup(group.name)
        : [];
    });
  }

  private loadPinnedGroups(): void {
    this.pinnedGroupsService.getPinnedGroups().subscribe((groups) => {
      this.pinnedGroups = groups;
    });
  }

  navigateToPinnedGroup(groupName: string): void {
    const pinnedGroup = this.groups.find((g) => g.name === groupName);
    if (pinnedGroup) {
      // Сначала выбираем специальность
      const specialty = this.items.find(
        (item) => item.key === pinnedGroup.specialtyKey
      );
      if (specialty) {
        this.control.setValue(specialty);
        // Затем выбираем группу
        setTimeout(() => {
          const group = this.availableGroups.find((g) => g.name === groupName);
          if (group) {
            this.control2.setValue(group);
          }
        }, 0);
      }
    }
  }

  load() {
    this.scheduleService.getAll().subscribe((data: Subject[]) => {
      const groupedSchedule: { [key: string]: Subject[] } = {};
      this.daysOrder.forEach((day) => (groupedSchedule[day] = []));

      data.forEach((item: Subject) => {
        const dayName = item.day;
        if (dayName && groupedSchedule[dayName]) {
          groupedSchedule[dayName].push({
            ...item,
            icon: item.icon || 'assets/icons/default.svg',
          });
        }
      });

      this.schedule = this.daysOrder.map((day) => ({
        day: day,
        subjects: groupedSchedule[day],
      }));

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

  togglePinGroup(groupName: string): void {
    this.pinnedGroupsService.togglePinGroup(groupName);
    this.loadPinnedGroups();
  }

  isGroupPinned(groupName: string): boolean {
    return this.pinnedGroups.includes(groupName);
  }

  protected readonly stringify = (item: { name: string }): string => item.name;
  protected readonly stringify2 = (group: { name: string }): string =>
    group.name;

  protected readonly daysOrder = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];
}
