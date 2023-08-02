import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  providers: [],
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource: MatTableDataSource<Ingredient> = new MatTableDataSource();
  displayedColumns: string[] = ['position', 'name', 'amount', 'select', 'edit'];
  selection = new SelectionModel<Ingredient>(true, []);

  editMode: boolean = false;
  ingredientName: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private ingredientsChangedSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) { };

  ngOnInit() {
    this.dataSource = new MatTableDataSource(
      this.shoppingListService.getIngredients());
    this.ingredientsChangedSubscription = this.shoppingListService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.dataSource.data = ingredients;
        }
      );
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

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
    this.ingredientName = this.shoppingListService.getIngredient(index).name;
  }

  onDeleteItem(index: number) {
    this.shoppingListService.deleteIngredient(index);
    this.shoppingListService.startedEditing.next(null);
  }

  ngOnDestroy(): void {
    this.ingredientsChangedSubscription.unsubscribe();
  }

  toggleEditMode(event) {
    this.editMode = event;
  }
}
