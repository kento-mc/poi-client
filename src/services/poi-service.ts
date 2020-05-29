import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import {RawPOI, POI, Category} from "./poi-types";

@inject(HttpClient, EventAggregator, Aurelia, Router)
export class PoiService {
  pois: POI[] = [];
  categories: Category[] = [];

  constructor(private httpClient: HttpClient, private ea: EventAggregator, private au: Aurelia, private router: Router) {
    httpClient.configure(http => {
      http.withBaseUrl('http://localhost:8080');
    });
    this.getCategories();
  }

  addPOI(name: string, description: string, lat: number, lon: number, selectedCategories: string[],
           imageURL: string[], contributor: string) {
    const poi = {
      name: name,
      description: description,
      lat: lat,
      lon: lon,
      categories: selectedCategories,
      imageURL: imageURL,
      thumbnailURL: imageURL[0],
      contributor: contributor
    }
    this.pois.push(poi);
  }

  async getCategories() {
    const response = await this.httpClient.get('/api/categories.json');
    this.categories = await response.content;
    console.log(this.categories);
  }
}
