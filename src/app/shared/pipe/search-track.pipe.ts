import { Pipe, PipeTransform } from '@angular/core';
import { Track } from "../../core/models/track.model";

@Pipe({
  name: 'searchTrack',
  pure: false,
  standalone: true
})
export class SearchTrackPipe implements PipeTransform {
  transform(tracks: Track[] | null, searchQuery: string): Track[] {
    if (!tracks) {
      return [];
    }

    if (!searchQuery || !searchQuery.trim()) {
      return tracks;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return tracks.filter(track => {
      const titleMatch = track.title?.toLowerCase().includes(query);
      const artistMatch = track.artist?.toLowerCase().includes(query);
      const descriptionMatch = track.description?.toLowerCase().includes(query);
      const categoryMatch = track.category?.toLowerCase().includes(query);
      
      return titleMatch || artistMatch || descriptionMatch || categoryMatch;
    });
  }
}
