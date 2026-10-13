import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage), canActivate: [authGuard] },
  { path: 'shop', loadComponent: () => import('./shop/shop.page').then(m => m.ShopPage), canActivate: [authGuard] },
  { path: 'event', loadComponent: () => import('./event/event.page').then(m => m.EventPage), canActivate: [authGuard] },
  { path: 'sell-card', loadComponent: () => import('./sell-card/sell-card.page').then(m => m.SellCardPage), canActivate: [authGuard] },   {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)},
  { path: 'auction',loadComponent: () => import('./auction/auction.page').then( m => m.AuctionPage)},
  { path: 'tier-list',loadComponent: () => import('./tier-list/tier-list.page').then( m => m.TierListPage)},
// เพิ่มบรรทัดนี้
];