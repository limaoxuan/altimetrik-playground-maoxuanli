import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '@Services/search.service';
import { format, subDays } from 'date-fns'
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  loading = false;
  iframe = "";
  yearFormat = 'yyyy';
  validateForm: FormGroup;
  formateData = [];
  pageIndex = 1;
  pageSize = 20;
  total = 1;
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];
  date = null;
  sortName: string | null = null;
  sortValue: string | null = null;
  year = "";
  googleUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBPHAihp8amKthKODfWi8mtw4Wx-cbD4Ls&q=52557";

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }


  constructor(private fb: FormBuilder, private searchService: SearchService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      zipCode: [null, [Validators.required]],
      distance: [null, [Validators.required]],
      predominant: [null, [Validators.required]],
      year: [null, [Validators.required]]
    });
    /**
     * 1-10
     */
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 1; i < 10; i++) {
      children.push({ label: i.toString(), value: i.toString() });
    }
    this.listOfOption = children;
  }


  // default Name
  listOfData: Array<{ name: string; age: number; address: string;[key: string]: string | number }> = [
  ];
  // source data
  listOfDisplayData: Array<{ name: string; age: number; address: string;[key: string]: string | number }> = [
    ...this.listOfData
  ];


  /**
   * submitForm
   */
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.pageIndex = 1;
    this.searchData();
  }
  /**
   * searchData
   */
  searchData() {
    this.year = format(this.date, 'YYYY');
    this.googleUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBPHAihp8amKthKODfWi8mtw4Wx-cbD4Ls&q=" + this.validateForm.value.zipCode;
    console.log(this.googleUrl );
    // this.trustUrl("https://www.google.com/maps/@?api=1&map_action=map&zipcode=" + this.validateForm.value.zipCode)
    // this.iframe = ;
    var datas: any = {
      zipCode: this.validateForm.value.zipCode,
      distance: this.validateForm.value.distance,
      predominant: this.validateForm.value.predominant.join(','),
      year: this.year,
      pageIndex: this.pageIndex - 1
    }
    this.loading = true;

    this.searchService.search(datas).subscribe((res: any) => {
      // console.log(JSON.parse(res.data));

      this.dataFormat(JSON.parse(res.data));
    });
  }

  dataFormat(data: any) {
    this.loading = false;

    this.total = data.metadata.total;
    console.log(this.total);
    var data1 = [];
    for (var i = 0; i < data.results.length; i++) {
      var item = data.results[i];
      data1.push({ name: item['school.name'], size: item[this.year + '.student.size'], id: item['id'] });
    }
    this.listOfDisplayData = [...data1];



  }
  /**
   * sort by name
   * @param sort 
   */
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    var data = [...this.listOfDisplayData];
    /** sort data **/
    this.listOfDisplayData = data.sort((a, b) =>
      this.sortValue === 'ascend'
        ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
        : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
    );

  }
  trustUrl(url: string) {
    if (url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }



}
