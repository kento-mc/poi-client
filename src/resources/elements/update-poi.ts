import {bindable, inject} from 'aurelia-framework';
import {POI, Category, User} from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class UpdatePoi {
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

  async attached() {
    await this.getPoiById(this.id);
  }

  async getPoiById(id: string) {
    this.poi = await this.ps.getPoiById(id)
  }
}
