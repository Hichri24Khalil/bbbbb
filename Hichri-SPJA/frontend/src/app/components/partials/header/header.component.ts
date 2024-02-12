import { Component ,OnInit} from '@angular/core';
import { User } from 'src/app/Shared/models/User';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartQuantity=0;
  user!:User;
  constructor(cartService:CartService, private userService:UserService) {
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    })

  userService.userObservable.subscribe((newUser)=>{
   this.user=newUser;{

   }
  })
   }

  ngOnInit(): void {
  }
  logout(){
    this.userService.logout();
  }

  get isAuth(){
   const token = this.userService.getToken()
   
    return token;
  }

}
