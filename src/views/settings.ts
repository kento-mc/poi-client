import { inject } from 'aurelia-framework';
import {Category, POI, User} from '../services/poi-types';
import { PoiService } from '../services/poi-service';

@inject(PoiService)
export class Settings {
  user: User;
  pois: POI[];
  categories: Category[];

  constructor(private ps: PoiService) {
    this.pois = ps.pois;
    this.categories = ps.categories;
    this.user = ps.loggedInUser;
  }
}
