import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderCompoent } from './header-compoent';

describe('Header', () => {
  let component: HeaderCompoent;
  let fixture: ComponentFixture<HeaderCompoent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCompoent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderCompoent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
