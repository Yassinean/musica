import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Track } from '../models/track.model';


@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db!: IDBPDatabase;

  constructor() {
    this.initDb();
  }

  // Initialize IndexedDB
  private async initDb() {
    this.db = await openDB('MusicStreamDB', 1, {
      upgrade(db) {
        // Create the audioFiles store
        if (!db.objectStoreNames.contains('audioFiles')) {
          db.createObjectStore('audioFiles', { keyPath: 'id' });
        }
        // Create the metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'id' });
        }
      },
    });
  }

  async addTrackMetadata(track: Track) {
    return this.db.put('metadata', track);
  }

  async getTrackMetadata(id: string): Promise<Track | undefined> {
    return this.db.get('metadata', id);
  }

  async getAllTrackMetadata(): Promise<Track[]> {
    return this.db.getAll('metadata');
  }

  async deleteTrackMetadata(id: string) {
    return this.db.delete('metadata', id);
  }

  async addAudioFile(id: string, file: Blob) {
    return this.db.put('audioFiles', { id, file });
  }

  async getAudioFile(id: string): Promise<Blob | undefined> {
    const result = await this.db.get('audioFiles', id);
    return result?.file;
  }

  async deleteAudioFile(id: string) {
    return this.db.delete('audioFiles', id);
  }
}