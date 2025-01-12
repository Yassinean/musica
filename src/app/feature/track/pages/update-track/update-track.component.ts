import { Component, OnInit, OnDestroy } from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MusicCategory, Track} from "../../../../core/models/track.model";
import {Store} from "@ngrx/store";
import * as TrackActions from "../../../store/track.actions";
import {Observable, takeUntil, Subject, take} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {selectTrackById} from "../../../store/track.selectors";
import { TrackService } from '../../../../core/service/track.service';

@Component({
  selector: 'app-update-track',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './update-track.component.html',
  styleUrl: './update-track.component.scss'
})
export class UpdateTrackComponent implements OnInit, OnDestroy {

  updateForm!: FormGroup;
  track$!: Observable<Track | undefined>;
  imagePreview:string | null = null;
  categories: MusicCategory[] = Object.values(MusicCategory);
  selectedAudioFile!: File | null;
  currentImageUrl: string = '';
  readonly defaultCoverImage = 'https://res.cloudinary.com/dz4pww2qv/image/upload/v1735915190/apbake6pbviilhdi1brd.jpg';
  imageLoadError = false;
  private readonly destroy$ = new Subject<void>();
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  audioFileError: string | null = null;
  private readonly maxAudioSize = 10; // MB
  selectedImageFile: File | null = null;
  currentTrackId: string | null = null;

  constructor(private readonly formBuilder:FormBuilder ,
              private activateRoute:ActivatedRoute ,
              private store:Store ,
              private route:Router,
              private trackService: TrackService
  ) {
    // @ts-ignore
    this.isLoading$ = this.store.select(state => state. track?.loading ?? false);
    // @ts-ignore
    this.error$ = this.store.select(state => state.track?.error ?? null);
  }

  ngOnInit(): void {
    const trackId = this.activateRoute.snapshot.paramMap.get('id');
    if (trackId) {
      this.currentTrackId = trackId;
      this.store.dispatch(TrackActions.loadTrack({ id: trackId }));
      this.track$ = this.store.select(selectTrackById(trackId));
      
      this.track$.pipe(takeUntil(this.destroy$)).subscribe(track => {
        if (track) {
          this.initializeForm(track);
          if (track.imageFileId) {
            this.trackService.getImageFileUrl(track.imageFileId).subscribe({
              next: (url) => {
                if (typeof url === 'string') {
                  this.currentImageUrl = url;
                  this.imagePreview = url;
                } else {
                  this.currentImageUrl = this.defaultCoverImage;
                }
              },
              error: () => {
                this.currentImageUrl = this.defaultCoverImage;
                this.imageLoadError = true;
              }
            });
          } else {
            this.currentImageUrl = this.defaultCoverImage;
          }
        }
      });
    }
  }

  initializeForm(track: Track): void {
    this.updateForm = this.formBuilder.group({
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
        this.selectedImageFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.selectedImageFile = null;
        this.imagePreview = this.currentImageUrl;
      }
    }
  }
  removeImage(): void {
    this.updateForm.patchValue({ imageFile: null });
    this.imagePreview = null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.validateAudioFile(file)) {
        this.selectedAudioFile = file;
        this.updateForm.patchValue({ audioFile: this.selectedAudioFile.name });
        this.audioFileError = null;
      }
    }
  }

  validateAudioFile(file: File): boolean {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'];

    if (file.size > this.maxAudioSize * 1024 * 1024) {
      this.audioFileError = `Audio file size must be less than ${this.maxAudioSize}MB`;
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      this.audioFileError = 'Invalid audio format. Please use MP3, WAV, or OGG';
      return false;
    }

    return true;
  }

  onCancel(): void {
    this.route.navigate(['/library']).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;

      this.track$.pipe(take(1)).subscribe(track => {
        if (track) {
          const updatedTrack = {
            ...track,
            title: formValue.title,
            artist: formValue.artist,
            description: formValue.description,
            category: formValue.category,
          };

          // Dispatch update action with files if they exist
          this.store.dispatch(
            TrackActions.updateTrack({ 
              updatedTrack, 
              audioFile: this.selectedAudioFile || null,
              imageFile: this.selectedImageFile || null
            })
          );

          // Wait for the update to complete
          setTimeout(() => {
            this.store.dispatch(TrackActions.loadTracks());
            this.route.navigate(['/library']);
          }, 1000);
        }
      });
    }
  }

  handleImageError(): void {
    this.currentImageUrl = this.defaultCoverImage;
    this.imageLoadError = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
