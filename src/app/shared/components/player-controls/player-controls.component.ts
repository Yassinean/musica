import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AudioService } from '../../../core/service/audio.service';
import { PlayerState, Track } from '../../../core/models/track.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-player-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-controls.component.html',
  styles: [`
    :host {
      display: block;
      height: 72px;
    }
  `]
})
export class PlayerControlsComponent implements OnInit, OnDestroy {
  currentTrack: Track | null = null;
  playerState: PlayerState = PlayerState.STOPPED;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  showVolumeControl: boolean = false;
  private destroy$ = new Subject<void>();
  readonly defaultImage = 'https://res.cloudinary.com/dz4pww2qv/image/upload/v1735915190/apbake6pbviilhdi1brd.jpg';

  constructor(
    private audioService: AudioService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.audioService.currentTrack$.pipe(takeUntil(this.destroy$))
      .subscribe(track => this.currentTrack = track);
    
    this.audioService.playerState$.pipe(takeUntil(this.destroy$))
      .subscribe(state => this.playerState = state);
    
    this.audioService.currentTime$.pipe(takeUntil(this.destroy$))
      .subscribe(time => this.currentTime = time);
    
    this.audioService.duration$.pipe(takeUntil(this.destroy$))
      .subscribe(duration => this.duration = duration);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePlay(): void {
    if (this.playerState === PlayerState.PLAYING) {
      this.audioService.pause();
    } else if (this.currentTrack) {
      this.audioService.play(this.currentTrack);
    }
  }

  onPrevious(): void {
    this.audioService.previous();
  }

  onNext(): void {
    this.audioService.next();
  }

  formatTime(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getProgress(): number {
    return this.duration ? (this.currentTime / this.duration) * 100 : 0;
  }

  onProgressChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const time = (parseFloat(value) * this.duration) / 100;
    this.audioService.setProgress(time);
  }

  toggleVolumeControl(): void {
    this.showVolumeControl = !this.showVolumeControl;
  }

  onVolumeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.volume = parseFloat(value) / 100;
    this.audioService.setVolume(this.volume);
  }

  get showPlayer(): boolean {
    return this.currentTrack !== null;
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultImage;
  }
} 