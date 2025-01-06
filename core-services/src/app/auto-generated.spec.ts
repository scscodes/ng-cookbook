import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ClassicComponent } from './legacy/classic/classic.component';


describe('AppComponent', () => {
    let instance: AppComponent;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppComponent]
        });
        instance = TestBed.createComponent(AppComponent).componentInstance;
    });
    it('should get faUrl', () => {
        expect(instance.faUrl).toBeDefined();
    });

    it('should set faUrl', () => {
        const mockValue: any = {};
        instance.faUrl = mockValue;
        expect(instance.faUrl).toBeDefined();
    });

    it('should get titleValue', () => {
        expect(instance.titleValue).toBeDefined();
    });
});


describe('ClassicComponent', () => {
    let instance: ClassicComponent;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ClassicComponent]
        });
        instance = TestBed.createComponent(ClassicComponent).componentInstance;
    });
    it('should get disabled', () => {
        expect(instance.disabled).toBeDefined();
    });

    it('should set disabled', () => {
        const mockValue: any = {};
        instance.disabled = mockValue;
        expect(instance.disabled).toBeDefined();
    });

    it('should get checked', () => {
        expect(instance.checked).toBeDefined();
    });

    it('should set checked', () => {
        const mockValue: any = {};
        instance.checked = mockValue;
        expect(instance.checked).toBeDefined();
    });

    it('should get basicTitle', () => {
        expect(instance.basicTitle).toBeDefined();
    });
});