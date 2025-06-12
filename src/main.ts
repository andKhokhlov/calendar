import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { TuiRoot } from '@taiga-ui/core';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; // ✅

bootstrapApplication(AppComponent, {
  providers: [
    TuiRoot,
    NG_EVENT_PLUGINS,
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule), // ✅ добавлено
  ],
}).catch((err) => console.error(err));
