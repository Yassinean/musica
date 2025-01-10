import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrackComponent } from './add-track.component';

describe('AddTrackComponent', () => {
  let component: AddTrackComponent;
  let fixture: ComponentFixture<AddTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTrackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
