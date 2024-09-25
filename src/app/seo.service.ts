import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private meta: Meta, private title: Title) {}

  setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }

  setMetaTags(tags: { name: string; content: string }[]) {
    tags.forEach(tag => {
      this.meta.updateTag(tag);
    });
  }

  setOpenGraphTags(data: { [key: string]: string }) {
    // Adding Open Graph tags
    Object.keys(data).forEach(key => {
      this.meta.addTag({
        property: `og:${key}`,
        content: data[key]
      });
    });
  }
}
