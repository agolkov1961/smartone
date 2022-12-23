import {Injectable} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {BehaviorSubject, filter, Observable} from 'rxjs';

@Injectable()
export class ProductsListHelperService {

  constructor(private confirmationService: ConfirmationService) {}

  confirmAction(key: string, message: string, header: string, icon?: string): Observable<boolean> {
    const bs = new BehaviorSubject(null) as BehaviorSubject<boolean | null>;
    this.confirmationService.confirm({
      key, message, header: header || 'xxx', icon,
      accept: () => {
        bs.next(true);
        bs.complete();
      },
      reject: () => {
        bs.next(false);
        bs.complete();
      }
    });
    return bs.pipe(filter(x => x !== null)) as Observable<boolean>;
  }
}
