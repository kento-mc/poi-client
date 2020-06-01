import { inject } from 'aurelia-framework';
import {Category, POI, User} from '../services/poi-types';
import { PoiService } from '../services/poi-service';

@inject(PoiService)
export class Dashboard {
  user: User;
  pois: POI[];
  poisextended: any[];
  categories: Category[];
  usercategories: Category[];

  constructor(private ps: PoiService) {
    this.user = ps.loggedInUser;
    this.pois = ps.pois;
    this.poisextended = ps.poisExtended;
    this.categories = ps.categories;
    this.usercategories = ps.userCategories;
  }
}
