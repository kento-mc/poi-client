import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { RawPOI, POI, Category, User, RawCategory } from "./poi-types";
import { CategoryList } from "../resources/elements/category-list";

@inject(HttpClient, EventAggregator, Aurelia, Router)
export class PoiService {
  users: Map<string, User> = new Map();
  usersById: Map<string, User> = new Map();
  loggedInUser: User;
  pois: POI[] = [];
  categories: Category[] = [];
  userCategories: Category[] = [];

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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'asbqtcgx');

    try {
      const response = await cloudClient.post('/image/upload', formData);
      console.log(response.content);
      return response.content;
    } catch (err) {
      console.log(err)
    }
  }

  async addPOI(name: string, description: string, lat: number, lon: number, selectedCategories: string[], imageURL: string[]) {
    const catStrings: string[] = []

    const poiPayload: any = {
      name: name,
      description: description,
      location: {
        lat: lat,
        lon: lon,
      },
      categories: selectedCategories,
      imageURL: imageURL,
      thumbnailURL: imageURL[0],
      contributor: this.loggedInUser._id
    }

    const response = await this.httpClient.post('/api/pois', poiPayload);

    const poi = poiPayload;
    const poiCats: Category[] = []
    for (let catString of selectedCategories) {
      let category: Category = await this.getCategoryById(catString);
      poiCats.push(category)
    }
    poi.categories = poiCats;
    poi.contributor = this.loggedInUser;
    this.pois.push(poi);
    this.loggedInUser.contributedPOIs++;
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
      this.usersById.set(user._id, user);
    });
    console.log(this.users);
  }

  async getPOIs() {
    const response = await this.httpClient.get('/api/pois');
    const rawPOIs: RawPOI[] = await response.content;
    for (let rawPOI of rawPOIs) {
      const cats: Category[] = [];
      const response = await this.httpClient.get( '/api/users/' + rawPOI.contributor);
      const user: User = await response.content;
      for (let catId of rawPOI.categories) {
        const cat = await this.getCategoryById(catId)
        cats.push(cat);
      }
      const poi = {
        name: rawPOI.name,
        description: rawPOI.description,
        location: {
          lat: rawPOI.location.lat,
          lon: rawPOI.location.lon,
        },
        categories: cats,
        imageURL: rawPOI.imageURL,
        thumbnailURL: rawPOI.thumbnailURL,
        contributor: user,
      }
      this.pois.push(poi)
    }
    console.log(this.pois);
  }

  async addCategories(name: string, contributor: string) { //TODO
    const category = {
      name: name,
      description: '',
      contributor: contributor,
      _id: ''
    }
  }

  async getCategories() {
    const response = await this.httpClient.get('/api/categories');
    const rawCategories: RawCategory[] = await response.content;
    rawCategories.forEach(rawCat => {
      const category: Category = {
        name: rawCat.name,
        description: rawCat.description,
        contributor: this.loggedInUser,
        _id: rawCat._id
      }
      this.categories.push(category)
    });
    console.log(this.categories);
  }

  async getCategoryById(id: string) {
    const response = await this.httpClient.get('/api/categories/' + id);
    const rawCategory: RawCategory = await response.content;
    const category: Category = {
      name: rawCategory.name,
      description: rawCategory.description,
      contributor: this.loggedInUser,
      _id: rawCategory._id
    }
    return category;
  }

  async getUserCategories() {
    const userCats: Category[] = [];
    const response = await this.httpClient.get('/api/users/' + this.loggedInUser._id + '/categories');
    const rawUserCats: RawCategory[] = await response.content;
    rawUserCats.forEach(rawUserCat => {
      const category: Category = {
        name: rawUserCat.name,
        description: rawUserCat.description,
        contributor: this.loggedInUser,
        _id: rawUserCat._id
      }
      userCats.push(category)
    });
    this.userCategories = this.categories.concat(userCats);
  }

  async signup(firstName: string, lastName: string, email: string, password: string) {
    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    const response = await this.httpClient.post('/api/users', user);
    const newUser: User = await response.content;
    this.users.set(newUser.email, newUser);
    this.usersById.set(newUser._id, newUser);
    this.loggedInUser = newUser;
    this.changeRouter(PLATFORM.moduleName('app'))
    return false;
  }

  async login(email: string, password: string) {
    const user = this.users.get(email);
    if (user && (user.password === password)) {
      this.loggedInUser = user;
      await this.getUserCategories();
      this.changeRouter(PLATFORM.moduleName('app'))
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.loggedInUser = null;
    this.changeRouter(PLATFORM.moduleName('start'))
  }

  changeRouter(module: string) {
    this.router.navigate('/', { replace: true, trigger: false });
    this.router.reset();
    this.au.setRoot(PLATFORM.moduleName(module));
  }
}
