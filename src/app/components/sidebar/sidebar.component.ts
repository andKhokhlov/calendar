import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [TuiAvatar, TuiIcon, TuiButton, RouterModule, NgForOf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuItems = [
    {
      label: 'Расписание',
      icon: 'home',
      link: '',
    },
    {
      label: 'Преподаватели',
      icon: '',
      link: 'actor',
    },
  ];
}
