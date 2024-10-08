import { Injectable } from '@angular/core';
import { SeoService } from './seo.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteHelperService {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      filter(route => route.outlet === 'primary'),
    ).subscribe((activeRoute: ActivatedRoute) => {
      const seo = activeRoute.snapshot.data['seo']; 
      if (seo) {
        this.seoService.setMetaTags([
          { name: 'description', content: seo.description },
        ]);

        this.seoService.setOpenGraphTags({
          title: seo.title,
          description: seo.description,
          image: seo.shareImg,
          url: window.location.href, 
        });

        this.seoService.setTitle(seo.title); 
      }
    });
  }
}
