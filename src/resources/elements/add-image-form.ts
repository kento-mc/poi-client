import {bindable, inject} from 'aurelia-framework';
import {POI, Category, User} from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class AddImageForm {
  @bindable
  poi: POI;
  newImage: string = '';
  newURLs: string[] = [];

  selectedImage: any;
  imageName: string;
  imageInfo: any;

  constructor(private ps: PoiService) {};

  getImage(event) {
    this.selectedImage = event.target.files[0];
    this.imageName = this.selectedImage.name;
    console.log(this.selectedImage);
  }

  async addImage() {
    this.imageName = '';
    this.imageInfo = await this.ps.uploadImage(this.selectedImage);
    this.newImage = this.imageInfo.url;
    this.newURLs = [...this.poi.imageURL]
    this.newURLs.push(this.newImage);
    //this.poi.imageURL.push(this.imageInfo.url);

    const poiUpdate = {
      name: this.poi.name,
      description: this.poi.description,
      lat: this.poi.location.lat,
      lon: this.poi.location.lon,
      thumbnailURL: this.poi.thumbnailURL,
      imageURL: this.newURLs
    }
    this.poi = await this.ps.updateAndGetPoi(this.poi._id, poiUpdate, this.newImage)
    this.ps.backToPoiView(this.poi._id);
  }
}

