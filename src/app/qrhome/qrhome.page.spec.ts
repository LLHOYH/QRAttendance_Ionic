import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QRHomePage } from './qrhome.page';

describe('QRHomePage', () => {
  let component: QRHomePage;
  let fixture: ComponentFixture<QRHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QRHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QRHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
