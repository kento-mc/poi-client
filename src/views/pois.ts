import { inject } from 'aurelia-framework';
import { POI } from '../services/poi-types';
import { PoiService } from '../services/poi-service';

@inject(PoiService)
export class Pois {
  pois: POI[];

  constructor(private ps: PoiService) {
    this.pois = ps.pois;
  }
}
