import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ScheduleService } from '../../service/schedule.service';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiStringifyContentPipe,
} from '@taiga-ui/kit';

import {
  TuiInputModule,
  TuiComboBoxModule,
  TuiInputDateModule,
} from '@taiga-ui/legacy';

import { TuiDay } from '@taiga-ui/cdk';

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
    TuiInputDateModule,
    TuiTextfield,
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

  uploadTypes = [
    { name: 'Замена', value: 'replacement' as const },
    { name: 'Сессия', value: 'session' as const },
  ];
  uploadType: { name: string; value: 'replacement' | 'session' } | null = null;
  uploadTuiDate: TuiDay | null = null;
  uploadFile: File = new File([''], '');
  uploadPreview: string | null = null;
  uploading = false;
  uploadStatus: string = '';
  isDragOver = false;

  activeTab: 'schedule' | 'images' = 'schedule';

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadPreview = e.target.result;
      };
      reader.readAsDataURL(this.uploadFile);
    } else {
      this.uploadFile = new File([''], '');
      this.uploadPreview = null;
    }
  }

  onFileSelectedTaiga(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.validateFile(file)) {
        this.uploadFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadPreview = e.target.result;
        };
        reader.readAsDataURL(this.uploadFile);
        this.uploadStatus = '';
      }
    } else {
      this.uploadFile = new File([''], '');
      this.uploadPreview = null;
    }
  }

  private validateFile(file: File): boolean {
    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      this.uploadStatus =
        'Пожалуйста, выберите изображение (.jpg, .jpeg, .png)';
      return false;
    }

    // Проверяем размер файла (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.uploadStatus = 'Размер файла не должен превышать 5MB';
      return false;
    }

    return true;
  }

  onUploadImage() {
    if (!this.uploadFile.name || !this.uploadType) {
      return;
    }

    const uploadDate = this.uploadTuiDate
      ? this.uploadTuiDate.getFormattedDay('YMD', '-')
      : '';

    // Для сессии дата не требуется
    if (this.uploadType.value === 'replacement' && !uploadDate) {
      return;
    }

    this.uploading = true;
    this.uploadStatus = '';

    // Для сессии используем пустую строку как дату
    const dateToUse = this.uploadType.value === 'session' ? '' : uploadDate;

    this.scheduleService
      .uploadImage(this.uploadType.value, dateToUse, this.uploadFile)
      .subscribe({
        next: () => {
          this.uploadStatus = 'Картинка успешно загружена!';
          this.uploading = false;
          this.uploadFile = new File([''], '');
          this.uploadPreview = null;
        },
        error: (err) => {
          this.uploadStatus =
            'Ошибка загрузки: ' + (err.error?.message || err.statusText);
          this.uploading = false;
        },
      });
  }

  setTab(tab: 'schedule' | 'images') {
    this.activeTab = tab;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.validateFile(file)) {
        this.uploadFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadPreview = e.target.result;
        };
        reader.readAsDataURL(this.uploadFile);
        this.uploadStatus = '';
      }
    }
  }
}
