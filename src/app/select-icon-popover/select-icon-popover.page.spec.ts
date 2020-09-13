import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectIconPopoverPage } from './select-icon-popover.page';

describe('SelectIconPopoverPage', () => {
  let component: SelectIconPopoverPage;
  let fixture: ComponentFixture<SelectIconPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectIconPopoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectIconPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
