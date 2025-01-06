import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Standalone component import
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance; // Reusable component instance
  });

    it('should create the app', () => {
        expect(app).toBeTruthy();
  });

    it('should have a default title of "ng-cookbook"', () => {
        expect(app.title).toBe('ng-cookbook');
    });


});
