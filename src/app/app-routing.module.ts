import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'library',
    loadChildren: () =>
      import('./features/library/library.module').then((m) => m.LibraryModule),
  },
  {
    path: 'track',
    loadChildren: () =>
      import('./features/track/track.module').then((m) => m.TrackModule),
  },
  {
    path: 'player',
    loadChildren: () =>
      import('./features/player/player.module').then((m) => m.PlayerModule),
  },
  { path: '', redirectTo: 'library', pathMatch: 'full' },
  { path: '**', redirectTo: 'library' }, // Handle invalid routes
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
