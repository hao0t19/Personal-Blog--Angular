import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordpressService } from '../core/wordpress.service';
import { IPost } from './../post.model';
import { Observable } from 'rxjs';
import { postsAnimation } from '../../animations';
import { tap } from 'rxjs/operators';
import { SeoService } from '../seo.service';

@Component({
  selector: 'pb-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: [postsAnimation]
})
export class PostComponent implements OnInit {
  post$: Observable<IPost | null>;

  constructor(
    private route: ActivatedRoute,
    private wordpressService: WordpressService,
    private seoService: SeoService  // Inject SeoService
  ) {
    this.post$ = this.wordpressService.post$;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const postId = +params['id']; // Extract post ID from URL
      if (postId) {
        this.wordpressService.getPost(postId); // Fetch the specific post
      }
    });

    // Subscribe to the post$ observable to get the post data
    this.post$.pipe(
      tap(post => {
        if (post) {
          // Set title and meta tags using SeoService
          this.seoService.setTitle(post.title.rendered);
          this.seoService.setMetaTags([
            { name: 'description', content: post.excerpt.rendered },
            { name: 'author', content: 'Your Name' }, // Add other relevant meta tags here
            // You can add more standard tags as needed
          ]);
          // Set Open Graph tags
          this.seoService.setOpenGraphTags({
            title: post.title.rendered,
            description: post.excerpt.rendered
          });
        }
      })
    ).subscribe();
  }
}
