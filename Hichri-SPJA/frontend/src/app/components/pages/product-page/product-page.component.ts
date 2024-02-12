import { Component ,OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/Shared/models/Product';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product!: Product ;
  constructor(activatedRoute:ActivatedRoute, productService:ProductService,
   private cartService:CartService,private router:Router){
activatedRoute.params.subscribe((params)=>{

  if(params.id)
  productService.getProductById(params.id).subscribe(serverProduct=>{
    this.product = serverProduct;
  })
})
  }
  ngOnInit(): void {

  }
  addToCart() {
    this.cartService.addToCart(this.product);
    this.router.navigateByUrl('/cart-page');
  }
}
