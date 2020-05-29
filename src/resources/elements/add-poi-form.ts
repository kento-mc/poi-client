import { inject, bindable } from 'aurelia-framework';
import {Category, POI} from '../../services/poi-types';
import { PoiService } from '../../services/poi-service';

@inject(PoiService)
export class AddPoiForm {
  //@bindable
  //categories: Category[];
  cats = ['one', 'two', 'three'];

  name: string;
  description: string;
  lat: number;
  lon: number;
  selectedCategories: string[];
  imageURL: string[] = ['url1'];
  contributor: string = 'user';

  constructor(private ps: PoiService) {}

  submitPOI () {
    this.ps.addPOI(this.name, this.description, this.lat, this.lon, this.selectedCategories, this.imageURL, this.contributor);
  }
}
