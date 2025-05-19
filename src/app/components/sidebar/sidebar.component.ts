import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { TuiButton, TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    TuiAvatar,
    TuiIcon,
    TuiButton,
    RouterModule,
    NgForOf,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    TuiTitle,
  ],
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
