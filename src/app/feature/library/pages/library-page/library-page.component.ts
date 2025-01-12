import { Component } from '@angular/core';
import { Track } from "../../../../core/models/track.model";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { selectAllTracks } from "../../../store/track.selectors";
import { LibraryCategoriesComponent } from "../../components/library-categories/library-categories.component";
import { LibraryListComponent } from "../../components/library-list/library-list.component";
import { NavbarComponent } from "../../../../shared/layout/navbar/navbar.component";
import { FormsModule } from "@angular/forms";
import { AsyncPipe } from "@angular/common";
import { SearchTrackPipe } from "../../../../shared/pipe/search-track.pipe";

@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [
    LibraryCategoriesComponent,
    LibraryListComponent,
    NavbarComponent,
    FormsModule,
    AsyncPipe,
    SearchTrackPipe
  ],
  templateUrl: './library-page.component.html',
  styleUrl: './library-page.component.scss'
})
export class LibraryPageComponent {
  searchQuery: string = '';
  tracks$: Observable<Track[]>;

  constructor(private store: Store) {
    this.tracks$ = this.store.select(selectAllTracks);
  }
}
