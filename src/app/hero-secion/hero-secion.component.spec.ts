import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSecionComponent } from './hero-secion.component';

describe('HeroSecionComponent', () => {
  let component: HeroSecionComponent;
  let fixture: ComponentFixture<HeroSecionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroSecionComponent]
    });
    fixture = TestBed.createComponent(HeroSecionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
