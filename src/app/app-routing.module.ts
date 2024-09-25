import { NgModule } from '@angular/core';
import { RouterModule, Routes ,PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink'
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' }, // Empty path leads to home
  { path: 'home', component: HomeComponent ,  data: { routeState: 1 }},
  { path: 'about', component: AboutComponent , data: { routeState: 2 }},
  { path: 'post/:id/:slug', loadChildren: () => import('./post/post.module').then(m => m.PostModule), data: { routeState: 3 } },
  { path: '**', component: HomeComponent } // Catch-all route
];

@NgModule({
  imports: [
    CommonModule,
    QuicklinkModule,
    RouterModule.forRoot(routes , {
    preloadingStrategy: PreloadAllModules,
    useHash: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
