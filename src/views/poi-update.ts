import { inject } from 'aurelia-framework';
import {Category, User, POI } from '../services/poi-types';
import { PoiService } from '../services/poi-service';

@inject(PoiService)
export class PoiUpdate {
  user: User;
  pois: POI[];
  categories: Category[];
  usercustomcats: Category[];
  id: string;

  constructor(private ps: PoiService) {
    this.user = ps.loggedInUser
    this.pois = ps.pois;
    this.categories = ps.categories;
    this.usercustomcats = ps.userCustomCats;
  }

  canActivate(params) {
    this.id = params.id;
  }
}
