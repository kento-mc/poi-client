import { inject, bindable } from 'aurelia-framework';
import {Category, POI, User} from '../../services/poi-types';
import { PoiService } from '../../services/poi-service';

@inject(PoiService)
export class AddPoiForm {
  @bindable
  user: User;
  @bindable
  categories: Category[];
  @bindable
  usercategories: Category[];

  selectedImage: any;
  imageName: string;
  imageInfo: any;

  name: string;
  description: string;
  lat: number;
  lon: number;
  selectedCategories: string[];
  imageURL: string[] = [];

  constructor(private ps: PoiService) {}

  activate() {} //TODO use to inject script?

  getImage(event) {
    this.selectedImage = event.target.files[0];
    this.imageName = this.selectedImage.name;
    console.log(this.selectedImage);
  }

  async submitPOI () {
    this.imageName = '';
    this.imageInfo = await this.ps.uploadImage(this.selectedImage);
    this.imageURL.push(this.imageInfo.url);
    //const catIds = await this.ps.getCategoryIds(this.selectedCategories);
    console.log(this.selectedCategories);
    await this.ps.addPOI(this.name, this.description, this.lat, this.lon, this.selectedCategories, this.imageURL);
    this.resetForm();
  }

  resetForm() {
    this.selectedImage = null;
    this.imageName = '';
    this.imageInfo = null;
    this.name = '';
    this.description = '';
    this.lat = null;
    this.lon = null;
    this.selectedCategories = [];
    this.imageURL = [];
      // new Redirect() //TODO try this
  }

  logChange(event) {
    console.log(event);
  }
}
