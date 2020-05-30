import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      {
        route: ['', 'dashboard'],
        name: 'Dashboard',
        moduleId: PLATFORM.moduleName('views/dashboard'),
        nav: true,
        title: 'Dashboard'
      },
      {
        route: 'pois',
        name: 'POIs',
        moduleId: PLATFORM.moduleName('views/pois'),
        nav: true,
        title: 'POIs'
      },
      {
        route: 'pois/:id',
        name: 'poi',
        moduleId: PLATFORM.moduleName('views/poi'),
        nav: false,
        title: 'POI'
      },
      {
        route: 'settings',
        name: 'Settings',
        moduleId: PLATFORM.moduleName('views/settings'),
        nav: true,
        title: 'Settings'
      }
    ]);
    this.router = router;
  }
}
