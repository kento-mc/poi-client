import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import {RawPOI, POI, Category, User} from "./poi-types";

@inject(HttpClient, EventAggregator, Aurelia, Router)
export class PoiService {
  users: Map<string, User> = new Map();
  pois: POI[] = [];
  categories: Category[] = [];

  constructor(private httpClient: HttpClient, private ea: EventAggregator, private au: Aurelia, private router: Router) {
    httpClient.configure(http => {
      http.withBaseUrl('http://localhost:3000');
    });
    this.getUsers();
    this.getPOIs();
    this.getCategories();
  }

  async uploadImage(file) {
    const cloudClient = new HttpClient();
    cloudClient.configure(http => {
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

    const poi: POI = {
      name: name,
      description: description,
      location: {
        lat: lat,
        lon: lon,
      },
      categories: selectedCategories,
      imageURL: imageURL,
      thumbnailURL: imageURL[0],
      contributor: contributor
    }

    this.pois.push(poi);
  }

  getPoiByName(name: string) { //TODO refactor for DB
    for (let poi of this.pois) {
      if (poi.name == name) {
        return poi;
      }
    }
  }

  async getUsers() {
    const response = await this.httpClient.get('/api/users');
    const users = await response.content;
    users.forEach(user => {
      this.users.set(user.email, user);
    });
    console.log(this.users);
  }

  async getPOIs() {
    const response = await this.httpClient.get('/api/pois');
    this.pois = await response.content;
    console.log(this.pois);
  }

  async getCategories() {
    const response = await this.httpClient.get('/api/categories');
    this.categories = await response.content;
    console.log(this.categories);
  }

  signup(firstName: string, lastName: string, email: string, password: string) {
    //this.changeRouter(PLATFORM.moduleName('app'));
    return false;
  }

  async login(email: string, password: string) {
    const user = this.users.get(email);
    if (user && (user.password === password)) {
      this.changeRouter(PLATFORM.moduleName('app'))
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.changeRouter(PLATFORM.moduleName('start'))
  }

  changeRouter(module: string) {
    this.router.navigate('/', { replace: true, trigger: false });
    this.router.reset();
    this.au.setRoot(PLATFORM.moduleName(module));
  }
}
