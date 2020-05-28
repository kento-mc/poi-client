import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { POI } from '../../services/poi-types';
import { PoiService } from '../../services/poi-service';

@inject(PoiService)
export class AddPoiForm {
  name: string;
  description: string;
  lat: number;
  lon: number;
  categories: string[] = ['dining', 'historic'];
  imageURL: string[] = ['url1'];
  contributor: string = 'user';

  constructor(private ps: PoiService) {
  }

  submitPOI () {
    this.ps.addPOI(this.name, this.description, this.lat, this.lon, this.categories, this.imageURL, this.contributor);
  }
}
