//service that fetching posts from wordpress 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subject, Observable , forkJoin } from 'rxjs';
//use to handle and transform the data
import { tap , map , catchError} from 'rxjs/operators';
import { environment as prodEnv } from '../environments/environment.prod';
import { environment as qaEnv } from '../environments/environment.qa';
import { environment as stagingEnv } from '../environments/environment';
//the post object 
import { IPost } from './../post.model';
import { BehaviorSubject } from 'rxjs';


//endpoint of fetching posts from wordpress rest API
const POSTS_URL = 'wp-json/wp/v2/posts';

@Injectable({
  providedIn: 'root'
})

export class WordpressService {
    posts: IPost[] = [];
    //subject to emit individual post updates
    post$ = new BehaviorSubject<IPost | null>(null);


    constructor(private http: HttpClient) { }

    // Fetch and combine posts from different environments
    getAllPosts(): Observable<IPost[]> {
      const prodPosts$ = this.http.get<IPost[]>(`${prodEnv.WORDPRESS_REST_URL}${POSTS_URL}`);
      const qaPosts$ = this.http.get<IPost[]>(`${qaEnv.WORDPRESS_REST_URL}${POSTS_URL}`);
      const stagingPosts$ = this.http.get<IPost[]>(`${stagingEnv.WORDPRESS_REST_URL}${POSTS_URL}`);
    
      return forkJoin([prodPosts$, qaPosts$, stagingPosts$]).pipe(
        map(([prodPosts, qaPosts, stagingPosts]) => {
          return [...prodPosts, ...qaPosts, ...stagingPosts];
        }),
        tap(posts => {
          this.posts = posts; // Cache the combined posts
        })
      );
    }

   //Fetch a single post by ID
   getPost(id: number): void {
    //sends an HTTP get request to retrieve a post from the specified URL
    const prodPost$ = this.http.get<IPost>(`${prodEnv.WORDPRESS_REST_URL}${POSTS_URL}/${id}`).pipe(
      //return null if face error
      catchError(() => of(null))
    );
    const qaPost$ = this.http.get<IPost>(`${qaEnv.WORDPRESS_REST_URL}${POSTS_URL}/${id}`).pipe(
      catchError(() => of(null))
    );
    const stagingPost$ = this.http.get<IPost>(`${stagingEnv.WORDPRESS_REST_URL}${POSTS_URL}/${id}`).pipe(
      catchError(() => of(null))
    );

    //join all the retrieved data from url 
    forkJoin([prodPost$, qaPost$, stagingPost$]).pipe(
      //
      map(postsArray => {
        return postsArray.find(post => post !== null) || null;
      }),
      //side effect operator , takes the found post and pushes it to behavior subject to nodify any scubscribers of the result
      tap(post => this.post$.next(post))
      //executes the entire process, trigger the HTTP request and allow the observables to emit their value
    ).subscribe();
  }

  
}

