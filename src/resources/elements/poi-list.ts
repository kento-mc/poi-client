import {bindable, inject} from 'aurelia-framework';
import {POI, Category, User} from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class PoiList {
  @bindable
  user: User;
  @bindable
  pois: POI[];
  @bindable
  poisextended: any[];
  @bindable
  categories: Category[];
}
