import { Component, OnInit } from '@angular/core';
import { WordpressService } from '../core/wordpress.service';
import { Observable } from 'rxjs';
import { IPost } from './../post.model';
import { style, trigger, animate, transition } from '@angular/animations';
import { SeoService } from '../seo.service';

@Component({
  selector: 'pb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('postsAnimation', [
      transition(':enter', [
        /* initial */
        style({
          transform: 'translateY(100%)', opacity: 0
        }),
        /* final */
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)', style({
          transform: 'translateY(0)', opacity: 1
        }))
      ]),
    ])
  ]
})

export class HomeComponent implements OnInit {
  posts$!: Observable<IPost[]>;

  constructor(
    private wordpressService: WordpressService,
    private seoService: SeoService  
  ) {}

  ngOnInit(): void {
    this.posts$ = this.wordpressService.getAllPosts();
    this.seoService.setTitle('My Personal Blog - Home Page');
    this.seoService.setMetaTags([
      { name: 'description', content: 'My Personal Blog where I write about my life and hobbies' }
    ]);
  }
}
