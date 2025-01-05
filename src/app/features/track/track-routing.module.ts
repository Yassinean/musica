import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackFormComponent } from './components/track-form/track-form.component';
import { TrackDetailComponent } from './components/track-detail/track-detail.component';

const routes: Routes = [
  { path: 'form', component: TrackFormComponent },
  { path: 'detail/:id', component: TrackDetailComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackRoutingModule { }
