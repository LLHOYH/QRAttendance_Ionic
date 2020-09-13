import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterAdminNumberPage } from './register-admin-number.page';

describe('RegisterAdminnumberPage', () => {
  let component: RegisterAdminNumberPage;
  let fixture: ComponentFixture<RegisterAdminNumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterAdminNumberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterAdminNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
