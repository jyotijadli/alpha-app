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
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
  closeModal: string='';

  xpandStatus = true;
  searchData: any;
  selectedDocumentTypeSearch: any;
  selectedBusinessName: any;
  selectedRegionSearch: any;
  selectedDivisionSearch: any;
  selectedStateSearch: any;
  selectedShopNumberSearch: any;
  selectedDistrictSearch: any;
  selectedDocumentDateSearch: any;
  selectedUpdateDateTimeSearch: any;
  selectedDocumentType: any;
  selectedDocumentDate:any;
  selectedUploadDateTime:any;
  selectedState: any;
  selectedCity: any;
  selectedDistrict:any;
  selectedDivision:any;
  selectedEmployeeName:any;
  selectedEmployeeId:any;
  selectedRegion:any;
  selectedZipCode: any;
  selectedShopNumber: any;
  selectedDivisionType: any;
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
  District:any;
  EmployeeName:any;
  EmployeeId:any;
  DivisionType: any;
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
  LicenseNumber = [];
  keywordState = 'State';
  keywordDocumentType = 'DocumentType';
  keywordShopNumber = 'ShopNumber';
  keywordDivisionType = 'Division';
  keywordDistrict = 'District';
  keywordEmployeeName = 'EmployeeName';
  keywordEmployeeId = 'EmployeeId';
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


  isAllSelected() {
    let numSelected, numRows;
    if (this.selection.selected) {
      numSelected = this.selection.selected.length;
    }
    if (this.dataSource.data) {
      numRows = this.dataSource.data.length;
    }
    return numSelected === numRows;
  }

  triggerModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

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
    private modalService: NgbModal,
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
    /*this.photos = this.queryBuilderMain();
    this.dataSource = new MatTableDataSource<Photo>(this.photos);
    this.dataSource.paginator = this.paginator;
    if (this.photos.length == 0) {
      this.notificationError();
    }*/
    this.extractDashboardData();
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
    if (this.selectedDivisionType) {
      query['DivisionType'] = this.selectedDivisionType;
    }
    if (this.selectedDistrict) {
      query['District'] = this.selectedDistrict;
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
    /*this.httpClient.post('https://alpha-function-app.azurewebsites.net/api/httptriggerfiltermetadata',
        { store_id: }).subscribe((data) => {
      this.DocumentTypeMain = data;
    });*/
    this.httpClient
      .post<any>(
        'https://alpha-function-app.azurewebsites.net/api/httptriggergetmetadata',
        { maxRecordCount: 30 }
      )
      .subscribe((data) => {
        console.log(data);
        this.dashboardData = data;
        this.extractDashboardData();
      });

  }

  photosList() {
    let photo = [];

    for (let item of this.photoList) {
      let eData = {
       
      };
      photo.push(eData);
    }
    return photo;
  }

  dateConvertedFormat(dateAll) {
    let date = new Date(dateAll);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month :  month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '/' + day + '/'+ year;
  }
  searchAPIDashbaord() {
    let requestParam = {};
    if(this.selectedShopNumberSearch){
      requestParam['store_id']=this.selectedShopNumberSearch;
    }
    if(this.selectedDocumentTypeSearch){
      requestParam['document_type']=this.selectedDocumentTypeSearch;
    }
    if(this.selectedDocumentDateSearch){
      requestParam['create_date']=this.dateConvertedFormat(this.selectedDocumentDateSearch);
    }
    if(this.selectedRegionSearch){
      requestParam['region']=this.selectedRegionSearch;
    }
    if(this.selectedDivisionSearch){
      requestParam['division']=this.selectedDivisionSearch;
    }
    if(this.selectedDistrictSearch){
      requestParam['city']=this.selectedDistrictSearch;
    }
    if(this.selectedStateSearch){
      requestParam['state']=this.selectedStateSearch;
    }
    this.httpClient
      .post<any>('https://alpha-function-app.azurewebsites.net/api/httptriggerfiltermetadata', requestParam)
      .subscribe((data) => {
        console.log(data);
        this.dashboardData = data;
        
        this.extractDashboardData();
        this.selectedShopNumber = this.selectedShopNumberSearch; 
      this.selectedDocumentDate = this.selectedDocumentDateSearch;
      });
  }
  searchAPI() {
    this.xpandStatus = true;
    this.Clear();
    let srcQry: string = '';
    let srcFilter: string = '';
    if (this.selectedDocumentTypeSearch) {
      srcQry +=
        " AND document_type: '" + this.selectedDocumentTypeSearch + "'";
    }
    if (this.selectedRegionSearch) {
      srcQry += " AND region:'" + this.selectedRegionSearch + "'";
    }
    if (this.selectedDistrictSearch) {
      srcQry += " AND district: '" + this.selectedDistrictSearch + "'";
    }
    if (this.selectedDivisionSearch) {
      srcQry += " AND division:'" + this.selectedDivisionSearch + "'";
    }
    if (this.selectedStateSearch) {
      srcQry += " AND state: '" + this.selectedStateSearch + "'";
    }
    if (this.selectedShopNumberSearch) {
      srcQry += " AND store_number:'" + this.selectedShopNumberSearch + "'";
    }
    if (this.selectedDocumentDateSearch) {
      srcFilter +=
        ' and document_date ' +
        this.dateConvertedFormat('');
    } else if (
  this.selectedDocumentDateSearch
    ) {
      srcFilter +=
        '  and document_date ' +
        this.dateConvertedFormat(this.selectedDocumentDateSearch);
    }
    if (this.selectedUpdateDateTimeSearch) {
      srcFilter +=
        ' and upload_date ' +
        this.dateConvertedFormat(this.selectedUpdateDateTimeSearch);
    } else if (
      this.selectedUpdateDateTimeSearch
    ) {
      srcFilter +=
        ' and upload_datetime ' +
        this.dateConvertedFormat(this.selectedUpdateDateTimeSearch)
    }
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
    if (this.selectedShopNumber) {
      this.dashboards = this.dashboards.filter((v) =>
        JSON.stringify(v)
          .toLowerCase()
          .includes(this.selectedShopNumber.toLowerCase())
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
      lookupDistrict,
      lookupCounty,
      lookupCity,
      lookupZipCode,
      lookupLicenseType,
      lookupShopNumber = {};
    let items = this.dashboardList;
    let resultCounty,
      resultCity,
      resultDistrict,
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
      let name = item.DocumentType;
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
    this.District = resultDistrict;
    result = [];
    for (let item, i = 0; (item = items[i++]); ) {
      let name = item.State;
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
    this.DivisionType = resultLicenseType;
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
  onDivisionTypeSelected(item) {
    this.selectedDivisionSearch = item.value;
    this.divisionTypeSelected();
  }
  divisionTypeSelected() {

  }

  onDocumentTypeSelected(item) {
    this.selectedDocumentTypeSearch = item.value;
    this.documentTypeSelected();
  }
  documentTypeSelected() {
    let lookup = {};
    let result = [];
    let resultState = [];
    let resultBusinessName = [];
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
    /*for (let innerItem, j = 0; (innerItem = countyListPhoto[j++]); ) {
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
    this.DivisionType = resultLicenseType;*/
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
   /* resultLicenseType = [];
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
    }*/
    this.DivisionType = resultLicenseType;
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
    /*let resultLicenseType = [];
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
    this.DivisionType = resultLicenseType;*/
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
  onRegionSelected(item) {
    this.selectedRegion = item;
    this.RegionSelected();
  }
  RegionSelected() {
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
   /* let resultLicenseType = [];
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
    this.DivisionType = resultLicenseType;*/
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
   /* let resultLicenseType = [];
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
    this.DivisionType = resultLicenseType;*/
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
    /*let resultLicenseType = [];
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
    this.DivisionType = resultLicenseType;*/
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
  selectEventDivisionType(item) {
    this.selectedDivisionType = item.value;
    this.onDivisionSelected();
  }
  onDivisionSelected() {
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
    this.selectedDivisionType = '';
    this.selectedDistrict = '';
    this.selectedRegion = '';
    this.zipCodeSelected();
  }
  clearDivision() {
    this.selectedCity = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedDivisionType = '';
    this.selectedRegion = '';
    this.selectedDistrict = '';
    this.cityNameSelected();
  }
  clearState() {
    this.selectedState = '';
    this.selectedCity = '';
    this.selectedCounty = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedDivisionType = '';
    this.selectedDistrict = '';
    this.selectedState = '';
    this.selectedRegion = '';
    this.stateNameSelected();
  }
  clearDocumentType() {
    this.selectedState = '';
    this.selectedCity = '';
    this.selectedCounty = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedDivisionType = '';
    this.selectedDistrict = '';
    this.selectedState = '';
    this.selectedRegion = '';
    this.selectedBusinessName = '';
    this.documentTypeSelected();
  }
  clearRegion() {
    this.selectedRegion = '';
    this.selectedState = '';
    this.selectedCity = '';
    this.selectedCounty = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedDivisionType = '';
    this.selectedRegion = '';
    this.selectedState = '';
    this.selectedRegion();
  }
  clearShopNumber() {
    this.selectedShopNumber = '';
  }
  clearDivisionType() {
    this.selectedDivisionType = '';
    this.selectedShopNumber = '';
    this.selectedDistrict = '';
    this.selectedDivisionType();
  }
  clearDistrict() {
    this.selectedDistrict = '';
    this.selectedShopNumber = '';
    this.selectedDistrict();
  }
  clearEmployeeName() {
    this.selectedEmployeeName = '';
    this.selectedShopNumber = '';
    this.selectedEmployeeName();
  }
  clearEmployeeId() {
    this.selectedEmployeeId = '';
    this.selectedShopNumber = '';
    this.selectedEmployeeId();
  }

  
  onChangeSearchDocumentType(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedDocumentType(e) {
    // do something when input is focused
  }
  onChangeSearchZipCode(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedZipCode(e) {
    // do something when input is focused
  }

  selectEventDistrict(item) {
    this.selectedDistrict = item;

    // do something with selected item
  }
  onChangeSearchDistrict(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocusedDistrict(e) {
    // do something when input is focused
  }
  selectEventEmployeeName(item) {
    this.selectedEmployeeName = item;

    // do something with selected item
  }
  onChangeSearchEmployeeName(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocusedEmployeeName(e) {
    // do something when input is focused
  }
  selectEventEmployeeId(item) {
    this.selectedEmployeeId = item;

    // do something with selected item
  }
  onChangeSearchEmployeeId(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocusedEmployeeId(e) {
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
    this.selectedRegion = '';
    this.selectedShopNumber = '';
    this.selectedDivisionType = null;
    this.selectedExpiryDate = '';
    this.selectedDocumentDate='';
    this.selectedDocumentType = '';
    this.selectedUploadDateTime='';
    this.photos = this.photoList;
    this.dataSource = new MatTableDataSource<Photo>(this.photos);
    this.dataSource.paginator = this.paginator;
    this.loadAllAutoComplete();
  }
  ClearMain() {
    this.selectedShopNumberSearch = '';
    this.selectedDocumentTypeSearch = '';
    this.selectedDocumentDateSearch='';
    this.selectedRegionSearch = '';
    this.selectedDistrictSearch = '';
    this.selectedDivisionSearch = '';
    this.selectedStateSearch = '';
    this.selectedUpdateDateTimeSearch = '';
    this.selectedBusinessName = null;
    this.selectedState = null;
    this.selectedCounty = '';
    this.selectedRegion = '';
    this.selectedCity = '';
    this.selectedZipCode = '';
    this.selectedShopNumber = '';
    this.selectedDivisionType = null;
    this.selectedExpiryDate = '';
    this.selectedDocumentType = '';
    this.selectedDocumentDate = '';
    this.selectedUploadDateTime='';
    this.photos = [];
    this.dataSource = new MatTableDataSource<Dashboard>(this.dashboards);
    this.dataSource.paginator = this.paginator;
    this.loadAllAutoComplete();
  }
  ngOnDestroy() {
    clearInterval(this.idInterval);
  }
}
