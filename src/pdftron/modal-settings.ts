export abstract class ModalSettings implements ng.ui.bootstrap.IModalSettings {
  public readonly template: string;
  public readonly resolve: { [key: string]: Function };
  public readonly animation: boolean;
  public readonly backdrop: boolean | string;
  public readonly keyboard: boolean;
  public readonly backdropClass: string;
  public readonly size: string;
  public readonly openedClass: string;
  public readonly controller?: string | Function | Array<string | Function>;
  public readonly controllerAs?: string;
  public readonly component?: string;
  public readonly windowClass?: string;

  public constructor(
    template: string,
    controller: Function | string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: Record<string, any>,
    windowClass: string = '',
    keyboard: boolean = true,
    animation: boolean = true,
    backdrop: boolean | 'static' = true,
    size: string = 'md',
    openedClass: string = '',
    backdropClass: string = ''
  ) {
    // eslint-disable-next-line no-console
    console.log('ModalSettings#constructor');
    let controllerName;

    if (typeof controller === 'string') {
      this.component = controller;
      controllerName = controller;
    } else {
      this.controller = controller;
      this.controllerAs = '$ctrl';
      controllerName = controller.name;
    }

    this.template = template;
    this.resolve = _.mapValues(resolve, (v) => () => v);
    this.keyboard = keyboard;
    this.animation = animation;
    this.backdrop = backdrop;
    this.backdropClass = backdropClass;
    this.size = size;
    this.openedClass = openedClass;
    this.windowClass = `${ModalSettings.cssClassify(
      controllerName
    )} ${windowClass}`;
  }

  private static cssClassify(controllerName: string): string {
    // Function assumes class name is CamelCase of <SomeClassName>ModalController
    const kebabed = _.kebabCase(controllerName);
    const lastDash = kebabed.lastIndexOf('-');
    return kebabed.slice(0, lastDash);
  }
}
