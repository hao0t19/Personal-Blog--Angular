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
    private seoService: SeoService  
  ) {
    this.post$ = this.wordpressService.post$;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const postId = +params['id'];
      if (postId) {
        this.wordpressService.getPost(postId); 
      }
    });

    this.post$.pipe(
      tap(post => {
        if (post) {
          this.seoService.setTitle(post.title.rendered);
          this.seoService.setMetaTags([
            { name: 'description', content: post.excerpt.rendered },
            { name: 'author', content: 'Your Name' }, 
          ]);
          
          this.seoService.setOpenGraphTags({
            title: post.title.rendered,
            description: post.excerpt.rendered
          });
        }
      })
    ).subscribe();
  }
}
