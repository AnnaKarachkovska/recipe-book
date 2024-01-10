import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { YesNoDialogComponent } from "app/shared/components";

import { Ingredient } from "../shared/models/ingredient.model";
import { ShoppingListService } from "../shared/services/shopping-list.service";
import { MediaMatcher } from "@angular/cdk/layout";
import { translate } from "@ngneat/transloco";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements AfterViewInit {
  dataSource: MatTableDataSource<Ingredient> = new MatTableDataSource();
  displayedColumns: string[] = ['select', 'position', 'name', 'amount', 'edit'];
  selection = new SelectionModel<Ingredient>(true, []);

  mediaChange: boolean = false;

  public editedItem?: Ingredient;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  localizedRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 ${translate('shopList.paginator.of')} ${length}`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} ${translate('shopList.paginator.of')} ${length}`;
  }

  constructor(
    private shoppingListService: ShoppingListService,
    private dialog: MatDialog,
    private mediaMather: MediaMatcher,
  ) {
    this.dataSource = new MatTableDataSource(this.shoppingListService.getIngredients());

    this.shoppingListService.ingredientsChanged
      .pipe(takeUntilDestroyed())
      .subscribe(ingredients => {
        this.dataSource.data = ingredients;
        this.editedItem = undefined;
      });

    this.listenToWindowSizeChange();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.paginator !== undefined) {
      this.paginator._intl.itemsPerPageLabel = translate('shopList.paginator.perPage');
      this.paginator._intl.nextPageLabel = translate('shopList.paginator.next');
      this.paginator._intl.previousPageLabel = translate('shopList.paginator.previous');
      this.paginator._intl.getRangeLabel = this.localizedRangeLabel;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(element?: Ingredient): string {
    if (!element) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(element) ? 'deselect' : 'select'} element ${this.dataSource.data.indexOf(element) + 2}`;
  }

  editItem(id: string) {
    this.editedItem = this.shoppingListService.getIngredient(id);
    this.shoppingListService.startedEditing.next(id);
  }

  deleteItem(id: string, name: string) {
    const dialogRef = this.dialog.open(
      YesNoDialogComponent,
      { data: { action: translate('yesNoDialog.delete'), name: name } }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shoppingListService.deleteIngredient(id);
        this.shoppingListService.startedEditing.next('');
      }
    });
  }

  deleteAll() {
    const dialogRef = this.dialog.open(
      YesNoDialogComponent,
      { data: { action: translate('yesNoDialog.delete'), name: translate('yesNoDialog.theseIngredients') } }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection.selected.forEach(el => {
          this.shoppingListService.deleteIngredient(el.id);
          this.shoppingListService.startedEditing.next('');
        })
        this.selection.clear();
      }
    });
  }

  private listenToWindowSizeChange() {
    let mediaQuery = this.mediaMather.matchMedia("(max-width: 473px)");
    mediaQuery.addEventListener("change", mediaQueryEvent => this.mediaChange = mediaQueryEvent.matches);

    this.mediaChange = mediaQuery.matches;
  };
}
