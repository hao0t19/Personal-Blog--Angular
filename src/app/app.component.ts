import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouteHelperService } from './route-helper.service';

@Component({
  selector: 'pb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routerTransition', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ])
    ])
  ]
})
export class AppComponent {

  constructor(private routeHelperService: RouteHelperService) {}
  
  title = 'personal-blog';
  
  getOutlet(o: RouterOutlet) {
    return o.activatedRouteData['routeState'];
  }
}

