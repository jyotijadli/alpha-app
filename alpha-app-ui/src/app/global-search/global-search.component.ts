import {
  Component,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FileSearchService } from '../file-search.service';
import { NotificationService } from '../notification.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Pipe, PipeTransform } from '@angular/core';
// import { Http, Response, RequestOptions, Headers } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
//import { Observable } from 'rxjs';
//import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface Photo {
}
export interface Dashboard {
  StoreId: string;
  DocumentType: string;
  DocumentDate: string;
  UploadDateTime: string;
  EmployeeName: string;
  EmployeeID: string;
  PageScanned: string;
  Image: string;
  BlobURL: string;
}

@Pipe({
  name: 'unique',
  pure: false,
})
export class UniquePipe implements PipeTransform {
  transform(value: any): any {
    if (value !== undefined && value !== null) {
      return _.uniqBy(value, 'name');
    }
    return value;
  }
}
@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css'],
})
export class GlobalSearchComponent {
  xpandStatus = true;
  searchData: any;
  selectedDocumentType: any;
  selectedBusinessNameMain: any;
  selectedBusinessName: any;
  selectedStateMain: any;
  selectedCityMain: any;
  selectedZipCodeMain: any;
  selectedShopNumberMain: any;
  selectedLicenseTypeMain: any;
  selectedCountyMain: any;
  selectedExpiryDateStartMain: any;
  selectedExpiryDateEndMain: any;
  selectedUploadDateStartMain: any;
  selectedUploadDateEndMain: any;
  selectedIssueDateStartMain: any;
  selectedIssueDateEndMain: any;
  selectedLicenseNumberMain: any;
  selectedState: any;
  selectedCity: any;
  selectedZipCode: any;
  selectedShopNumber: any;
  selectedLicenseType: any;
  selectedCounty: any;
  selectedExpiryDate: any;
  perPage: any;
  photos = [];
  photoList = [];
  dashboards = [];
  dashboardList = [];
  extData: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  ExpiryDate: any;
  ShopNumber: any;
  LicenseType: any;
  LicenseTypeMain: any;
  BusinessName: any;
  DocumentType: any;
  BusinessNameMain: any;
  dashboardData: any;
  DocumentTypeMain: any;
  State: any;
  StateMain: any;
  Address = [];
  ZipCode: any;
  City: any;
  County: any;
  SearchResultResponseForCity: any[] = [];
  SearchResultResponseForZipCode: any[] = [];
  LicenseNumber = [];
  keywordBusinessName = 'BusinessName';
  keywordState = 'State';
  keywordCity = 'City';
  keywordZipCode = 'Zip';
  keywordShopNumber = 'ShopNumber';
  keywordLicenseType = 'LicenseType';
  keywordCounty = 'County';
  stateList: any;
  cityList: any;
  ELEMENT_DATA_DISPLAY: Dashboard[] = [];
  displayedColumns: string[] = [
    'StoreId',
    'DocumentType',
    'DocumentDate',
    'UploadDateTime',
    'EmployeeName',
    'EmployeeID',
    'PageScanned',
    'Image',
  ];
  dataSource: any;
  cityZipCode: any;
  htmlToAdd: any;
  idInterval: any;
  imgUrl: any;
  notFoundTemplate: any;
  placeholder: any;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  selection = new SelectionModel<Dashboard>(true, []);
  selectionDashboard = new SelectionModel<Dashboard>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  /*ngAfterContentChecked() {
    this.cdr.detectChanges();
    const sheet = document.createElement('style');
    sheet.innerHTML = '@page {scale: 70%}';
    document.getElementById('print-section').appendChild(sheet);
    // call or add here your code
    this.imgUrl = [];
    let sArray = this.selection.selected;
    for (let item, i = 0; (item = sArray[i++]); ) {
      let name = item.Url;
      this.imgUrl.push(name);
    }
    // console.log(this.imgUrl);
  }*/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.data.length;
    // return numSelected === numRows;
    let numSelected, numRows;
    if (this.selection.selected) {
      numSelected = this.selection.selected.length;
    }
    if (this.dataSource.data) {
      numRows = this.dataSource.data.length;
    }
    return numSelected === numRows;
  }
 /* onBSegmentChange(event) {
    this.selectedBusinessNameMain = event.value;
  }
  onStateChange(event) {
    this.selectedStateMain = event.value;
  }
  onLicenseTypeChange(event) {
    this.selectedLicenseTypeMain = event.value;
  }*/
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    this.imgUrl = [];
    let sArray = this.selection.selected;
    for (let item, i = 0; (item = sArray[i++]); ) {
      let name = item.Url;
      this.imgUrl.push(name);
    }
  }
  constructor(
    private fileSearchService: FileSearchService,
    private notificationService: NotificationService,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.loadBSegment();
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  search() {
    this.photos = this.queryBuilderMain();
    this.dataSource = new MatTableDataSource<Photo>(this.photos);
    this.dataSource.paginator = this.paginator;
    if (this.photos.length == 0) {
      this.notificationError();
    }
  }
  queryBuilderMain() {
    let query = {};
    if (this.selectedDocumentType) {
      query['DocumentType'] = this.selectedDocumentType;
    }
    if (this.selectedBusinessName) {
      query['BusinessName'] = this.selectedBusinessName;
    }
    if (this.selectedState) {
      query['State'] = this.selectedState;
    }
    if (this.selectedCounty) {
      query['County'] = this.selectedCounty;
    }
    if (this.selectedCity) {
      query['City'] = this.selectedCity;
    }
    if (this.selectedZipCode) {
      query['ZipCode'] = this.selectedZipCode;
    }
    if (this.selectedLicenseType) {
      query['LicenseType'] = this.selectedLicenseType;
    }
    if (this.selectedExpiryDate) {
      let dt: string =
        this.selectedExpiryDate.toString().substring(5, 7) +
        '/' +
        this.selectedExpiryDate.toString().substring(8, 10) +
        '/' +
        this.selectedExpiryDate.toString().substring(0, 4);
      query['ExpiryDate'] = dt;
    }
    if (this.selectedShopNumber) {
      query['ShopNumber'] = this.selectedShopNumber;
    }
    let photosList = this.photosList();
    let filteredData = photosList.filter((item) => {
      for (let key in query) {
        if (item[key] === undefined || !query[key].includes(item[key])) {
          return false;
        }
      }
      return true;
    });
    return filteredData;
  }
  loadBSegment() {
    /*this.httpClient.get('assets/Json/DocumentType.json').subscribe((data) => {
      this.DocumentTypeMain = data;
    });
    this.httpClient.get('assets/Json/BSegment.json').subscribe((data) => {
      this.BusinessNameMain = data;
    });*/
    this.httpClient
      .post<any>(
        'https://alpha-functionapp.azurewebsites.net/api/httptriggergetmetadata',
        { maxRecordCount: 20 }
      )
      .subscribe((data) => {
        console.log(data);
        this.dashboardData = data;
        this.extractDashboardData();
      });

    this.httpClient.get('assets/Json/State.json').subscribe((data) => {
      this.StateMain = data;
    });
    this.httpClient.get('assets/Json/LicenseType.json').subscribe((data) => {
      this.LicenseTypeMain = data;
    });
  }

  photosList() {
    let photo = [];

    for (let item of this.photoList) {
      let eData = {
        ExpiryDate: this.getFormattedDate(item.ExpiryDate),
        BusinessName: item.BusinessName,
        LicenseNumber: item.LicenseNumber,
        ShopNumber: item.ShopNumber,
        State: item.State,
        Address: '',
        City: item.City,
        ZipCode: item.ZipCode,
        merged_content: item.merged_content,
        LicenseType: item.LicenseType,
        County: item.County,
        Url: item.Url,
        DocumentType: item.DocumentType,
      };
      photo.push(eData);
    }
    return photo;
  }

  dateConvertedFormat(dateAll) {
    let date = new Date(dateAll);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day + 'T00:00+00:00';
  }
  searchAPIDashbaord() {
    console.log('=======Search===========');
    this.extractDashboardData();
  }
  searchAPI() {
    this.xpandStatus = true;
    this.Clear();
    let srcQry: string = '';
    let srcFilter: string = '';
    if (this.selectedBusinessNameMain) {
      srcQry +=
        " AND business_segment: '" + this.selectedBusinessNameMain + "'";
    }
    if (this.selectedStateMain) {
      srcQry += " AND state:'" + this.selectedStateMain + "'";
    }
    if (this.selectedCountyMain) {
      srcQry += " AND county: '" + this.selectedCountyMain + "'";
    }
    if (this.selectedCityMain) {
      srcQry += " AND city:'" + this.selectedCityMain + "'";
    }
    if (this.selectedZipCodeMain) {
      srcQry += " AND zip_code: '" + this.selectedZipCodeMain + "'";
    }
    if (this.selectedShopNumberMain) {
      srcQry += " AND store_number:'" + this.selectedShopNumberMain + "'";
    }
    if (this.selectedLicenseTypeMain) {
      srcQry += " AND license_type: '" + this.selectedLicenseTypeMain + "'";
    }
    if (this.selectedLicenseNumberMain) {
      srcQry += " AND license_number:'" + this.selectedLicenseNumberMain + "'";
    }
    if (this.selectedExpiryDateStartMain && !this.selectedExpiryDateEndMain) {
      srcFilter +=
        ' and expiration_date ge ' +
        this.dateConvertedFormat(this.selectedExpiryDateStartMain);
    } else if (
      this.selectedExpiryDateStartMain &&
      this.selectedExpiryDateEndMain
    ) {
      srcFilter +=
        ' and expiration_date ge ' +
        this.dateConvertedFormat(this.selectedExpiryDateStartMain) +
        '  and expiration_date le ' +
        this.dateConvertedFormat(this.selectedExpiryDateEndMain);
    }
    if (this.selectedUploadDateStartMain && !this.selectedUploadDateEndMain) {
      srcFilter +=
        ' and upload_date ge ' +
        this.dateConvertedFormat(this.selectedUploadDateStartMain);
    } else if (
      this.selectedUploadDateStartMain &&
      this.selectedUploadDateEndMain
    ) {
      srcFilter +=
        ' and upload_date ge ' +
        this.dateConvertedFormat(this.selectedUploadDateStartMain) +
        '  and upload_date le ' +
        this.dateConvertedFormat(this.selectedUploadDateEndMain);
    }
    if (this.selectedIssueDateStartMain && !this.selectedIssueDateEndMain) {
      srcFilter +=
        ' and issue_date ge ' +
        this.dateConvertedFormat(this.selectedIssueDateStartMain);
    } else if (
      this.selectedIssueDateStartMain &&
      this.selectedIssueDateEndMain
    ) {
      srcFilter +=
        ' and issue_date ge ' +
        this.dateConvertedFormat(this.selectedIssueDateStartMain) +
        '  and issue_date le ' +
        this.dateConvertedFormat(this.selectedIssueDateEndMain);
    }
    // console.log(srcQry.substring(4));
    // console.log(srcFilter.substring(4));
    // let param = {
    //   "queryType": "full",
    //   "search": "license_type:'STATE RX' AND state:'Texas' AND city:'Austin'"
    // }
    let param = {
      queryType: 'full',
      search: srcQry.substring(4),
      filter: srcFilter.substring(4),
    };
    this.extData = null;
    if (srcQry || srcFilter) {
      this.fileSearchService
        .searchData(this.searchData, param)
        .subscribe((resp) => {
          const response: any = resp.value;
          this.extData = response;
          this.extractData();
        });
    }
  }
  extractDashboardData() {
    this.dashboards = [];
    for (let item of this.dashboardData) {
      let eData = {
        StoreId: item.store_id,
        DocumentType: item.document_type,
        DocumentDate: item.create_date,
        UploadDateTime: item.create_date,
        EmployeeName: item.firstname + ' ' + item.lastname,
        EmployeeID: item.employee_id,
        PageScanned: '',
        Image: item.thumbnail,
        BlobURL: item.BlobURL,
      };
      console.log(eData);
      this.dashboards.push(eData);
    }
    if (this.selectedShopNumberMain) {
      this.dashboards = this.dashboards.filter((v) =>
        JSON.stringify(v)
          .toLowerCase()
          .includes(this.selectedShopNumberMain.toLowerCase())
      );
      console.log('Size=' + this.dashboards.length);
    }
    this.dashboardList = this.dashboards;
    console.log('===' + this.dashboardList);
    this.dataSource = new MatTableDataSource<Dashboard>(this.dashboards);
    this.dataSource.paginator = this.paginator;
    if (this.dashboards.length === 0) {
      this.notificationError();
    }
    this.selection = new SelectionModel<Dashboard>(true, []);

    this.loadAllAutoComplete();
  }
  extractData() {
    this.photos = [];
    let urlAppend =
      '?sv=2020-08-04&ss=bfqt&srt=sco&sp=rltfx&se=2021-10-09T20:52:36Z&st=2021-08-24T12:52:36Z&spr=https&sig=qIY0hrW%2Fn7Dz7MJxRfWaGI1v2kqr1dzZ6Wzf4s75Sms%3D';
    for (let item of this.extData) {
      if (item.url) {
        let eData = {
          ExpiryDate: item.expiration_date,
          BusinessName: item.business_segment,
          LicenseNumber: item.license_number,
          ShopNumber: item.store_number,
          State: item.state,
          Address: '',
          City: item.city,
          ZipCode: item.zip_code,
          DocumentType: item.document_type,
          merged_content: item.merged_content,
          LicenseType: item.license_type,
          County: item.county,
          Url: item.url.toString() + urlAppend,
        };
        this.photos.push(eData);
      }
    }
    this.photoList = this.photos;
    this.dataSource = new MatTableDataSource<Photo>(this.photos);
    this.dataSource.paginator = this.paginator;
    if (this.photos.length === 0) {
      this.notificationError();
    }
    //this.selection = new SelectionModel<Photo>(true, []);

    this.loadAllAutoComplete();
  }
  loadAllAutoComplete() {
    let lookupDocumentType,
      lookupBusiness,
      lookupState,
      lookupCounty,
      lookupCity,
      lookupZipCode,
      lookupLicenseType,
      lookupShopNumber = {};
    let items = this.dashboardList;
    let resultCounty,
      resultCity,
      resultZipCode,
      resultShopNumber = [];
    let lookup = {};
    let result = [];
    let resultDocumentType = [];
    let resultState = [];
    let resultBusiness = [];
    let resultLicenseType = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.DocumentType;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
        let bNameFiltered = this.DocumentTypeMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == name.toUpperCase() ||
            obj['Code'] == name.toUpperCase()
        );
        console.log(bNameFiltered);
        /* resultDocumentType.push({
          State: bNameFiltered[0].State,
          Code: bNameFiltered[0].Code,
        });*/
      }
    }
    this.DocumentType = resultDocumentType;
    result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.BusinessName;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
        /*let bNameFiltered = this.BusinessNameMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == name.toUpperCase() ||
            obj['Code'] == name.toUpperCase()
        );
        console.log(bNameFiltered);
        resultBusiness.push({
          State: bNameFiltered[0].State,
          Code: bNameFiltered[0].Code,
        });*/
      }
    }
    this.BusinessName = resultBusiness;
    result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.State;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
        /* let stateFiltered = this.StateMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == name.toUpperCase() ||
            obj['Code'] == name.toUpperCase()
        );
        console.log(stateFiltered);
        resultState.push({
          State: stateFiltered[0].State,
          Code: stateFiltered[0].Code,
        });*/
      }
    }
    this.State = resultState;
    result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.County;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    this.County = result;
    result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.City;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    this.City = result;
    result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.ZipCode;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    this.ZipCode = result;
    result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.LicenseType;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
        let licenseTypeFiltered = this.LicenseTypeMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == name.toUpperCase() ||
            obj['Code'] == name.toUpperCase()
        );
        console.log(licenseTypeFiltered);
        resultLicenseType.push({
          State: licenseTypeFiltered[0].State,
          Code: licenseTypeFiltered[0].Code,
        });
      }
    }
    this.LicenseType = resultLicenseType;
    result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.ShopNumber;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    this.ShopNumber = result;
  }
  onDocumentTypeSelected(item) {
    this.selectedDocumentType = item.value;
    this.documentTypeSelected();
  }
  documentTypeSelected() {
    let lookup = {};
    let result = [];
    let resultState = [];
    let resultBusinessName = [];
    let resultLicenseType = [];
    this.BusinessName = null;
    let countyListPhoto = this.queryBuilderMain();
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let state = innerItem.BusinessName;
      if (!(state in lookup)) {
        lookup[state] = 1;
        result.push(state);
        let stateFiltered = this.BusinessNameMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == state.toUpperCase() ||
            obj['Code'].toUpperCase() == state.toUpperCase()
        );
        console.log(stateFiltered);
        resultBusinessName.push({
          State: stateFiltered[0].State,
          Code: stateFiltered[0].Code,
        });
      }
    }
    this.BusinessName = resultBusinessName;
    lookup = {};
    result = [];
    this.State = null;
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let state = innerItem.State;
      if (!(state in lookup)) {
        lookup[state] = 1;
        result.push(state);
        let stateFiltered = this.StateMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == state.toUpperCase() ||
            obj['Code'].toUpperCase() == state.toUpperCase()
        );
        console.log(stateFiltered);
        resultState.push({
          State: stateFiltered[0].State,
          Code: stateFiltered[0].Code,
        });
      }
    }
    this.State = resultState;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let county = innerItem.County;
      if (!(county in lookup)) {
        lookup[county] = 1;
        result.push(county);
      }
    }
    this.County = result;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let city = innerItem.City;
      if (!(city in lookup)) {
        lookup[city] = 1;
        result.push(city);
      }
    }
    this.City = result;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let zip = innerItem.ZipCode;
      if (!(zip in lookup)) {
        lookup[zip] = 1;
        result.push(zip);
      }
    }
    this.ZipCode = result;
    lookup = {};
    result = [];
    resultLicenseType = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let lType = innerItem.LicenseType;
      if (!(lType in lookup)) {
        lookup[lType] = 1;
        result.push(lType);
        let licenseTypeFiltered = this.LicenseTypeMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == lType.toUpperCase() ||
            obj['Code'].toUpperCase() == lType.toUpperCase()
        );
        console.log(licenseTypeFiltered);
        resultLicenseType.push({
          State: licenseTypeFiltered[0].State,
          Code: licenseTypeFiltered[0].Code,
        });
      }
    }
    this.LicenseType = resultLicenseType;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let sNumber = innerItem.ShopNumber;
      if (!(sNumber in lookup)) {
        lookup[sNumber] = 1;
        result.push(sNumber);
      }
    }
    this.ShopNumber = result;
  }
  onBusinessNameSelected(item) {
    this.selectedBusinessName = item.value;
    this.businessNameSelected();
  }
  businessNameSelected() {
    let lookup = {};
    let result = [];
    let resultState = [];
    let resultLicenseType = [];
    this.State = null;
    let countyListPhoto = this.queryBuilderMain();
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let state = innerItem.State;
      if (!(state in lookup)) {
        lookup[state] = 1;
        result.push(state);
        let stateFiltered = this.StateMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == state.toUpperCase() ||
            obj['Code'].toUpperCase() == state.toUpperCase()
        );
        console.log(stateFiltered);
        resultState.push({
          State: stateFiltered[0].State,
          Code: stateFiltered[0].Code,
        });
      }
    }
    this.State = resultState;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let county = innerItem.County;
      if (!(county in lookup)) {
        lookup[county] = 1;
        result.push(county);
      }
    }
    this.County = result;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let city = innerItem.City;
      if (!(city in lookup)) {
        lookup[city] = 1;
        result.push(city);
      }
    }
    this.City = result;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let zip = innerItem.ZipCode;
      if (!(zip in lookup)) {
        lookup[zip] = 1;
        result.push(zip);
      }
    }
    this.ZipCode = result;
    lookup = {};
    result = [];
    resultLicenseType = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let lType = innerItem.LicenseType;
      if (!(lType in lookup)) {
        lookup[lType] = 1;
        result.push(lType);
        let licenseTypeFiltered = this.LicenseTypeMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == lType.toUpperCase() ||
            obj['Code'].toUpperCase() == lType.toUpperCase()
        );
        console.log(licenseTypeFiltered);
        resultLicenseType.push({
          State: licenseTypeFiltered[0].State,
          Code: licenseTypeFiltered[0].Code,
        });
      }
    }
    this.LicenseType = resultLicenseType;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let sNumber = innerItem.ShopNumber;
      if (!(sNumber in lookup)) {
        lookup[sNumber] = 1;
        result.push(sNumber);
      }
    }
    this.ShopNumber = result;
  }
  cityName(state, zipCode) {
    let cityListPhoto = this.cityZipCode.filter(
      (obj) => obj['State'] == state && obj['Zip'] == zipCode
    );
    if (cityListPhoto.length > 0) {
      return cityListPhoto[0].City;
    } else {
      return '';
    }
  }

  onStateSelected(item) {
    this.selectedState = item.value;
    this.stateNameSelected();
  }
  stateNameSelected() {
    let lookup = {};
    let result = [];
    this.City = null;

    let countyListPhoto = this.queryBuilderMain();
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let county = innerItem.County;
      if (!(county in lookup)) {
        lookup[county] = 1;
        result.push(county);
      }
    }
    this.County = result;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let city = innerItem.City;
      if (!(city in lookup)) {
        lookup[city] = 1;
        result.push(city);
      }
    }
    this.City = result;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let zip = innerItem.ZipCode;
      if (!(zip in lookup)) {
        lookup[zip] = 1;
        result.push(zip);
      }
    }
    this.ZipCode = result;
    lookup = {};
    result = [];
    let resultLicenseType = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let lType = innerItem.LicenseType;
      if (!(lType in lookup)) {
        lookup[lType] = 1;
        result.push(lType);
        let licenseTypeFiltered = this.LicenseTypeMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == lType.toUpperCase() ||
            obj['Code'].toUpperCase() == lType.toUpperCase()
        );
        console.log(licenseTypeFiltered);
        resultLicenseType.push({
          State: licenseTypeFiltered[0].State,
          Code: licenseTypeFiltered[0].Code,
        });
      }
    }
    this.LicenseType = resultLicenseType;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
      let sNumber = innerItem.ShopNumber;
      if (!(sNumber in lookup)) {
        lookup[sNumber] = 1;
        result.push(sNumber);
      }
    }
    this.ShopNumber = result;
  }
  onCountySelected(item) {
    this.selectedCounty = item;
    this.countyNameSelected();
  }
  countyNameSelected() {
    let lookup = {};
    let result = [];
    this.City = null;
    let cityListPhoto = this.queryBuilderMain();
    for (let innerItem, j = 0; (innerItem = cityListPhoto[j++]); ) {
      let city = innerItem.City;
      if (!(city in lookup)) {
        lookup[city] = 1;
        result.push(city);
      }
    }
    this.City = result;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = cityListPhoto[j++]); ) {
      let zip = innerItem.ZipCode;
      if (!(zip in lookup)) {
        lookup[zip] = 1;
        result.push(zip);
      }
    }
    this.ZipCode = result;
    lookup = {};
    result = [];
    let resultLicenseType = [];
    for (let innerItem, j = 0; (innerItem = cityListPhoto[j++]); ) {
      let lType = innerItem.LicenseType;
      if (!(lType in lookup)) {
        lookup[lType] = 1;
        result.push(lType);
        let licenseTypeFiltered = this.LicenseTypeMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == lType.toUpperCase() ||
            obj['Code'].toUpperCase() == lType.toUpperCase()
        );
        console.log(licenseTypeFiltered);
        resultLicenseType.push({
          State: licenseTypeFiltered[0].State,
          Code: licenseTypeFiltered[0].Code,
        });
      }
    }
    this.LicenseType = resultLicenseType;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = cityListPhoto[j++]); ) {
      let sNumber = innerItem.ShopNumber;
      if (!(sNumber in lookup)) {
        lookup[sNumber] = 1;
        result.push(sNumber);
      }
    }
    this.ShopNumber = result;
  }

  selectEventCity(item) {
    this.selectedCity = item;
    this.cityNameSelected();
    // do something with selected item
  }
  cityNameSelected() {
    let lookup = {};
    let result = [];
    this.ZipCode = null;
    let cityListPhoto = this.queryBuilderMain();
    for (let innerItem, j = 0; (innerItem = cityListPhoto[j++]); ) {
      let zip = innerItem.ZipCode;
      if (!(zip in lookup)) {
        lookup[zip] = 1;
        result.push(zip);
      }
    }
    this.ZipCode = result;
    lookup = {};
    result = [];
    let resultLicenseType = [];
    for (let innerItem, j = 0; (innerItem = cityListPhoto[j++]); ) {
      let lType = innerItem.LicenseType;
      if (!(lType in lookup)) {
        lookup[lType] = 1;
        result.push(lType);
        let licenseTypeFiltered = this.LicenseTypeMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == lType.toUpperCase() ||
            obj['Code'] == lType.toUpperCase()
        );
        console.log(licenseTypeFiltered);
        resultLicenseType.push({
          State: licenseTypeFiltered[0].State,
          Code: licenseTypeFiltered[0].Code,
        });
      }
    }
    this.LicenseType = resultLicenseType;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = cityListPhoto[j++]); ) {
      let sNumber = innerItem.ShopNumber;
      if (!(sNumber in lookup)) {
        lookup[sNumber] = 1;
        result.push(sNumber);
      }
    }
    this.ShopNumber = result;
  }
  onChangeSearchCity(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedCity(e) {
    // do something when input is focused
  }
  onChangeSearchState(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedState(e) {
    // do something when input is focused
  }
  onChangeSearchCounty(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedCounty(e) {
    // do something when input is focused
  }
  onChangeSearchBusinessName(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedBusinessName(e) {
    // do something when input is focused
  }
  selectEventZipCode(item) {
    this.selectedZipCode = item;
    this.zipCodeSelected();
    // do something with selected item
  }
  zipCodeSelected() {
    let licenseType = this.queryBuilderMain();
    let lookup = {};
    let items = licenseType;
    let result = [];
    let resultLicenseType = [];
    for (let innerItem, j = 0; (innerItem = licenseType[j++]); ) {
      let lType = innerItem.LicenseType;
      if (!(lType in lookup)) {
        lookup[lType] = 1;
        result.push(lType);
        let licenseTypeFiltered = this.LicenseTypeMain.filter(
          (obj) =>
            obj['State'].toUpperCase() == lType.toUpperCase() ||
            obj['Code'] == lType.toUpperCase()
        );
        console.log(licenseTypeFiltered);
        resultLicenseType.push({
          State: licenseTypeFiltered[0].State,
          Code: licenseTypeFiltered[0].Code,
        });
      }
    }
    this.LicenseType = resultLicenseType;
    lookup = {};
    result = [];
    for (let innerItem, j = 0; (innerItem = items[j++]); ) {
      let sNumber = innerItem.ShopNumber;
      if (!(sNumber in lookup)) {
        lookup[sNumber] = 1;
        result.push(sNumber);
      }
    }
    this.ShopNumber = result;
  }
  selectEventLicenseType(item) {
    this.selectedLicenseType = item.value;
    this.licenseTypSelected();
  }
  licenseTypSelected() {
    let shopNumber = this.queryBuilderMain();
    let lookup = {};
    let items = shopNumber;
    let result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.ShopNumber;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    this.ShopNumber = result;

    // do something with selected item
  }
  clearZipCode() {
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedLicenseType = '';
    this.zipCodeSelected();
  }
  clearCity() {
    this.selectedCity = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedLicenseType = '';
    this.cityNameSelected();
  }
  clearState() {
    this.selectedState = '';
    this.selectedCity = '';
    this.selectedCounty = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedLicenseType = '';
    this.selectedState = '';
    this.stateNameSelected();
  }
  clearDocumentType() {
    this.selectedState = '';
    this.selectedCity = '';
    this.selectedCounty = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedLicenseType = '';
    this.selectedState = '';
    this.selectedBusinessName = '';
    this.documentTypeSelected();
  }
  clearBusinessName() {
    this.selectedBusinessName = '';
    this.selectedState = '';
    this.selectedCity = '';
    this.selectedCounty = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedLicenseType = '';
    this.selectedState = '';
    this.businessNameSelected();
  }

  clearCounty() {
    this.selectedCity = '';
    this.selectedCounty = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedLicenseType = '';
    this.countyNameSelected();
  }
  clearShopNumber() {
    this.selectedShopNumber = '';
  }
  clearLicenseType() {
    this.selectedLicenseType = '';
    this.selectedShopNumber = '';
    this.licenseTypSelected();
  }

  onChangeSearchZipCode(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedZipCode(e) {
    // do something when input is focused
  }
  onChangeSearchLicenseType(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedLicenseType(e) {
    // do something when input is focused
  }
  selectEventShopNumber(item) {
    this.selectedShopNumber = item;

    // do something with selected item
  }

  onChangeSearchShopNumber(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedShopNumber(e) {
    // do something when input is focused
  }
  getFormattedDate(date1) {
    if (date1) {
      let date = new Date(date1);
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;
      let day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      return month + '/' + day + '/' + year;
    } else {
      return '';
    }
  }
  Download(element) {
    window.open(element.Url, '_blank');
    //setTimeout(() => { this.dnld(element) }, 1000);
  }

  Print(divName) {
    const printContents = document.getElementById(divName).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }
  notificationSucess() {
    this.notificationService.success('Success');
  }
  notificationError() {
    this.notificationService.error('No record found');
  }
  Clear() {
    this.selectedBusinessName = null;
    this.selectedState = null;
    this.selectedCounty = '';
    this.selectedCity = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedLicenseType = null;
    this.selectedExpiryDate = '';
    this.selectedDocumentType = '';
    this.photos = this.photoList;
    this.dataSource = new MatTableDataSource<Photo>(this.photos);
    this.dataSource.paginator = this.paginator;
    this.loadAllAutoComplete();
  }
  ClearMain() {
    this.selectedBusinessNameMain = null;
    this.selectedStateMain = null;
    this.selectedCountyMain = '';
    this.selectedCityMain = '';
    this.selectedZipCodeMain = '';
    this.selectedShopNumberMain = '';
    this.selectedLicenseTypeMain = null;
    this.selectedLicenseNumberMain = '';
    this.selectedExpiryDateStartMain = '';
    this.selectedExpiryDateEndMain = '';
    this.selectedUploadDateStartMain = '';
    this.selectedUploadDateEndMain = '';
    this.selectedIssueDateStartMain = '';
    this.selectedIssueDateEndMain = '';
    this.selectedBusinessName = null;
    this.selectedState = null;
    this.selectedCounty = '';
    this.selectedCity = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedLicenseType = null;
    this.selectedExpiryDate = '';
    this.selectedDocumentType = '';
    this.photos = [];
    this.dataSource = new MatTableDataSource<Dashboard>(this.dashboards);
    this.dataSource.paginator = this.paginator;
    this.loadAllAutoComplete();
  }
  ngOnDestroy() {
    clearInterval(this.idInterval);
  }
}
