import * as _ from 'lodash';
import { PDFViewerModalSettings } from './pdf-viewer.modal-settings';

interface FilesTypeInterface {
  [key: string]: any;
}
const FILE_TYPES: FilesTypeInterface = {
  default: {
    image_url: image_path('files/icons/default.svg'),
    exts: [
      'avi',
      'flv',
      'dwg',
      'dxf',
      'gc3',
      'ifc',
      'rvt',
      'nwd',
      'kmz',
      'eml',
      'ln3',
      'msg',
      'mpp',
      'pan',
      'rd3',
      'xer',
      'tiff',
      'tif',
      'tn3',
      'tp3',
      'zdd',
    ],
  },
  doc: {
    image_url: image_path('files/icons/doc.svg'),
    exts: ['txt', 'doc', 'pages', 'docx'],
  },
  image: {
    image_url: image_path('files/icons/image.svg'),
    exts: ['png', 'jpg', 'gif', 'jpeg', 'bmp', 'svg'],
  },
  music: {
    image_url: image_path('files/icons/music.svg'),
    exts: ['wav', 'mp3'],
  },
  pdf: {
    image_url: image_path('files/icons/pdf.svg'),
    exts: ['pdf'],
  },
  slide: {
    image_url: image_path('files/icons/slide.svg'),
    exts: ['key', 'ppt', 'pptx', 'pps'],
  },
  spreadsheet: {
    image_url: image_path('files/icons/spreadsheet.svg'),
    exts: ['numbers', 'xls', 'xlsx', 'xltx', 'xlt', 'csv', 'xlsm'],
  },
  video: {
    image_url: image_path('files/icons/video.svg'),
    exts: ['mkv', 'mov', 'mp4', 'webm'],
  },
  zip: {
    image_url: image_path('files/icons/zip.svg'),
    exts: ['zip', 'zipx'],
  },
};

export class FileService {
  public static $inject = ['$uibModal'];

  public constructor(private $uibModal: any) {}

  // eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
  public view(
    entity: any,
    entityKind: string = 'attachment',
    forceViewOnlyPdf: boolean = false
  ): void {
    // eslint-disable-next-line no-console
    console.log('FileService#view');
    const fileName = (() => {
      switch (entityKind) {
        case 'attachment':
          return entity.name;

        case 'bubble':
          return entity.file_url;

        default:
          break;
      }
    })();

    let fileType = this.getFileType(fileName);

    if (entityKind === 'attachment' && entity.kind !== 'file') {
      fileType = 'default';
    }

    // eslint-disable-next-line no-console
    console.log('FileService#view', { fileType, entityKind });

    switch (fileType) {
      case 'pdf':
        switch (entityKind) {
          case 'attachment':
            return this.$uibModal.open(
              new PDFViewerModalSettings(
                entity.name,
                entity.name,
                entity.file_url,
                async (url, size) => {
                  // eslint-disable-next-line no-console
                  await console.log(url, size);
                },
                forceViewOnlyPdf
              )
            ).result;

          case 'bubble':
            return this.$uibModal.open(
              new PDFViewerModalSettings(
                entity.content,
                entity.content,
                entity.file_url,
                async (url, size) => {
                  // eslint-disable-next-line no-console
                  await console.log(url, size);
                }
              )
            ).result;

          default:
            break;
        }

        break;

      case 'video':
      default:
        this.save(fileName, entity.file_url, true);
    }
  }

  private getFileType(filename: string) {
    const ext = this.getExtension(filename);
    return _.findKey(FILE_TYPES, (type) => _.includes(type.exts, ext));
  }

  private getExtension(filename: string) {
    const ext = filename?.split('.').pop();
    return ext?.split(' ')?.shift()?.toLowerCase();
  }

  private save(name: string, url: string, shouldEncode: boolean) {
    // noop
  }
}
