//service that fetching posts from wordpress 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subject, Observable , forkJoin } from 'rxjs';
//use to handle and transform the data
import { tap , map } from 'rxjs/operators';
import { environment as prodEnv } from '../environments/environment.prod';
import { environment as qaEnv } from '../environments/environment.qa';
import { environment as stagingEnv } from '../environments/environment';
//the post object 
import { IPost } from './../post.model';

//endpoint of fetching posts from wordpress rest API
const POSTS_URL = 'wp-json/wp/v2/posts';

@Injectable({
  providedIn: 'root'
})

export class WordpressService {
    posts!: IPost[];
    //subject to emit individual post updates
    post$: Subject<IPost> = new Subject();

    constructor(private http: HttpClient) { }

    // Fetch and combine posts from different environments
    getAllPosts(): Observable<IPost[]> {
      // Fetch from each environment
      const prodPosts$ = this.http.get<IPost[]>(`${prodEnv.WORDPRESS_REST_URL}${POSTS_URL}`);
      const qaPosts$ = this.http.get<IPost[]>(`${qaEnv.WORDPRESS_REST_URL}${POSTS_URL}`);
      const stagingPosts$ = this.http.get<IPost[]>(`${stagingEnv.WORDPRESS_REST_URL}${POSTS_URL}`);

      // Combine the results from all environments using forkJoin
      //forkJoin is used to wait for all HTTP requests to complete and combines the results
      return forkJoin([prodPosts$, qaPosts$, stagingPosts$]).pipe(
         //combines posts from all sources into single array
          map(([prodPosts, qaPosts, stagingPosts]) => {
              // Merge all posts from different environments
              return [...prodPosts, ...qaPosts, ...stagingPosts];
          }),
          tap(posts => this.posts = posts) // Cache the combined posts
      );
  }

   //for testing code recovery function

}