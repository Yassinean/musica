import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MusicCategory, Track} from "../../../../core/models/track.model";
import {Store} from "@ngrx/store";
import * as TrackActions from "../../../store/track.actions";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {selectTrackById} from "../../../store/track.selectors";

@Component({
  selector: 'app-update-track',
  standalone: true,
    imports: [
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './update-track.component.html',
  styleUrl: './update-track.component.scss'
})
export class UpdateTrackComponent {

  trackForm!: FormGroup;
  track$!: Observable<Track | undefined>;
  imagePreview:string | null = null;
  categories: MusicCategory[] = Object.values(MusicCategory);
  selectedAudioFile!: File | null;

  constructor(private readonly formBuilder:FormBuilder ,
              private activateRoute:ActivatedRoute ,
              private store:Store ,
              private route:Router
  ) {
  }

  ngOnInit(): void {
    const trackId = this.activateRoute.snapshot.paramMap.get('id'); // Get ID from the route
    if (trackId) {
      // Dispatch an action or fetch the track using the store
      this.store.dispatch(TrackActions.loadTrack({ id: trackId }));

      // Subscribe to track$ to get the track data and initialize the form
      this.track$ = this.store.select(selectTrackById(trackId)); // Assuming you have a selector for tracks
      this.track$.subscribe(track => {
        if (track) {
          this.initializeForm(track); // Initialize form with track data
        }
      });
    }
  }

  initializeForm(track: Track): void {
    this.trackForm = this.formBuilder.group({
      title: [track.title, [Validators.required]],
      artist: [track.artist, [Validators.required]],
      description: [track.description],
      category: [track.category, [Validators.required]],
      audioFile: [null],
      imageFile: [null],
    });
    if (track.imageUrl) {
      this.imagePreview = track.imageUrl;
    }

    if (track.fileUrl) {
      this.selectedAudioFile = null;
    }
  }
  validateUpdateImageFile(file: File): boolean {
    const MAX_IMAGE_SIZE_MB = 5;
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image size exceeds ${MAX_IMAGE_SIZE_MB}MB. Please upload a smaller image.`);
      return false;
    }

    if (!allowedImageTypes.includes(file.type)) {
      alert("Invalid image type. Only JPEG, PNG, and WebP images are allowed.");
      return false;
    }

    return true;
  }
  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      if (this.validateUpdateImageFile(file)) {
        this.trackForm.patchValue({ imageFile: file });

        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.trackForm.patchValue({ imageFile: null });
        this.imagePreview = null;
      }
    }
  }
  removeImage(): void {
    this.trackForm.patchValue({ imageFile: null });
    this.imagePreview = null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAudioFile = input.files[0];
      this.trackForm.patchValue({ audioFile: this.selectedAudioFile.name });
    }
  }

  onSubmit(): void {
    if (this.trackForm.valid) {
      const updatedTrack = {
        ...this.trackForm.value,
        audioFile: this.selectedAudioFile || null,
      };

      this.track$.subscribe(track => {
        if (track) {
          updatedTrack.id = track.id; // Add the track ID from the observable
          this.store.dispatch(
            TrackActions.updateTrack({ updatedTrack, audioFile: this.selectedAudioFile })
          );
          setTimeout(() => {
            this.route.navigate(['/library']).catch(err => {
              console.error('Navigation error:', err);
            });
          }, 2000);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
