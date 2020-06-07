import {bindable, inject} from 'aurelia-framework';
import {POI, Category, User} from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";
import { EventAggregator } from 'aurelia-event-aggregator';
import {PoiLocation} from "../../services/messages";

@inject(PoiService, EventAggregator)
export class ShowPoi {
  @bindable
  user: User;
  @bindable
  pois: POI[];
  @bindable
  categories: Category[];
  @bindable
  usercustomcats: Category[];
  @bindable
  id: string;
  poi: POI;
  editable: boolean = false;

  constructor(private ps: PoiService, private ea: EventAggregator) {}

  async attached() {
    await this.getPoiById(this.id);
    this.isEditable(this.poi, this.user)
  }

  async getPoiById(id: string) {
    this.poi = await this.ps.getPoiById(id)
    //this.locatePOI(this.poi);
  }

  async locatePOI(poi: POI) {
    this.ea.publish(new PoiLocation(poi));
    //this.ps.locatePOI(poi);
  }

  isEditable(poi: POI, user: User) {
    if (user._id === poi.contributor._id || user.isAdmin) {
      this.editable = true;
    }
  }
}
