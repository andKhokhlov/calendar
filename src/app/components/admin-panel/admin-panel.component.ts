import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ScheduleService } from '../../service/schedule.service';
import { TuiButton } from '@taiga-ui/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiStringifyContentPipe,
} from '@taiga-ui/kit';
import { TuiInputModule, TuiComboBoxModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  standalone: true,
  imports: [
    TuiButton,
    TuiInputModule,
    TuiTable,
    NgIf,
    FormsModule,
    HttpClientModule,
    NgForOf,
    TuiComboBoxModule,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiStringifyContentPipe,
  ],
})
export class AdminPanelComponent implements OnInit {
  schedule: any[] = [];
  filteredSchedule: any[] = [];
  selectedGroup: { name: string } | null = null;
  editing: any = null;
  newItem: any = {
    subject: '',
    time: null,
    group: null,
    teacher: '',
    day: null,
  };

  groups = [
    { name: '21М-1' },
    { name: '22М-1' },
    { name: '23М-1' },
    { name: '24М-1' },
    { name: '21Г-1' },
    { name: '22Г-1' },
    { name: '23Г-1' },
    { name: '24Г-1' },
    { name: '21Э-1' },
    { name: '22Э-1' },
    { name: '23Э-1' },
    { name: '24Э-1' },
    { name: '21А-1' },
    { name: '22А-1' },
    { name: '23А-1' },
    { name: '24А-1' },
    { name: '21И-1' },
    { name: '22И-1' },
    { name: '23И-1' },
    { name: '24И-1' },
    { name: '21Л-1' },
    { name: '22Л-1' },
    { name: '23Л-1' },
    { name: '24Л-1' },
    { name: '21С-1' },
    { name: '22С-1' },
    { name: '23С-1' },
    { name: '24С-1' },
    { name: '21Н-1' },
    { name: '22Н-1' },
    { name: '23Н-1' },
    { name: '24Н-1' },
    { name: '21П-1' },
    { name: '22П-1' },
    { name: '23П-1' },
    { name: '24П-1' },
  ];

  daysOfWeek = [
    { name: 'Понедельник' },
    { name: 'Вторник' },
    { name: 'Среда' },
    { name: 'Четверг' },
    { name: 'Пятница' },
    { name: 'Суббота' },
    { name: 'Воскресенье' },
  ];

  timeOfvs = [
    { name: '8:30-10:05' },
    { name: '10:15-11:50' },
    { name: '12:30-14:05' },
    { name: '14:15-15:50' },
    { name: '16:00-17:35' },
    { name: '17:45-19:20' },
  ];

  stringify = (item: { name: string } | null | undefined): string =>
    item?.name || '';

  constructor(
    private scheduleService: ScheduleService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.scheduleService.getAll().subscribe((data: any) => {
      this.schedule = data;
      this.filterSchedule();
    });
  }

  filterSchedule() {
    if (this.selectedGroup) {
      this.filteredSchedule = this.schedule.filter(
        (item) => item.group === this.selectedGroup?.name
      );
    } else {
      this.filteredSchedule = [];
    }
  }

  onGroupSelect(group: { name: string } | null) {
    this.selectedGroup = group;
    this.filterSchedule();
  }

  delete(id: number) {
    this.scheduleService.delete(id).subscribe(() => this.load());
  }

  edit(item: any) {
    this.editing = { ...item };
    this.editing.subject = item.subject || '';
    this.editing.time = this.timeOfvs.find((t) => t.name === item.time) || null;
    this.editing.teacher = item.teacher || '';
    this.editing.group = this.groups.find((g) => g.name === item.group) || null;
    this.editing.day = this.daysOfWeek.find((d) => d.name === item.day) || null;
  }

  saveEdit() {
    const scheduleToSave = {
      ...this.editing,
      time: this.editing.time?.name || null,
      group: this.editing.group?.name || null,
      day: this.editing.day?.name || null,
    };
    this.scheduleService
      .update(scheduleToSave.id, scheduleToSave)
      .subscribe(() => {
        this.editing = null;
        this.load();
      });
  }

  cancelEdit() {
    this.editing = null;
  }

  add() {
    const scheduleToAdd = {
      ...this.newItem,
      time: this.newItem.time?.name || null,
      group: this.newItem.group?.name || null,
      day: this.newItem.day?.name || null,
    };
    this.scheduleService.create(scheduleToAdd).subscribe(() => {
      this.newItem = {
        subject: '',
        time: null,
        group: null,
        teacher: '',
        day: null,
      };
      this.load();
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin-login']);
  }
}
