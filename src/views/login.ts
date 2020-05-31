import { inject } from 'aurelia-framework';
import { PoiService } from '../services/poi-service';

@inject(PoiService)
export class Login {
  email = 'homer@simpson.com';
  password = '$2a$10$HnapEWWKQQ0.0Ft33nXxtuJ0fsmd9ywYswEzT4C.6Ul5y6cOU.UEa';
  prompt = '';

  constructor(private ps: PoiService) {}

  async login(e) {
    console.log(`Trying to log in ${this.email}`);
    const success = await this.ps.login(this.email, this.password);
    if (!success) {
      this.prompt = "Oops! Try again...";
    }
  }
}
