import { Component, OnInit } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy/components';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss'],
  standalone: true,
  imports: [TuiInputModule, TuiButton],
})
export class AdminpanelComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
