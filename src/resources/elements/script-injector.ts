import { bindingMode, customElement, bindable, noView } from "aurelia-framework";

@noView()
@customElement('script-injector')
export class ScriptInjector {

  path ="url(../../../dropdown.js)"
  @bindable({defaultBindingMode: bindingMode.oneWay}) scriptTag;

  attached() {
    if (this.path) {
      this.scriptTag = document.createElement('script');
      this.scriptTag.setAttribute('src', this.path);
      document.body.appendChild(this.scriptTag);
    }
  }

  detached() {
    if (this.scriptTag) {
      this.scriptTag.remove();
    }
  }
}
