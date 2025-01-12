import { Component } from '@angular/core';
import { MusicCategory } from "../../../../core/models/track.model";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as TrackActions from "../../../store/track.actions";
import { map } from 'rxjs/operators';
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {selectSelectedCategory} from "../../../store/track.selectors";
import {AsyncPipe, KeyValuePipe, NgForOf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-library-categories',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    TitleCasePipe,
    AsyncPipe,
    KeyValuePipe,
    NgForOf
  ],
  templateUrl: './library-categories.component.html',
  styleUrls: ['./library-categories.component.scss']  // Fixed typo: changed 'styleUrl' to 'styleUrls'
})
export class LibraryCategoriesComponent {
  musicCategory = MusicCategory;
  selectedCategory$: Observable<MusicCategory | null>;

  constructor(private readonly store: Store) {
    this.selectedCategory$ = this.store.select(selectSelectedCategory);
  }

  filterByCategory(category: MusicCategory | null): void {
    this.store.dispatch(TrackActions.setSelectedCategory({category}));
  }

  isSelectedCategory(category: MusicCategory): boolean {
    let isSelected = false;
    this.selectedCategory$.subscribe(selected => {
      isSelected = selected === category;
    });
    return isSelected;
  }
}
