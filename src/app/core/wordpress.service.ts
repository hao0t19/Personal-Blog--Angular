import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment as prodEnv } from '../environments/environment.prod';
import { environment as qaEnv } from '../environments/environment.qa';
import { environment as stagingEnv } from '../environments/environment';
import { IPost } from './../post.model';
import { BehaviorSubject } from 'rxjs';

// Import TransferState for transferring data between server and client
import { TransferState, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';

// Endpoint for fetching posts from the WordPress REST API
const POSTS_URL = 'wp-json/wp/v2/posts';

@Injectable({
  providedIn: 'root',
})
export class WordpressService {
  posts: IPost[] = [];
  // Subject to emit individual post updates
  post$ = new BehaviorSubject<IPost | null>(null);

  // Create state keys for caching posts and individual post data
  private POSTS_KEY = makeStateKey<IPost[]>('posts');
  private POST_KEY = (id: number) => makeStateKey<IPost>(`post-${id}`);

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Fetch and combine posts from different environments, with state transfer support
  getAllPosts(): Observable<IPost[]> {
    // Check if the state is available on the client
    if (this.transferState.hasKey(this.POSTS_KEY)) {
      const cachedPosts = this.transferState.get(this.POSTS_KEY, [] as IPost[]);
      this.transferState.remove(this.POSTS_KEY); // Clean up state after transfer
      return of(cachedPosts); // Return the cached posts
    }

    // Fetch posts from all environments
    const prodPosts$ = this.http.get<IPost[]>(`${prodEnv.WORDPRESS_REST_URL}${POSTS_URL}`);
    const qaPosts$ = this.http.get<IPost[]>(`${qaEnv.WORDPRESS_REST_URL}${POSTS_URL}`);
    const stagingPosts$ = this.http.get<IPost[]>(`${stagingEnv.WORDPRESS_REST_URL}${POSTS_URL}`);

    return forkJoin([prodPosts$, qaPosts$, stagingPosts$]).pipe(
      map(([prodPosts, qaPosts, stagingPosts]) => {
        return [...prodPosts, ...qaPosts, ...stagingPosts];
      }),
      tap(posts => {
        this.posts = posts; // Cache the combined posts

        // Store the posts in TransferState if on the server
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(this.POSTS_KEY, posts);
        }
      })
    );
  }

  // Fetch a single post by ID, with state transfer support
  getPost(id: number): void {
    const postKey = this.POST_KEY(id);

    // Check if the state is available on the client
    if (this.transferState.hasKey(postKey)) {
      const cachedPost = this.transferState.get(postKey, null);
      this.transferState.remove(postKey); // Clean up state after transfer
      this.post$.next(cachedPost); // Emit the cached post
      return;
    }

    // Fetch the post from all environments
    const prodPost$ = this.http.get<IPost>(`${prodEnv.WORDPRESS_REST_URL}${POSTS_URL}/${id}`).pipe(
      catchError(() => of(null))
    );
    const qaPost$ = this.http.get<IPost>(`${qaEnv.WORDPRESS_REST_URL}${POSTS_URL}/${id}`).pipe(
      catchError(() => of(null))
    );
    const stagingPost$ = this.http.get<IPost>(`${stagingEnv.WORDPRESS_REST_URL}${POSTS_URL}/${id}`).pipe(
      catchError(() => of(null))
    );

    // Use forkJoin to combine the API responses
    forkJoin([prodPost$, qaPost$, stagingPost$]).pipe(
      map(postsArray => {
        // Return the first post that is not null
        return postsArray.find(post => post !== null) || null;
      }),
      tap(post => {
        this.post$.next(post); // Emit the found post
        console.log(post)
        // Store the post in TransferState if on the server
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(postKey, post);
        }
      })
    ).subscribe();
  }

  
}
