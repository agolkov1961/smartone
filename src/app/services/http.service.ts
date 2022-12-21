import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private site: string = 'https://backend-for-applicants.smartoneclub.com'
  public constructor(private http: HttpClient) {}

  public get(url: string): Observable<any> {
    return this.http.get(`${this.site}/${url}`);
  }

  public post(url: string, body: any): Observable<any> {
    return this.http.post(`${this.site}/${url}`, body);
  }

  public put(url: string, body: any): Observable<any> {
    return this.http.put(`${this.site}/${url}`, body);
  }

  public delete(url: string): Observable<any> {
    return this.http.delete(`${this.site}/${url}`);
  }
}
