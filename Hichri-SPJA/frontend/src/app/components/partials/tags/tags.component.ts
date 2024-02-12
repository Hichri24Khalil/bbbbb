import { Component,OnInit } from '@angular/core';

import { Tag } from 'src/app/Shared/models/Tag';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
tags?:Tag[];
constructor(productService:ProductService) {
  productService.getAllTags().subscribe(serverTags=> {
  this.tags = serverTags;
  });
}

ngOnInit(): void {

}
}
