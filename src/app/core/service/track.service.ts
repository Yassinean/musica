import { Injectable } from '@angular/core';
import {DBSchema, IDBPDatabase, openDB} from "idb";
import {Track} from "../models/track.model";
import {Observable, throwError, from, map, catchError, of} from "rxjs";


interface AudioFile{
  id:string;
  file:Blob;
}

interface CoverImage{
  id:string;
  file:Blob;
}

interface TrackDB extends DBSchema{
  tracks:{
    key:string,
    value: Track
  };
  audioFiles:{
    key:string,
    value: AudioFile
  };
  coverImage:{
    key:string,
    value: CoverImage
  };
}

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private db!: IDBPDatabase<TrackDB> | undefined;

  constructor() {
    this.initializeDB();
  }

  private async initializeDB(){
    try {
      this.db = await openDB<TrackDB>('trackDB',1,{
        upgrade(db){
          if(!db.objectStoreNames.contains('tracks')){
            db.createObjectStore('tracks',{keyPath:'id'})
          }
          if(!db.objectStoreNames.contains('audioFiles')){
            db.createObjectStore('audioFiles',{keyPath:'id'})
          }
          if(!db.objectStoreNames.contains('coverImage')){
            db.createObjectStore('coverImage',{keyPath:'id'})
          }
        }
      })
    }catch (error){
      console.error('Creation dyal database fiha mochkil ' , error)
    }
  }

  saveTrackMetadata(track:Track):Observable<void>{
    if(!this.db){
      return throwError(()=>new Error('Something went wrong for creation database not initialised'));
    }
    return from(this.db.put('tracks', track).then(() => {}));
  }

  saveAudioFile(id:string,file:Blob){
    if (!this.db){
      return throwError(()=>new Error('Something went wrong for creation database not initialised'));
    }
    if(!file.type.startsWith('audio/')){
      console.error('Invalid file type:', file.type);
      return throwError(() => new Error('Invalid file type. Must be an audio file.'));
    }
    console.log('Saving audio file with ID:', id);
    const audioFile: AudioFile = {
      id,
      file
    };
    return from(
      this.db.put('audioFiles', audioFile)
    ).pipe(
      map(() => {
        console.log('Audio file saved successfully');
      }),
      catchError((error) => {
        console.error('Error saving audio file:', error);
        return throwError(() => error);
      })
    );
  }

  saveImageCover(id:string , file:Blob){
    if(!this.db){
      return throwError(()=>new Error('Something went wrong for creation database not initialised'));
    }
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return throwError(() => new Error('Invalid file type. Must be an image file.'));
    }
    console.log('Saving image file with ID:', id);
    const coverImage: CoverImage = {
      id,
      file
    };
    return from(
      this.db.put('coverImage', coverImage)
    ).pipe(
      map(() => {
        console.log('Image file saved successfully');
      }),
      catchError((error) => {
        console.error('Error saving image file:', error);
        return throwError(() => error);
      })
    );
  }

  getTrackById(id: string): Observable<Track | undefined> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.get('tracks', id));
  }

  getAudioFile(id: string): Observable<Blob | undefined> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.get('audioFiles', id)).pipe(
      map(record => record?.file)
    );
  }

  addTrack(track: Track, audioFile: Blob, imageFile?: Blob): Observable<Track> {
    return new Observable<Track>((observer) => {
      this.saveTrackMetadata(track).subscribe({
        next: () => {
          console.log('Track metadata saved successfully');

          this.saveAudioFile(track.id, audioFile).subscribe({
            next: () => {
              console.log('Audio file saved successfully');

              if (imageFile) {
                this.saveImageCover(track.id, imageFile).subscribe({
                  next: () => {
                    console.log('Image file saved successfully');
                    observer.next(track);
                    observer.complete();
                  },
                  error: (err) => {
                    console.error('Error saving image file:', err);
                    observer.error(err);
                  }
                });
              } else {
                observer.next(track);
                observer.complete();
              }
            },
            error: (err) => {
              console.error('Error saving audio file:', err);
              observer.error(err);
            },
          });
        },
        error: (err) => {
          console.error('Error saving track metadata:', err);
          observer.error(err);
        },
      });
    });
  }

  getImageFileUrl(id: string): Observable<string | null> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }

    return from(this.db.get('coverImage', id)).pipe(
      map(record => {
        if (record?.file instanceof Blob) {
          return URL.createObjectURL(record.file);
        }
        return null;
      }),
      catchError(error => {
        console.error('Error getting image file:', error);
        return of(null);
      })
    );
  }

  updateTrack(updatedTrack: Track, audioFile: Blob | null, imageFile?: Blob | null): Observable<Track> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }

    return new Observable<Track>((observer) => {
      // First save track metadata
      this.saveTrackMetadata(updatedTrack).subscribe({
        next: async () => {
          try {
            // Handle audio file update if provided
            if (audioFile) {
              await this.saveAudioFile(updatedTrack.id, audioFile).toPromise();
            }

            // Handle image file update if provided
            if (imageFile) {
              await this.saveImageCover(updatedTrack.id, imageFile).toPromise();
            }

            observer.next(updatedTrack);
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  deleteTrack(id: string): Observable<void> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(
      Promise.all([
        this.db.delete('tracks', id),
        this.db.delete('audioFiles', id),
        this.db.delete('coverImage', id),
      ]).then(() => {
      })
    );
  }

  getAllTrackMetadata(): Observable<Track[]> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.getAll('tracks'));
  }

  getAllAudioFiles(): Observable<Blob[]> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.getAll('audioFiles')).pipe(
      map(records => records.map(record => record.file))
    );
  }

  getAllImageFiles(): Observable<Blob[]> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.getAll('coverImage')).pipe(
      map(records => records.map(record => record.file))
    );
  }
}
