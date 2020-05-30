import { inject, bindable } from 'aurelia-framework';
import {Category, POI} from '../../services/poi-types';
import { PoiService } from '../../services/poi-service';

@inject(PoiService)
export class AddPoiForm {
  //@bindable
  categories = ['one', 'two', 'three']; //TODO
  selectedImage: any;
  imageName: string;
  imageInfo: any;

  name: string;
  description: string;
  lat: number;
  lon: number;
  selectedCategories: string[];
  imageURL: string[] = [];
  contributor: string = 'user'; //TODO

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
    await this.ps.addPOI(this.name, this.description, this.lat, this.lon, this.selectedCategories, this.imageURL, this.contributor);
    this.resetForm();
    console.log(document.getElementsByClassName('ui fluid dropdown')[0]);
    console.log(document.getElementsByClassName('ui label transition visible'))
    console.log(document.querySelector('.ui.label.transition.visible').innerHTML);
  }

  resetForm() {
    this.categories = [];
    this.selectedImage = null;
    this.imageName = '';
    this.imageInfo = null;
    this.name = '';
    this.description = '';
    this.lat = null;
    this.lon = null;
    this.selectedCategories = [];
    this.imageURL = [];
    this.contributor = 'user'; //TODO
    // new Redirect() //TODO try this
  }

  logChange(event) {
    console.log(event);
  }
}
