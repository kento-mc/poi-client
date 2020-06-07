import { bindable, inject } from 'aurelia-framework';
import { POI } from '../../services/poi-types';
import { PoiService } from "../../services/poi-service";

@inject(PoiService)
export class ImageGallery {
  //@bindable
  poi: POI;
  @bindable
  id: string;
  cleanURLs: any[] = []

  constructor(private ps: PoiService) {}

  async attached() {
    await this.getPoiById(this.id);
  }

  async getPoiById(id: string) {
    this.poi = await this.ps.getPoiById(id);
    this.getCleanUrls();
  }

  getCleanUrls() {
    this.ps.urlPairs = [];
    this.poi.imageURL.forEach(url => {
      let newURL = url.replace('http://', '')
      newURL = newURL.replace(/\//g,'');
      let newPair = {
        url: url,
        cleanURL: newURL
      }
      this.cleanURLs.push(newPair);
      this.ps.urlPairs.push(newPair);
    });
  }
}
