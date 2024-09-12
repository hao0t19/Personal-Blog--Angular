import { Component, OnInit } from '@angular/core';
import { WordpressService } from '../core/wordpress.service';
import { Observable } from 'rxjs';
import { IPost } from './../post.model';

@Component({
  selector: 'pb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']  
})
export class HomeComponent implements OnInit {
  //define a stream of arrays of IPost objects
  posts$!: Observable<IPost[]>;
  constructor(private wordpressService: WordpressService) { }

  ngOnInit(): void {
    this.posts$ = this.wordpressService.getAllPosts();
  }
}
