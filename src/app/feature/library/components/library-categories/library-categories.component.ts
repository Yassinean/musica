import { Component } from '@angular/core';
import {MusicCategory} from "../../../../core/models/track.model";
import {NgSwitch} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-library-categories',
  standalone: true,
  imports: [
    NgSwitch,
    RouterLink
  ],
  templateUrl: './library-categories.component.html',
  styleUrl: './library-categories.component.scss'
})
export class LibraryCategoriesComponent {
  musicCategory = MusicCategory;
  protected readonly Object = Object;
}
