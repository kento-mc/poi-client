import {bindable, inject} from 'aurelia-framework';
import { POI, Category } from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class CategoryList {
  @bindable
  pois: POI[];
  @bindable
  categories: Category[];
}
