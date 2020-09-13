import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterPasswordPage } from './register-password.page';

describe('RegisterPasswordPage', () => {
  let component: RegisterPasswordPage;
  let fixture: ComponentFixture<RegisterPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
