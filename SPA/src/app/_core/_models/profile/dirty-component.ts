import { Observable } from 'rxjs';

export interface DirtyComponents {
    canDeactivate: () => boolean | Observable<boolean>
}