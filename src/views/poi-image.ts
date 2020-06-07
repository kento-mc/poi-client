import { inject } from 'aurelia-framework';
import { POI } from '../services/poi-types';
import { PoiService } from '../services/poi-service';

@inject(PoiService)
export class Poi {
  id: string;
  image: string;
  poi: POI;

  constructor(private ps: PoiService) {}

  canActivate(params) {
    this.id = params.id;
    this.image = params.image;
  }

  async attached() {
    await this.getPoiById(this.id);
    await this.swapURL(this.image);
  }

  async getPoiById(id: string) {
    this.poi = await this.ps.getPoiById(id)
  }

  async swapURL(url: string) {
    this.image = await this.ps.swapURL(url);
    console.log(this.image);
  }
}
