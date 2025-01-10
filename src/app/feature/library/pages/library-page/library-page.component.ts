import { Component,Input } from '@angular/core';
import { Track } from "../../../../core/models/track.model"; // Assuming you have this model.
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { selectSelectedCategory } from "../../../store/track.selectors";
import * as TrackActions from "../../../store/track.actions";
import { LibraryCategoriesComponent } from "../../components/library-categories/library-categories.component";
import { LibraryListComponent } from "../../components/library-list/library-list.component";
import { NavbarComponent } from "../../../../shared/layout/navbar/navbar.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [
    LibraryCategoriesComponent,
    LibraryListComponent,
    NavbarComponent,
    FormsModule
  ],
  templateUrl: './library-page.component.html',
  styleUrl: './library-page.component.scss'
})
export class LibraryPageComponent {

  constructor() {}
}
