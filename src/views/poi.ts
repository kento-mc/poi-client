import { inject } from 'aurelia-framework';
import {Category, POI} from '../services/poi-types';
import { PoiService } from '../services/poi-service';

@inject(PoiService)
export class Poi {
  pois: POI[];
  categories: Category[];
  id: string;

  constructor(private ps: PoiService) {
    this.pois = ps.pois;
    this.categories = ps.categories;
  }

  canActivate(params) {
    console.log(params);
    this.id = params.id;
    console.log(this.id);
  }
}
