import { Component, NgModule, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private http: HttpClient) 
  {

  }

  ngOnInit(): void {
    this.loadMobile();
  }

  title = 'frontendMobile';

  mobile={
    id:null,
    brand:'',
    model:'',
    price:''
  };

  mobiles:any[]=[];
  loadMobile()
  {
    this.http.get<any[]>(`http://54.167.213.57:8080/mobile/getallmobile`).subscribe({
      next:data=>
      {
        this.mobiles=data;
      },
      error:err=>console.log(err)
    });
  }

  showForm=false;
  deleteMobile(id:any)
  {
    this.http.delete(`http://54.167.213.57:8080/mobile/deletemobile/${id}`).subscribe({
      next:data=>{
        this.loadMobile();
      },
      error:err=>console.log(err)
    });
  }

  addMobile()
  {
      this.showForm=true;
  }

  submitMobile()
  {

    if(this.mobile.id)
    {
      this.http.put(`http://54.167.213.57:8080/mobile/updatemobile/${this.mobile.id}`,this.mobile).subscribe({

        next:data=>{
          this.mobile={id:null,brand:'',model:'',price:''};
          this.loadMobile();
          this.showForm=false;
        },
        error:err=>console.log(err)
      });
    }
    else {
    this.http.post(`http://54.167.213.57:8080/mobile/addmobile`,this.mobile).subscribe({
      next:data=>{
        alert("Mobile added successfully!");
        this.mobile={id:null,brand:'',model:'',price:''};
        this.loadMobile();
        this.showForm=false;
      },
      error:err=>console.log(err)
    });}
  }

  updateMobile(id:any)
  {
    const selectedMobile=this.mobiles.find(u=>u.id===id);
    if(selectedMobile)
    {
      this.mobile={
        id:selectedMobile.id,
        brand:selectedMobile.brand,
        model:selectedMobile.model,
        price:selectedMobile.price
      };
      this.showForm=true;
    }
  }
}
