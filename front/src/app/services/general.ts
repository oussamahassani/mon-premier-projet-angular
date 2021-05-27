import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { ProductService } from "./product/product.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError } from "rxjs/internal/operators/catchError";
import { finalize } from "rxjs/operators";
import { GeneralService } from "./general.service";

export class GeneralDataSource implements DataSource<any> {
    public data = [];
    public generalSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private generalService: GeneralService) { }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.generalSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.generalSubject.complete();
        this.loadingSubject.complete();
    }

    loadItems(skip, limit, sort, sortOrder, searchText, entity, query?) {
        this.loadingSubject.next(true);
            this.generalService.getBunch(skip, limit, sort, sortOrder, searchText, entity, query).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(items => {
                    this.generalSubject.next(items)
                });
    }
}