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
  userCustomCats: Category[] = [];
  urlPairs: any[] = [];

  constructor(private httpClient: HttpClient, private ea: EventAggregator, private au: Aurelia, private router: Router) {
    httpClient.configure(http => {
      http.withBaseUrl('http://localhost:3000');
    });
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

  async getPoiById(id: string) {
    const response = await this.httpClient.get('/api/pois/' + id);
    const rawPOI: RawPOI = await response.content;
    const response2 = await this.httpClient.get( '/api/users/' + rawPOI.contributor);
    const user: User = await response2.content;
    const cats: Category[] = [];
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
      _id: rawPOI._id
    }
    return poi;
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
      const poi: POI = {
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
        _id: rawPOI._id
      }
      this.pois.push(poi)
    }
    console.log(this.pois);
  }

  async updateAndGetPoi(id: string, poi: any, newImage: string) {
    const response1 = await this.httpClient.put( '/api/pois/' + id + '/update', poi);
    const rawPOI: RawPOI = await response1.content;
    const cats: Category[] = [];
    const response2 = await this.httpClient.get( '/api/users/' + rawPOI.contributor);
    const user: User = await response2.content;
    for (let catId of rawPOI.categories) {
      const cat = await this.getCategoryById(catId)
      cats.push(cat);
    }

    const updatedPOI: POI = {
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
      _id: rawPOI._id
    }
    return updatedPOI;
  }

  async deletePoi(id: string) {
    let index: number;
    for (let i = 0; i < this.pois.length; i++) {
      if (this.pois[i]._id === id) {
        index = i;
      }
    }
    const response = await this.httpClient.delete('/api/pois/' + id);
    if (response.isSuccess) {
      this.pois.splice(index,1);
      console.log(this.pois);
    }
  }

  backToPoiView(id: string) {
    this.router.navigate('#/pois/' + id);
  }

  backToPoisView() {
    this.router.navigate('#/pois');
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
    this.userCategories = [];
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
    this.userCustomCats = [...userCats];
    this.userCategories = this.categories.concat(userCats);
  }

  async addCategory(id: string, cat: any) {
    const response = await this.httpClient.post('/api/users/' + this.loggedInUser._id + '/categories', cat);
    const rawUserCat: RawCategory = await response.content;
    const category = {
      name: rawUserCat.name,
      description: rawUserCat.description,
      contributor: this.loggedInUser,
      _id: rawUserCat._id
    }
    this.userCustomCats.push(category);
    await this.getUserCategories();
  }

  async swapURL(url: string) {
    let swappedURL
    this.urlPairs.forEach(pair => {
      if (url === pair.cleanURL) {
        swappedURL = pair.url;
      }
    });
    return swappedURL;
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
    newUser.fullName = newUser.firstName + ' ' + newUser.lastName;
    newUser.isAdmin = false;
    newUser.customCategories = 0,
    newUser.contributedPOIs = 0,
    this.users.set(newUser.email, newUser);
    this.usersById.set(newUser._id, newUser);
    await this.login(email, password);
    return false;
  }

  async login(email: string, password: string) {
    let success = false;
    try {
      const response = await this.httpClient.post('/api/users/authenticate', { email: email, password: password });
      const status = await response.content;
      if (status.success) {
        this.httpClient.configure((configuration) => {
          configuration.withHeader('Authorization', 'bearer ' + status.token);
        });
        localStorage.poi = JSON.stringify(response.content);
        await this.getUsers();
        const user = this.users.get(email);
        this.loggedInUser = user;
        await this.getPOIs();
        await this.getCategories();
        await this.getUserCategories();
        this.changeRouter(PLATFORM.moduleName('app'))
        success = status.success;
      }
    } catch (e) {
      success = false;
    }
    return success;
  }

  checkIsAuthenticated() {
    let authenticated = false;
    if (localStorage.donation !== 'null') {
      authenticated = true;
      this.httpClient.configure(http => {
        const auth = JSON.parse(localStorage.poi);
        http.withHeader('Authorization', 'bearer ' + auth.token);
      });
      this.changeRouter(PLATFORM.moduleName('app'));
    }
  }

  logout() {
    localStorage.poi = null;
    this.httpClient.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
    this.loggedInUser = null;
    this.changeRouter(PLATFORM.moduleName('start'));
  }

  changeRouter(module: string) {
    this.router.navigate('/', { replace: true, trigger: false });
    this.router.reset();
    this.au.setRoot(PLATFORM.moduleName(module));
  }
}
