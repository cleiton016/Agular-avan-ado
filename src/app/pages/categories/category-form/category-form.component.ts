import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  currentAtion: string;                 //Oque o formulario deve fazer "Criar ou editar"
  categoryForm: FormGroup;              //Formulario
  pageTitle: string;                    // Titulo da pagina dependendo do que ele deve fazer
  serverErrorMessages: string[] = null; // Erro do servidor
  submittingForm: boolean = false;      // Para desabilitar o botão do formulario evitando varias submiçoes seguidas
  category: Category = new Category();


  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAtion(); //Verifica se esta editando ou criando
    this.buildCategoryForm(); // Define o formulario de Categoria
    this.loadCategiry(); //Carrega a categoria caso esteja editando


  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  //PRIVITE METHODS

  private setCurrentAtion(){
    if(this.route.snapshot.url[0].path == 'new'){
      this.currentAtion = 'new';
    } else {
      this.currentAtion = 'edit'
    }
  }

  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategiry(){
    if (this.currentAtion == 'edit'){

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category) //add values to form
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }


  private setPageTitle(){
    if (this.currentAtion == 'new'){
      this.pageTitle = 'Cadastro de Nova Categoria'
    } else {
      this.pageTitle = `Editando Categoria ${this.category.name || ""}`
    }
  }
}
