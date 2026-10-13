import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TierListPage } from './tier-list.page';

describe('TierListPage', () => {
  let component: TierListPage;
  let fixture: ComponentFixture<TierListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TierListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
