import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/Shared/models/Product';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
/* This line defines the HomeComponent class and indicates that
it is being exported so that it can be used in other files.*/

export class HomeComponent implements OnInit {
/* Here, a property named products is declared, which is an array
of type Product. It is initialized as an empty array.*/

  products:Product[]=[];
constructor(private productService:ProductService, activatedRoute:ActivatedRoute) {
 let productsObservable:Observable <Product[]>;
  activatedRoute.params.subscribe((params) =>{
    if (params.searchTerm)
    productsObservable= this.productService.getAllProducutsBySearchTerm(params.searchTerm);
    else if(params.tag)
    productsObservable = this.productService.getAllProductsByTag(params.tag);
    else
    productsObservable= productService.getAll();

    productsObservable.subscribe((serverProducts) =>{
    this.products =serverProducts;
  })

  })
}
  /*
- Using this is important in this context because it distinguishes the property of the current instance (this.products) from any local variable with the same name
  that might exist within the constructor.
-The constructor takes an argument private productService: ProductService. This is a parameter decorated with the private access modifier, which indicates that an
  instance of the ProductService class will be injected into the HomeComponent through dependency injection. This means that the ProductService instance is provided to
  the HomeComponent when it is created.
-In summary, the constructor in HomeComponent initializes the
 products property by fetching a collection of products using the getAll method from the injected ProductService instance. The getAll method, which belongs to the
 ProductService class, is responsible for retrieving the actual collection of products from a data source.
*/
ngOnInit():void {}
}


