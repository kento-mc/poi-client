import { bindable, inject } from 'aurelia-framework';
import { POI } from '../../services/poi-types';
import { PoiService } from "../../services/poi-service";

@inject(PoiService)
export class ShowImage {
  @bindable
  poi: POI;
  @bindable
  image: string;
}
