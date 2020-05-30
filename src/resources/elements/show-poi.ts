import {bindable, inject} from 'aurelia-framework';
import { POI, Category } from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class ShowPoi {
  @bindable
  pois: POI[];
  @bindable
  categories: Category[];
  @bindable
  id: string;
  poi: POI;

  constructor(private ps: PoiService) {}

  attached() {
    this.getPoiByName(this.id);
  }

  getPoiByName(name: string) {
    this.poi = this.ps.getPoiByName(name);
  }
}
