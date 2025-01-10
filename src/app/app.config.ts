import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideStore} from "@ngrx/store";
import {trackReducer} from "./feature/store/track.reducers";
import {provideEffects} from "@ngrx/effects";
import {TrackEffects} from "./feature/store/track.effects";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideImageKitLoader} from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideStore({tracks: trackReducer,}), provideEffects([TrackEffects]) , provideAnimations() ,provideImageKitLoader('https://res.cloudinary.com/dz4pww2qv')]
};
