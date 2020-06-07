import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import {PoiService} from "../../services/poi-service";
import { LeafletMap } from '../../services/leaflet-map';
import { PoiLocation } from '../../services/messages';
import { POI } from '../../services/poi-types';

@inject(PoiService, EventAggregator)
export class SimpleMap {
  mapId = 'simple-map';
  mapHeight = 300;
  map: LeafletMap;
  @bindable
  id: string;
  poi: POI;

  constructor(private ps: PoiService, private ea: EventAggregator) {
    ea.subscribe(PoiLocation, (msg) => {
      this.renderPoi(msg.poi);
    });
  }

  renderPoi(poi: POI) {
    if (this.map) {
      this.map.addMarker(poi.location);
      this.map.moveTo(12, poi.location);
    }
  }

  async getPoiById(id: string) {
    this.poi = await this.ps.getPoiById(id)
  }

  async attached() {
    await this.getPoiById(this.id);
    const mapConfig = {
      location: this.poi.location,
      zoom: 8,
      minZoom: 7,
    };
    this.map = new LeafletMap(this.mapId, mapConfig, 'Terrain');
    this.map.addMarker(this.poi.location);
    //this.renderPoi(this.poi);
  }
}
