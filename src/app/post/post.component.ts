import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordpressService } from '../core/wordpress.service';
import { IPost } from './../post.model';
import { Observable } from 'rxjs';
import { postsAnimation } from '../../animations';

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
    private wordpressService: WordpressService
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
  }
}
