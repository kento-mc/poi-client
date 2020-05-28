import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import {RawPOI, POI} from "./poi-types";

@inject(HttpClient, EventAggregator, Aurelia, Router)
export class PoiService {
  pois: POI[] = [];

  addPOI(name: string, description: string, lat: number, lon: number, categories: string[],
           imageURL: string[], contributor: string) {
    const poi = {
      name: name,
      description: description,
      lat: lat,
      lon: lon,
      categories: categories,
      imageURL: imageURL,
      thumbnailURL: imageURL[0],
      contributor: contributor
    }
    this.pois.push(poi);
  }
}
