import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../Shared/models/User';
import { IUserLogin } from '../Shared/interfaces/IUserLogin';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../Shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../Shared/interfaces/IUserRegister';


const USER_KEY ='User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string = '';

  private userSubject =
  new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  constructor(private http:HttpClient,private toastrService:ToastrService) {
    this.userObservable=this.userSubject.asObservable();
  }

  login(userLogin: IUserLogin): Observable<{ user: User, token: string }> {
    return this.http.post<{ user: User, token: string }>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (response) => {
          const { user, token } = response;
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.setToken(token);

          this.toastrService.success(
            `Welcome to SPJA ${user.name}!`,
            'Login Successful'
          );

          console.log(token);
          console.log(user);
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        },
      })
    );
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }



 register(userRegiser:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL, userRegiser).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to the SPJA ${user.name}`,
            'Register Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,
            'Register Failed')
        }
      })
    )
  }

  logout(){
  this.userSubject.next(new User());
  localStorage.removeItem(USER_KEY);
  window.location.reload();
  }

  private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

private getUserFromLocalStorage():User{
  const userJson =localStorage.getItem(USER_KEY);
  if(userJson) return JSON.parse(userJson) as User;
  return new User();
}

}
