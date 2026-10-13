import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionPage } from './auction.page';

describe('AuctionPage', () => {
  let component: AuctionPage;
  let fixture: ComponentFixture<AuctionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
