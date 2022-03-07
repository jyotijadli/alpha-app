import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: '563492ad6f917000010000014060d806c66c47b88b9b4d7f8c487692',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class FileSearchService {
  constructor(private http: HttpClient) {}

  getdata(search: any, perPage: any): Observable<any> {
    //const url="https://api.pexels.com/v1/search?query="+search+"&per_page="+perPage;
    const url =
      'https://service.zipapi.us/zipcode/90210?X-API-KEY=js-4dc2ae3090aac17b8024384bf86efd39';
    return this.http
      .get<any>(url, httpOptions)
      .pipe(catchError(this.handelError));
  }
  searchData(query: string, param: any) {
    // const url="https://licensecogsearchsvcrkand.search.windows.net/indexes/licensesearch-rkand-index/docs?api-version=2020-06-30-Preview&search="+query;
    // let result = null;
    // const options = {
    //   headers: new HttpHeaders({
    //     'api-key': "B19E90B67030381DCA58FA3C9052AF3A",
    //     'Content-Type': 'application/json'

    //   })
    // };
    let url =
      'https://licensemetacogsrchsvcrkand.search.windows.net/indexes/license-index/docs/search?api-version=2020-06-30';
    let result = null;
    const options = {
      headers: new HttpHeaders({
        'api-key': '513D6D95BA892066A7BFBF6422C29E1A',
        'Content-Type': 'application/json',
      }),
    };
    result = this.http
      .post<any>(url, param, options)
      .pipe(catchError(this.handelError));
    return result;
  }
  handelError(error: any) {
    return throwError(error.message || 'Server Error');
  }
}
