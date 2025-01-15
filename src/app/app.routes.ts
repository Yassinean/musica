import { Routes } from '@angular/router';
import { FavoritesPageComponent } from './feature/favorites/favorites-page.component';

export const routes: Routes = [
  {
    path: 'library',
    loadComponent: () =>
      import('./feature/library/pages/library-page/library-page.component').then(m => m.LibraryPageComponent),
  },
  {
    path: 'tracks',
    loadComponent: () =>
      import('./feature/track/pages/add-track/add-track.component').then(m => m.AddTrackComponent),
  },
  {
    path: 'track/:id',
    loadComponent: () =>
      import('./feature/track/components/track-detail/track-detail.component').then(m => m.TrackDetailComponent),
  },
  {
    path: 'track/edit/:id',
    loadComponent: () =>
      import('./feature/track/pages/update-track/update-track.component').then(m => m.UpdateTrackComponent),
  },
  {
    path: 'favorites',
    component: FavoritesPageComponent,
    title: 'Favorites'
  },
  {
    path: '',
    redirectTo: 'library',
    pathMatch: 'full',
  },
];
