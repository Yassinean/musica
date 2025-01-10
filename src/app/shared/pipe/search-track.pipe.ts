import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTrack',
  standalone: true
})
export class SearchTrackPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
