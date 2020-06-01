import {bindable, inject} from 'aurelia-framework';
import {POI, Category, User} from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class ShowPoi {
  @bindable
  user: User;
  @bindable
  pois: POI[];
  @bindable
  categories: Category[];
  @bindable
  usercustomcats: Category[];
  @bindable
  id: string;
  poi: POI;

  constructor(private ps: PoiService) {}

  attached() {
    //this.getPoiByName(this.id);
    this.getPoiById(this.id);
  }

  async getPoiById(id: string) {
    //this.poi = this.ps.getPoiByName(name);
    this.poi = await this.ps.getPoiById(id)
  }
}
