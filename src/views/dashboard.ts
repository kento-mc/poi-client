import { inject } from 'aurelia-framework';
import {Category, POI, User} from '../services/poi-types';
import { PoiService } from '../services/poi-service';

@inject(PoiService)
export class Dashboard {
  user: User;
  pois: POI[];
  categories: Category[];
  usercategories: Category[];
  usercustomcats: Category[];
  userpois: POI[];

  constructor(private ps: PoiService) {
    this.user = ps.loggedInUser;
    this.pois = ps.pois;
    this.categories = ps.categories;
    this.usercategories = ps.userCategories;
    this.usercustomcats = ps.userCustomCats;
    this.userpois = ps.userPois;
  }
}
