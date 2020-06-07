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
        title: 'POIs'
      },
      {
        route: 'pois/:id/update',
        name: 'poi-update',
        moduleId: PLATFORM.moduleName('views/poi-update'),
        nav: false,
        title: 'POI Update'
      },
      {
        route: 'pois/:id/image/:image',
        name: 'poi-image',
        moduleId: PLATFORM.moduleName('views/poi-image'),
        nav: false,
        title: 'POI Image'
      },
      {
        route: 'settings',
        name: 'Settings',
        moduleId: PLATFORM.moduleName('views/settings'),
        nav: true,
        title: 'Settings'
      },
      {
        route: 'logout',
        name: 'logout',
        moduleId: PLATFORM.moduleName('views/logout'),
        nav: true,
        title: 'Logout'
      }
    ]);
    this.router = router;
  }
}
