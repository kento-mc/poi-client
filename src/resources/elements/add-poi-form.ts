import { inject, bindable } from 'aurelia-framework';
import {Category, POI} from '../../services/poi-types';
import { PoiService } from '../../services/poi-service';

@inject(PoiService)
export class AddPoiForm {
  //@bindable
  //categories: Category[];
  cats = ['one', 'two', 'three'];
  selectedImage: any;
  imageInfo: any;

  name: string;
  description: string;
  lat: number;
  lon: number;
  selectedCategories: string[];
  image: any;
  imageURL: string[] = [];
  contributor: string = 'user';

  constructor(private ps: PoiService) {}

  getImage(event) {
    this.selectedImage = event.target.files[0];
    console.log(this.selectedImage);
  }

  async submitPOI () {
    this.imageInfo = await this.ps.uploadImage(this.selectedImage);
    this.imageURL.push(this.imageInfo.url);
    this.ps.addPOI(this.name, this.description, this.lat, this.lon, this.selectedCategories, this.imageURL, this.contributor);
  }
}
