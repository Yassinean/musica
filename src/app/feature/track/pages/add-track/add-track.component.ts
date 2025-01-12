import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NavbarComponent} from "../../../../shared/layout/navbar/navbar.component";
import {MusicCategory, Track} from "../../../../core/models/track.model";
import {Store} from "@ngrx/store";
import * as TrackActions from "../../../store/track.actions";
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-track',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule , NavbarComponent],
  templateUrl: './add-track.component.html',
  styleUrl: './add-track.component.scss'
})
export class AddTrackComponent {
  trackForm:FormGroup;
  imagePreview:string | null = null;
  categories: MusicCategory[] = Object.values(MusicCategory);
  audioFileError: string | null = null;
  private readonly maxAudioSize = 10; // MB

  constructor(private readonly store: Store, private readonly fb: FormBuilder, private readonly router: Router) {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(40)]],
      artist: ['', Validators.required],
      description: ['', [Validators.maxLength(200)]],
      category: [MusicCategory.OTHER],
      audioFile: [null, Validators.required],
      imageFile: [null , Validators.required]
    });
  }
  validateTrackMetadata(): boolean {
    const { title, description } = this.trackForm.value;
    if (title.length > 50) {
      alert("Title cannot be longer than 50 characters.");
      return false;
    }
    if (description && description.length > 200) {
      alert("Description cannot be longer than 200 characters.");
      return false;
    }
    return true;
  }


  validateAudioFile(file: Blob): boolean {
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

  validateImageFile(file: File): boolean {
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
      if (this.validateImageFile(file)) {
        this.trackForm.patchValue({ imageFile: file });

        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string; // This will be a base64 string
        };
        reader.readAsDataURL(file); // Read the file as a data URL
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


  private getAudioDuration(file: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audioElement = new Audio();
      audioElement.preload = 'metadata';

      audioElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audioElement.src);
        resolve(Math.round(audioElement.duration * 1000));
      };

      audioElement.onerror = () => {
        window.URL.revokeObjectURL(audioElement.src);
        reject(new Error('Error loading audio file'));
      };

      audioElement.src = URL.createObjectURL(file);
    });
  }

  async onSubmit(): Promise<void> {
    if (this.trackForm.invalid) {
      alert("Please fill out all required fields");
      return;
    }

    const {title, artist, description, category, audioFile, imageFile} = this.trackForm.value;

    // Validate audio file
    if (!audioFile) {
      alert("Audio file is required.");
      return;
    }

    try {
      // Get audio duration
      const duration = await this.getAudioDuration(audioFile);
      const idT = this.generateId();
      
      const track: Track = {
        id: idT,
        title,
        artist,
        description,
        addedAt: new Date(),
        duration,
        category,
        fileUrl: URL.createObjectURL(audioFile),
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
        imageFileId: idT
      };

      console.log('Track:', track);
      this.store.dispatch(TrackActions.addTrack({track, audioFile, imageFile}));
      
      // Wait for the add operation to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reload tracks and navigate
      this.store.dispatch(TrackActions.loadTracks());
      this.router.navigate(['/library']);
    } catch (error) {
      console.error('Error getting audio duration:', error);
      alert("Error processing audio file. Please try again.");
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.validateAudioFile(file)) {
        this.trackForm.patchValue({ audioFile: file }); // Store the actual file
        this.audioFileError = null;
      }
    }
  }

  resetForm(): void {
    this.trackForm.reset({
      category: MusicCategory.POP,
      audioFile: null,
      imageFile: null
    });
  }

  private generateId(): string {
    return 'track-' + Math.random().toString(36).substr(2, 9);
  }
}
