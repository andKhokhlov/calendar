import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { BoardComponent } from './components/board/board.component';
import { ActorComponent } from './components/actor/actor.component';
// import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';
import { AdminGuard } from './guard/admin.guard';
import { AdminLoginComponent } from './components/admin-login/admin-login/admin-login.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { TeacherScheduleComponent } from './components/teacher-schedule/teacher-schedule.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: BoardComponent },
      { path: 'actor', component: ActorComponent },
      { path: 'teacher-schedule', component: TeacherScheduleComponent },
    ],
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent,
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AdminGuard],
  },
];
