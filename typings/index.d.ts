declare module '*.html' {
  const value: string;
  export default value;
}
declare module '*.less' {
  const value: string;
  export default value;
}
declare namespace angular {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface IRootScopeService {
    fieldwireData: FieldwireData;
    networkData: NetworkData;
    pdfViewer: PDFTronWebViewer.WebViewer;
    natural(field: string): (value: any) => any;
    naturalCompare(field: string): Function;
    pluralize(resourceName: string): string;
    signOut(): void;
    reload(): void;
    redirectTo(url: any): void;
    checkboxImage: {
      NONE: string;
      SOME: string;
      ALL: string;
    };
  }
}

declare namespace angular.ui {
  import {
    StateObject,
    StateParamsService,
    StateProvider,
    StateService,
    TransitionOptions,
    UrlRouterProvider,
  } from '@uirouter/angularhybrid';
  declare type IState = StateObject;
  declare type IStateOptions = TransitionOptions;
  declare type IStateParamsService = StateParamsService;
  declare type IStateProvider = StateProvider;
  declare type IStateService = StateService;
  declare type IUrlRouterProvider = UrlRouterProvider;
}

declare namespace _ {
  interface LoDashStatic {
    hasKeys(object: Record<any, any>, predicate: Array<any>): boolean;
    isSubsequence(source: string, query: string, ignoreCase?: boolean): boolean;
  }
}

declare type Id = string;
declare type UserId = number;
declare type AccountId = number;
declare type Timestamp = string;

declare const JST: {
  [index: string]: string;
};

declare const clockSpec: any;
declare var ga: UniversalAnalytics.ga;
declare const google: any;
declare const Handsontable: any;
declare const Rollbar: any;
declare const L: any;
declare const SignaturePad: any;
declare const d3: any;
declare const nv: any;
declare const fbq: any;
declare var _rfi: any;
declare var zE: any | undefined;

declare const PDFTron: any;

declare namespace Constants {
  interface Env {
    readonly [index: string]: string;
  }
  interface Locale {
    readonly id: string;
  }
  interface LocalesMap {
    readonly de: Locale;
    readonly el: Locale;
    readonly en: Locale;
    readonly 'en-gb': Locale;
    readonly es: Locale;
    readonly fr: Locale;
    readonly it: Locale;
    readonly ja: Locale;
    readonly ko: Locale;
    readonly nl: Locale;
    readonly no: Locale;
    readonly pl: Locale;
    readonly 'pt-br': Locale;
    readonly ru: Locale;
    readonly sv: Locale;
    readonly vi: Locale;
    readonly zh: Locale;
  }
  interface StorageKeys {
    readonly HIDE_LINKS_TO_APP_STORES: string;
  }

  interface All {
    readonly ENV: Env;
    readonly LOCALES_MAP: LocalesMap;
    readonly STORAGE_KEYS: StorageKeys;
    readonly MAX_ITEMS_DISPLAY: number;
    readonly EMAIL_REGEX_STR: string;
    readonly DATE_REGEX: RegExp;
  }

  interface UserEvents {
    navigate_to_task_via_click: string;
    formsUpdated: string;
    locationsUpdated: string;
    locationsFilterCleared: string;
  }
}
declare const _ENV: Constants.Env;
declare const localesMap: Constants.LocalesMap;

declare const image_path: Function;

interface LocationsFilter {
  ids: Id[];
  explicitlySelectedIds: Id[];
  blank: boolean;
  includeDescendants: boolean;
}

interface NetworkData {
  loading: boolean;
  offline: boolean;
  reloading: boolean;
  saving: boolean;
}

interface CustomWindowProperties {
  // properties on window for graphs
  nv?: any;
  d3?: any;
  PDFTron: {
    WebViewer: () => void;
  };
  _ENV: Constants.Env;
}

interface WindowAccessor {
  window: Window & CustomWindowProperties;
}

declare namespace jasmine {
  interface Matchers<T> {
    toBeModelEqual(expected: any, expectationFailOutput?: any): Promise<void>;
  }
}

interface DragServiceFactory<T> {
  build(allEntities: any): ResourceDragService<T>;
}

interface ResourceDragService<T> {
  dragStart(entity: T, preventSetDragged?: boolean): void;
  dragEnd(entity: T): void;
  getDragged(): T[];
  isSelected(entity: T): boolean;
  getFirstDragged(): T;
  getLastDragged(): T;
  addEvents(entity: T): void;
  dragAll(): void;
  toggleDrag(entity: T): void;
  getDragging(): boolean;
  startDragging(): void;
  endDragging(): void;
  toggleDragging(): void;
  batchDrag(entity: T, skip?: any, sortedEntities?: any): void;
  countDragged(): number;
  emptyDragged(): void;
}

type BuildingInformationModelDragService = ResourceDragService<BIM.Model>;

interface ResourceCollection<T> extends Array<T> {
  lastSyncedAt: string | undefined;
}

interface Point2D {
  x: number;
  y: number;
}

interface VersionsByModelId {
  [index: string]: BIMVersion.Model[] | undefined;
}
interface BimsByFolderId {
  [index: string]: BIM.Model[] | undefined;
}

interface PricingPlan {
  projects: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  subscription: {
    plan_name: string;
    plan_id: string;
    pay_annually: boolean;
    legacy: boolean;
    card_type: string;
    last_four: string;
    current_price: number;
    invoiced_quantity: number;
    next_invoice: {
      period_end: string;
      amount_due: number;
    };
  };
  enterprise_plan?: {
    end_at: string;
    max_user_count: number;
    current_user_count: number;
  };
  account: {
    is_enterprise: boolean;
    user_count: number;
    trial_end_at: string;
    plan_name: string;
  };
}

interface PerfectScrollbarContainer extends JQuery<HTMLElement> {
  perfectScrollbar: Function;
}
