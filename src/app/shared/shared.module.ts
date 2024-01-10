import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "./angular-material.module";
import { TranslocoRootModule } from "app/transloco-root.module";

@NgModule({
  imports: [
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslocoRootModule
  ],
  exports: [
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslocoRootModule
  ]
})
export class SharedModule { };
