import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { RawPOI, POI, Category } from "./poi-types";

// Cloudinary config
//const cloudinary = require('cloudinary').v2;
//const cl = new cloudinary.Cloudinary({cloud_name: "dwgak0rbs"});

@inject(HttpClient, EventAggregator, Aurelia, Router)
export class PoiService {
  pois: POI[] = [];
  categories: Category[] = [];

  constructor(private httpClient: HttpClient, private cloudClient: HttpClient, private ea: EventAggregator, private au: Aurelia, private router: Router) {
    httpClient.configure(http => {
      http.withBaseUrl('http://localhost:8080');
    });
    this.getCategories();
  }

  async uploadImage(file) {
    const cloudClient = new HttpClient();
    cloudClient.configure( http => {
      http.withBaseUrl('https://api.cloudinary.com/v1_1/dwgak0rbs');
    });
    const imageFile = file;
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'asbqtcgx');

    const response = await cloudClient.post('/image/upload', formData);
    console.log(response.content);
    return response.content;
  }

  async addPOI(name: string, description: string, lat: number, lon: number, selectedCategories: string[],
           imageURL: string[], contributor: string) {
    const user = 'tempUser';

    const poiPayload = {
      name: name,
      description: description,
      location: {
        lat: lat,
        lon: lon
      },
      categories: selectedCategories,
      imageURL: imageURL,
      thumbnailURL: imageURL[0],
      contributor: user
    }

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
