import { bindable } from 'aurelia-framework';
import { POI, User } from '../../services/poi-types';

export class DashboardHeader {
  @bindable
  user: User;
  @bindable
  pois: POI[];
}
