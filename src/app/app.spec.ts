import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the timer dashboard', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Timers');
    expect(compiled.textContent).toContain('No timers yet');
  });

  it('should add a timer from the empty state', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((item) =>
      item.textContent?.includes('Add timer'),
    );

    button?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const nameInput = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('.name-field input');
    expect(nameInput?.value).toBe('Timer 1');
  });
});
