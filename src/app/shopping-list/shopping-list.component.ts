import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "./shopping-list.service";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements AfterViewInit {
  dataSource: MatTableDataSource<Ingredient> = new MatTableDataSource();
  displayedColumns: string[] = ['select', 'position', 'name', 'amount', 'edit'];
  selection = new SelectionModel<Ingredient>(true, []);

  public editedItem?: Ingredient;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private shoppingListService: ShoppingListService) {
    this.dataSource = new MatTableDataSource(this.shoppingListService.getIngredients());
    this.shoppingListService.ingredientsChanged
      .pipe(takeUntilDestroyed())
      .subscribe(ingredients => {
        this.dataSource.data = ingredients;
        this.editedItem = undefined;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  deleteItem(id: string) {
    this.shoppingListService.deleteIngredient(id);
    this.shoppingListService.startedEditing.next('');
  }

  deleteAll() {
    this.selection.selected.forEach(el => {
      this.deleteItem(el.id);
      this.selection.clear();
    })
  }
}
