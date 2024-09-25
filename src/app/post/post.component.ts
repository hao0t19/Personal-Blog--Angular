import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordpressService } from '../core/wordpress.service';
import { IPost } from './../post.model';
import { Observable } from 'rxjs';
import { postsAnimation } from '../../animations';
import { Meta, Title } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';

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
    private titleService: Title,
    private metaService: Meta
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
          this.titleService.setTitle(post.title.rendered); 
          this.metaService.removeTag('name="description"'); 
          this.metaService.addTag({
            name: 'description',
            content: post.excerpt.rendered 
          });
        }
      })
    ).subscribe();
  }
}
