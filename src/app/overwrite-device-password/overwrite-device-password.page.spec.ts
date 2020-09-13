import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OverwriteDevicePasswordPage } from './overwrite-device-password.page';

describe('OverwriteDevicePasswordPage', () => {
  let component: OverwriteDevicePasswordPage;
  let fixture: ComponentFixture<OverwriteDevicePasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverwriteDevicePasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OverwriteDevicePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
