import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment as prodEnv } from '../environments/environment.prod';
import { environment as qaEnv } from '../environments/environment.qa';
import { environment as stagingEnv } from '../environments/environment';
import { IPost } from './../post.model';
import { BehaviorSubject } from 'rxjs';
import { TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';


const POSTS_URL = 'wp-json/wp/v2/posts';

@Injectable({
  providedIn: 'root',
})
export class WordpressService {
  posts: IPost[] = [];
  post$ = new BehaviorSubject<IPost | null>(null);

  private POSTS_KEY = makeStateKey<IPost[]>('posts');
  private POST_KEY = (id: number) => makeStateKey<IPost>(`post-${id}`);

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  
  getAllPosts(): Observable<IPost[]> {
    if (this.transferState.hasKey(this.POSTS_KEY)) {
      const cachedPosts = this.transferState.get(this.POSTS_KEY, [] as IPost[]);
      this.transferState.remove(this.POSTS_KEY); 
      return of(cachedPosts); 
    }

    const prodPosts$ = this.http.get<IPost[]>(`${prodEnv.WORDPRESS_REST_URL}${POSTS_URL}`);
    const qaPosts$ = this.http.get<IPost[]>(`${qaEnv.WORDPRESS_REST_URL}${POSTS_URL}`);
    const stagingPosts$ = this.http.get<IPost[]>(`${stagingEnv.WORDPRESS_REST_URL}${POSTS_URL}`);

    return forkJoin([prodPosts$, qaPosts$, stagingPosts$]).pipe(
      map(([prodPosts, qaPosts, stagingPosts]) => {
        return [...prodPosts, ...qaPosts, ...stagingPosts];
      }),
      tap(posts => {
        this.posts = posts; 
        
        if (isPlatformServer(this.platformId)) {
          console.log('posts already stored')
          this.transferState.set(this.POSTS_KEY, posts);
        }
      })
    );
  }

  
  getPost(id: number): void {
    const postKey = this.POST_KEY(id);

    if (this.transferState.hasKey(postKey)) {
      const cachedPost = this.transferState.get(postKey, null);
      this.transferState.remove(postKey); 
      this.post$.next(cachedPost); 
      return;
    }

    const prodPost$ = this.http.get<IPost>(`${prodEnv.WORDPRESS_REST_URL}${POSTS_URL}/${id}`).pipe(
      catchError(() => of(null))
    );
    const qaPost$ = this.http.get<IPost>(`${qaEnv.WORDPRESS_REST_URL}${POSTS_URL}/${id}`).pipe(
      catchError(() => of(null))
    );
    const stagingPost$ = this.http.get<IPost>(`${stagingEnv.WORDPRESS_REST_URL}${POSTS_URL}/${id}`).pipe(
      catchError(() => of(null))
    );

    forkJoin([prodPost$, qaPost$, stagingPost$]).pipe(
      map(postsArray => {
        return postsArray.find(post => post !== null) || null;
      }),
      tap(post => {
        this.post$.next(post); 
        console.log(post)
        if(isPlatformBrowser(this.platformId)){
          console.log('you are in browser');
        }
        
        if (isPlatformServer(this.platformId)) {
          console.log( 'you are on server')
          this.transferState.set(postKey, post);
        }
      })
    ).subscribe();
  }

  
}
