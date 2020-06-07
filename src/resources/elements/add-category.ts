import {bindable, inject} from 'aurelia-framework';
import {POI, Category, User} from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class AddCategory {
  @bindable
  user: User;
  @bindable
  usercustomcats: Category[];

  cat: string;

  constructor(private ps: PoiService) {}

  async addCategory() {
    const category = {
      name: this.cat,
      description: ''
    }
    await this.ps.addCategory(this.user._id, category);
    this.resetForm();
  }

  resetForm() {
    this.cat = '';
  }
}
