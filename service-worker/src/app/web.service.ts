  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';

  @Injectable({
    providedIn: 'root',
  })
  export class WebService {
    constructor(private http: HttpClient) {}

    getPosts() {
      return this.http.get('https://jsonplaceholder.typicode.com/posts');
    }

    getComments() {
      return this.http.get('https://jsonplaceholder.typicode.com/comments');
    }
  }
