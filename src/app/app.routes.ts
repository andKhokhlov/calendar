import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { BoardComponent } from './components/board/board.component';
import { ActorComponent } from './components/actor/actor.component';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: BoardComponent },
      { path: 'actor', component: ActorComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminpanelComponent,
  },
];
