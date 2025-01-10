import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryCategoriesComponent } from './library-categories.component';

describe('LibraryCategoriesComponent', () => {
  let component: LibraryCategoriesComponent;
  let fixture: ComponentFixture<LibraryCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibraryCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
