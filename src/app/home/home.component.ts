import { Component, OnInit } from '@angular/core';
import { WordpressService } from '../core/wordpress.service';
import { Observable } from 'rxjs';
import { IPost } from './../post.model';
import { style ,trigger,animate , transition } from '@angular/animations';


@Component({
  selector: 'pb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('postsAnimation', [
        transition(':enter', [
            /* initial */
style({
transform: 'translateY(100%)', opacity: 0 }),
            /* final */
            animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)', style({
            transform: 'translateY(0)', opacity: 1 }))
]),
])
]
})

export class HomeComponent implements OnInit {
  //define a stream of arrays of IPost objects
  posts$!: Observable<IPost[]>;
  constructor(private wordpressService: WordpressService) { }

  ngOnInit(): void {
    this.posts$ = this.wordpressService.getAllPosts();
  }
}


