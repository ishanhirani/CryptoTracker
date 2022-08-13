import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Route, Router } from '@angular/router';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.css']
})
export class CoinListComponent implements OnInit {
  
  bannerData:any;
  currency :string="INR";
  displayedColumns: string[] = ['symbol', 'current_price', 'market_cap_change_percentage_24h', 'market_cap'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api:ApiService, private router:Router,private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.getBannerData();
    this.getAllData();
    this.currencyService.getCurrency()
    .subscribe(val=>{
      this.currency= val;
      this.getAllData();
      this.getBannerData();
    })
  }
  getBannerData(){
    this.api.getTrendingCurrency(this.currency)
    .subscribe(res=>{
      console.log(res);
      this.bannerData = res;
    })
  }
  getAllData(){
    this.api.getCurrency(this.currency)
    .subscribe(res=>{
      console.log(res);
      // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(res);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoDetails(row:any){
    this.router.navigate(['coin-detail',row.id]);
  }

}
