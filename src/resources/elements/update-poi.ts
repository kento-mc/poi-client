import {bindable, inject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
import {POI, Category, User} from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class UpdatePoi {
  @bindable
  user: User;
  /*  @bindable
    pois: POI[];
    @bindable
    categories: Category[];
  @bindable
  usercustomcats: Category[];*/
  @bindable
  id: string;
  poi: POI;

  name: string;
  description: string;
  lat: number;
  lon: number;
  thumbnailURL: string;


  constructor(private ps: PoiService) {}

  async attached() {
    await this.getPoiById(this.id);
  }

  async getPoiById(id: string) {
    this.poi = await this.ps.getPoiById(id)
  }

  async updatePoi() {
    const poiUpdate = {
      name: (typeof this.name === 'undefined') ? this.poi.name : this.name,
      description: (typeof this.description === 'undefined') ? this.poi.description : this.description,
      lat: (typeof this.lat === 'undefined') ? this.poi.location.lat : this.lat,
      lon: (typeof this.lon === 'undefined') ? this.poi.location.lon : this.lon,
      thumbnailURL: (typeof this.thumbnailURL === 'undefined') ? this.poi.thumbnailURL : this.thumbnailURL
    }
    this.poi = await this.ps.updateAndGetPoi(this.id, poiUpdate)
    this.ps.backToPoiView(this.id);
  }
}
