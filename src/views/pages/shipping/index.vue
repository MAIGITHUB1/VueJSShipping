<script>
import { required } from "vuelidate/lib/validators";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import DatePicker from "vue2-datepicker";
import moment from "moment";

import { Circle8 } from "vue-loading-spinner";

import JsonExcel from "vue-json-excel";
import  "@/views/pages/shipping/shipping.scss";

/**
 * Starter page
 */
export default {
  components: { DatePicker, Layout, PageHeader, Circle8, JsonExcel },
  page: {
    title: "Shipping",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      //Excel Order Info Assign
      json_Shipping_fields: {
        Client: "clientName",
        "Order Status": "rptStatus",
        "MAI Order#": "eventID",
        "Client Order#": "mktid",
        "Order Date": "entryDate",
        Name: "fullName",
        Address: "fullAddress",
        "Piece/SKU": {
          field: "piecePerSKU",
          callback: (value) => {
            return `&nbsp;${value}`;
          },
        },
        "Tracking - Ship Date": "trackingNumberWithDate",
      },
      //Excel SKU info Assign
      json_Shipping_SKU_fields: {
        ManifestID: "mid",
        SKU: "sku",
        Description: "description",
        "Ord Qty": "orderQuantity",
        "Ship Qty": "shippedQuantity",
        "BKO Qty": "bKOQuantity",
        //"Ship Date": "shipDate",
        //Tracking: "trackNumber",
      },
      
      ST1: "",
      ST2: "",
      ST3: "",
      showclientname: "",
      showorderstatus: "",
      showordernumber: "",
      showclientorder: "",
      showaddress: "",
      showorderdate: "",
      showshipdate: "",
      showtracks: "",
      DTable: [],
      totalRows1: 1,
      currentPage1: 1,
      perPage1: 10,
      pageOptions1: [10, 25, 50, 100],
      filter1: null,
      filterOn1: [],
      //SKU Datatable Fields
      fields1: [
        {
          label: "ManifestID",
          key: "mid",
          sortable: true,
        },
        {
          label: "SKU",
          key: "sku",
          sortable: true,
        },
        {
          label: "Description",
          key: "description",
          sortable: true,
        },
        {
          label: "Ord Qty",
          key: "orderQuantity",
          sortable: true,
          class: 'text-center',
        },
        {
          label: "Ship Qty",
          key: "shippedQuantity",
          sortable: true,
          class: 'text-center',
        },
        {
          label: "BKO Qty",
          key: "bkoQuantity",
          sortable: true,
          class: 'text-center',
        },
        // {
        //   label: "Ship Date",
        //   key: "shipDate",
        //   sortable: true,
        // },
        // {
        //   label: "Tracking",
        //   key: "trackNumber",
        //   sortable: true,
        // },
      ],

      clients: [],
      selected: {
        client: "All",
      },
      tableData: [],
      title: "Shipping",
      items: [
        {
          text: "MAI",
        },
        {
          text: "Shipping",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "age",
      sortDesc: false,
      
      //Order Datatable Fields
      fields: [
        {
          label: "Client",
          key: "clientName",
          sortable: true,
          thClass: "HeaderDesign",
          tdClass: "bodyDesign",
          thStyle: { minWidth: "70px" },
        },
        {
          label: "Order Status",
          key: "rptStatus",
          sortable: true,
          thClass: "HeaderDesign",
          tdClass: "bodyDesign",
          thStyle: { minWidth: "100px" },
        },
        {
          label: "MAI Order#",
          key: "eventID",
          sortable: true,
          thClass: "HeaderDesign",
          tdClass: "bodyDesign",
          thStyle: { minWidth: "100px" },
        },
        {
          label: "Client Order#",
          key: "mktid",
          sortable: true,
          thClass: "HeaderDesign",
          tdClass: "bodyDesign",
          thStyle: { minWidth: "70px" },
        },
        {
          label: "Order Date",
          key: "entryDate",
          sortable: true,
          thClass: "HeaderDesign",
          tdClass: "bodyDesign",
          thStyle: { minWidth: "100px" },
          formatter: (value, key, item) => {
            return moment(new Date(item.entryDate)).format("MM/DD/YYYY");
          },
        },
        {
          label: "Name",
          key: "fullName",
          sortable: true,
          thClass: "HeaderDesign",
          tdClass: "bodyDesign",
          thStyle: { minWidth: "160px" },
        },
        {
          label: "Address",
          key: "fullAddress",
          sortable: true,
          thClass: "HeaderDesign",
          tdClass: "bodyDesign",
          thStyle: { minWidth: "250px" },
        },
        {
          label: "Piece/SKU",
          key: "piecePerSKU",
          sortable: true,
          thClass: "HeaderDesign",
          tdClass: "bodyDesign",
          thStyle: { minWidth: "100px" },
        },
        {
          label: "Tracking - Ship Date",
          key: "trackingNumberWithDateLink",
          sortable: true,
          thClass: "HeaderDesign",
          tdClass: "bodyDesign",
          thStyle: { minWidth: "250px" },
        },
      ],
      typeform: {
        client: "All",
        ostatus: "All",
        datetype: "Entry Date",
        fromdate: moment().add(-7, "d").toDate(),
        todate: new Date(),
        forminfo: true,
        reusltdata: false,
        skuinfo: false,
        loadcircle: false,
      },
      altermsg: false,
      altersearchmsg: false,
      searchName: "",
      submitted: false,
      submitform: false,
      submit: false,
      typesubmit: false,
    };
  },
  validations: {
    typeform: {
      client: {
        required,
      },
      fromdate: {
        required,
      },
      todate: {
        required,
      },
    },
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length;
    },
    rows1() {
      return this.DTable.length;
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
    this.getclientinfo();
  },
  methods: {
    // Select some option onchage Validation
    onChangeST1: function (event1) {
      this.altersearchmsg = false;
      if (this.ST1 != "") {
        if (
          this.ST2 == event1.target.value ||
          this.ST3 == event1.target.value
        ) {
          this.altersearchmsg = true;
          this.searchName = this.ST1;
          this.ST1 = "";
        }
      }
    },
    // Select some option onchage Validation
    onChangeST2: function (event2) {
      this.altersearchmsg = false;
      if (this.ST2 != "") {
        if (
          this.ST1 == event2.target.value ||
          this.ST3 == event2.target.value
        ) {
          this.altersearchmsg = true;
          this.searchName = this.ST2;
          this.ST2 = "";
        }
      }
    },
    // Select some option onchage Validation
    onChangeST3: function (event3) {
      this.altersearchmsg = false;
      if (this.ST3 != "") {
        if (
          this.ST1 == event3.target.value ||
          this.ST2 == event3.target.value
        ) {
          this.altersearchmsg = true;
          this.searchName = this.ST3;
          this.ST3 = "";
        }
      }
    },
    //Get Client Dropdown form API 
    getclientinfo() {
      this.typeform.loadcircle = true;
      let userinfo = JSON.parse(localStorage.getItem("user"));
      fetch("http://192.168.3.55/shipping/Clients/GetClients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userinfo.token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          this.clients = res.result;
          this.typeform.loadcircle = false;
        })
        .catch((error) => {
          console.log(error);
          localStorage.removeItem("user");
            this.$router.push({
              path: "/login",
            });
          this.typeform.loadcircle = false;
        });
    },
    //Filter Form Click Validation
    typeForm() {
      this.typesubmit = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
        this.typeform.reusltdata = false;
        this.altermsg = false;
        this.typeform.loadcircle = true;
        let userinfo = JSON.parse(localStorage.getItem("user"));
        let sdate = "99999",
          edate = "99999",
          ssdate = "99999",
          sedate = "99999",
          fname = "99999",
          lname = "99999",
          cname = "99999",
          MAIo = "99999",
          cliento = "99999",
          maniid = "99999",
          TrackNo = "99999";
        if (this.typeform.datetype == "Entry Date") {
          sdate = moment(new Date(this.typeform.fromdate)).format("MM/DD/YYYY");
          edate = moment(new Date(this.typeform.todate)).format("MM/DD/YYYY");
        } else {
          ssdate = moment(new Date(this.typeform.fromdate)).format(
            "MM/DD/YYYY"
          );
          sedate = moment(new Date(this.typeform.todate)).format("MM/DD/YYYY");
        }
        if (this.ST1 == "First Name") {
          fname = this.typeform.searchtxt1;
        } else if (this.ST1 == "Last Name") {
          lname = this.typeform.searchtxt1;
        } else if (this.ST1 == "Company Name") {
          cname = this.typeform.searchtxt1;
        } else if (this.ST1 == "Client Order#") {
          MAIo = this.typeform.searchtxt1;
        } else if (this.ST1 == "MAI Order#") {
          cliento = this.typeform.searchtxt1;
        } else if (this.ST1 == "ManifestID") {
          maniid = this.typeform.searchtxt1;
        } else if (this.ST1 == "Tracking Number") {
          TrackNo = this.typeform.searchtxt1;
        }

        if (this.ST2 == "First Name") {
          fname = this.typeform.searchtxt2;
        } else if (this.ST2 == "Last Name") {
          lname = this.typeform.searchtxt2;
        } else if (this.ST2 == "Company Name") {
          cname = this.typeform.searchtxt2;
        } else if (this.ST2 == "Client Order#") {
          MAIo = this.typeform.searchtxt2;
        } else if (this.ST2 == "MAI Order#") {
          cliento = this.typeform.searchtxt2;
        } else if (this.ST2 == "ManifestID") {
          maniid = this.typeform.searchtxt2;
        } else if (this.ST2 == "Tracking Number") {
          TrackNo = this.typeform.searchtxt2;
        }

        if (this.ST3 == "First Name") {
          fname = this.typeform.searchtxt3;
        } else if (this.ST3 == "Last Name") {
          lname = this.typeform.searchtxt3;
        } else if (this.ST3 == "Company Name") {
          cname = this.typeform.searchtxt3;
        } else if (this.ST3 == "Client Order#") {
          MAIo = this.typeform.searchtxt3;
        } else if (this.ST3 == "MAI Order#") {
          cliento = this.typeform.searchtxt3;
        } else if (this.ST3 == "ManifestID") {
          maniid = this.typeform.searchtxt3;
        } else if (this.ST3 == "Tracking Number") {
          TrackNo = this.typeform.searchtxt3;
        }
        // Get Order Details form API 
        const itemvalues = {
          clientID: this.typeform.client.id,
          clientName: this.typeform.client.text,
          startDate: sdate,
          endDate: edate,
          shipStartDate: ssdate,
          shipEndDate: sedate,
          firstName: fname,
          lastName: lname,
          companyName: cname,
          eventID: MAIo,
          mktid: cliento,
          manifestID: maniid,
          orderStatus: this.typeform.ostatus,
          TrackingNo: TrackNo,
        };

        fetch("http://192.168.3.55/shipping/Clients/ShippingList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + userinfo.token,
          },
          body: JSON.stringify(itemvalues),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.result.length > 0) {
              this.tableData = res.result;
              this.typeform.reusltdata = true;
            } else {
              this.altermsg = true;
            }
            this.typeform.loadcircle = false;
          })
          .catch((error) => {
            console.log(error);
          // localStorage.removeItem("user");
          //   this.$router.push({
          //     path: "/login",
          //   });
            this.typeform.loadcircle = false;
            alert("Server Error.");
          });
      }
    },
    backtoform() {
      this.$refs.div1.scrollTop = 0;
      this.typeform.forminfo = true;
      this.typeform.skuinfo = false;
    },
    //Event Click to Show SKU Details
    showskuDetails(rowitems) {
      this.typeform.forminfo = false;
      this.typeform.skuinfo = true;

      this.showclientname = rowitems.clientName;
      this.showorderstatus = rowitems.rptStatus;
      this.showordernumber = rowitems.eventID;
      this.showclientorder = rowitems.mktid;
      this.showaddress = rowitems.fullAddress;
      this.showorderdate = moment(new Date(rowitems.entryDate)).format(
        "MM/DD/YYYY"
      );
      this.showtracks = rowitems.trackingNumberWithDateLink;
      this.DTable = rowitems.skuDetails;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onFiltered1(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows1 = filteredItems.length;
      this.currentPage1 = 1;
    },
  },
  middleware: "authentication",
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" ref="div1" />
    <div class="row" v-if="typeform.forminfo">
      <div class="col-lg-2">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Filter</h4>

            <b-form action="#" @submit.prevent="typeForm">
              <div class="mb-2">
                <label>Client</label>
                <select
                  class="form-select"
                  v-model="typeform.client"
                  name="client"
                  :class="{
                    'is-invalid': typesubmit && $v.typeform.client.$error,
                  }"
                >
                  <option value="All">All</option>
                  <option
                    v-for="client in clients"
                    :key="client.clientID"
                    :value="{ id: client.clientID, text: client.clientName }"
                  >
                    {{ client.clientName }}
                  </option>
                </select>
                <div
                  v-if="typesubmit && $v.typeform.client.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.typeform.client.required"
                    >This value is required.</span
                  >
                </div>
              </div>
              <div class="mb-2">
                <label>Order Status</label>
                <select
                  class="form-select"
                  v-model="typeform.ostatus"
                  name="ostatus"
                >
                  <option value="All">All</option>
                  <option value="Back Order">Back Order</option>
                  <option value="Ready To Process">Ready To Process</option>
                  <option value="Ready To Ship">Ready To Ship</option>
                  <option value="Order Shipped">Order Shipped</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div class="mb-2">
                <label>Date Type</label>
                <select
                  class="form-select"
                  v-model="typeform.datetype"
                  name="datetype"
                >
                  <option value="Entry Date">Entry Date</option>
                  <option value="Ship Date">Ship Date</option>
                </select>
              </div>

              <div class="row mb-4">
                <div class="col-lg-6">
                  <label>From</label>
                  <br />
                  <date-picker
                    v-model="typeform.fromdate"
                    format="MM/DD/YYYY"
                    :first-day-of-week="1"
                    lang="en"
                    :class="{
                      'is-invalid': typesubmit && $v.typeform.fromdate.$error,
                    }"
                  ></date-picker>
                  <div
                    v-if="typesubmit && $v.typeform.fromdate.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.typeform.fromdate.required">required.</span>
                  </div>
                </div>
                <div class="col-lg-6">
                  <label>To</label>
                  <br />
                  <date-picker
                    v-model="typeform.todate"
                    format="MM/DD/YYYY"
                    :first-day-of-week="1"
                    lang="en"
                    :class="{
                      'is-invalid': typesubmit && $v.typeform.todate.$error,
                    }"
                  ></date-picker>
                  <div
                    v-if="typesubmit && $v.typeform.todate.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.typeform.todate.required">required.</span>
                  </div>
                </div>
                <div class="clearfix"></div>
              </div>

              <div class="mb-3">
                <label>Search Type</label>
                <b-alert
                  variant="danger"
                  v-model="altersearchmsg"
                  style="padding: 0.15rem 1.25rem"
                  >{{ searchName }} Already Selected.</b-alert
                >
                <div class="mt-3">
                  <select
                    class="form-select"
                    name="searchtype1"
                    v-model="ST1"
                    @change="onChangeST1($event)"
                  >
                    <option value="">Select Some Options</option>
                    <option value="First Name">First Name</option>
                    <option value="Last Name">Last Name</option>
                    <option value="Company Name">Company Name</option>
                    <option value="Client Order#">Client Order#</option>
                    <option value="MAI Order#">MAI Order#</option>
                    <option value="ManifestID">ManifestID</option>
                    <option value="Tracking Number">Tracking Number</option>
                  </select>
                </div>
                <div class="mt-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Option Text"
                    v-model="typeform.searchtxt1"
                    name="searchtxt1"
                  />
                </div>

                <div class="mt-3">
                  <select
                    class="form-select"
                    name="searchtype2"
                    v-model="ST2"
                    @change="onChangeST2($event)"
                  >
                    <option value="">Select Some Options</option>
                    <option value="First Name">First Name</option>
                    <option value="Last Name">Last Name</option>
                    <option value="Company Name">Company Name</option>
                    <option value="Client Order#">Client Order#</option>
                    <option value="MAI Order#">MAI Order#</option>
                    <option value="ManifestID">ManifestID</option>
                    <option value="Tracking Number">Tracking Number</option>
                  </select>
                </div>
                <div class="mt-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Option Text"
                    name="searchtxt2"
                  />
                </div>

                <div class="mt-3">
                  <select
                    class="form-select"
                    name="searchtype3"
                    v-model="ST3"
                    @change="onChangeST3($event)"
                  >
                    <option value="">Select Some Options</option>
                    <option value="First Name">First Name</option>
                    <option value="Last Name">Last Name</option>
                    <option value="Company Name">Company Name</option>
                    <option value="Client Order#">Client Order#</option>
                    <option value="MAI Order#">MAI Order#</option>
                    <option value="ManifestID">ManifestID</option>
                    <option value="Tracking Number">Tracking Number</option>
                  </select>
                </div>
                <div class="mt-2">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Option Text"
                    name="searchtxt2"
                  />
                </div>
              </div>

              <div class="mb-3 mb-0">
                <div>
                  <button type="submit" class="btn btn-primary">Submit</button>
                  <button type="reset" class="btn btn-secondary ms-1">
                    Cancel
                  </button>
                </div>
              </div>
            </b-form>
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col-->

      <div class="col-lg-10">
        <b-alert variant="danger" v-model="altermsg">No Result Found!</b-alert>
        <div class="card" v-if="typeform.reusltdata">
          <div class="card-body">
            <!-- <h4 class="card-title">Result</h4> -->
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    Show&nbsp;
                    <b-form-select
                      v-model="perPage"
                      size="sm"
                      :options="pageOptions"
                    ></b-form-select
                    >&nbsp;entries
                  </label>

                  <json-excel
                    class="btn btn-default"
                    :data="tableData"
                    :fields="json_Shipping_fields"
                    worksheet="Shipping Orders"
                    name="Shipping-Report.xls"
                  >
                    <img src="@/assets/images/ExcelDw.png" height="30" />
                  </json-excel>
                </div>
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div
                  id="tickets-table_filter"
                  class="dataTables_filter text-md-end"
                >
                  <label class="d-inline-flex align-items-center">
                    Search:
                    <b-form-input
                      v-model="filter"
                      type="search"
                      placeholder="Search..."
                      class="form-control form-control-sm ms-2"
                    ></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table
                striped
                outlined
                :items="tableData"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              >
                <template #cell()="data">
                  <span v-html="data.value"></span>
                </template>
                <template #cell(eventID)="data">
                  <span class="addlink" @click="showskuDetails(data.item)">{{
                    data.value
                  }}</span>
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div
                  class="dataTables_paginate paging_simple_numbers float-end"
                >
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="rows"
                      :per-page="perPage"
                    ></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loadicon" v-if="typeform.loadcircle">
      <circle8></circle8>
    </div>
    <div class="row" v-if="typeform.skuinfo">
      <div class="col-lg-2">
        <div class="col-md-12">
          <b-card header="Search" class="text-left">
            <b-card-text>
              <b-button
                class="bkbtn"
                size="sm"
                variant="dark"
                @click="backtoform()"
                >Back</b-button
              >
              <h4 class="card-title">Client: {{ showclientname }}</h4>
              <p class="card-text setredcolor">
                <b>Order Status:</b><br />
                {{ showorderstatus }}
              </p>
              <p class="card-text setblucolor">
                <b>MAI Order#:</b> {{ showordernumber }}
              </p>
              <p class="card-text setblucolor">
                <b>Client Order#:</b> {{ showclientorder }}
              </p>
              <p class="card-text setblucolor">
                <b>Address:</b><br />
                {{ showaddress }}
              </p>
              <p class="card-text setblucolor">
                <b>Order Date:</b> {{ showorderdate }}
              </p>
              <p class="card-text setblucolor">
                <b>Tracking - Ship Date:</b><br />
                <span v-html="showtracks"></span>
              </p>
            </b-card-text>
          </b-card>
        </div>
      </div>
      <div class="col-lg-10">
        <div class="col-md-12">
          <b-card header="SKU Details" class="text-left">
            <div class="card">
              <div class="card-body">
                <div class="row mt-4">
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_length" class="dataTables_length">
                      <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select
                          v-model="perPage1"
                          size="sm"
                          :options="pageOptions1"
                        ></b-form-select
                        >&nbsp;entries
                      </label>

                      <json-excel
                        class="btn btn-default"
                        :data="DTable"
                        :fields="json_Shipping_SKU_fields"
                        worksheet="SKUs"
                        name="Shipping-SKU-Data.xls"
                      >
                        <img src="@/assets/images/ExcelDw.png" height="30" />
                      </json-excel>
                    </div>
                  </div>
                  <!-- Search -->
                  <div class="col-sm-12 col-md-6">
                    <div
                      id="tickets-table_filter"
                      class="dataTables_filter text-md-end"
                    >
                      <label class="d-inline-flex align-items-center">
                        Search:
                        <b-form-input
                          v-model="filter1"
                          type="search"
                          placeholder="Search..."
                          class="form-control form-control-sm ms-2"
                        ></b-form-input>
                      </label>
                    </div>
                  </div>
                  <!-- End search -->
                </div>
                <!-- Table -->
                <div class="table-responsive mb-0">
                  <b-table
                    :items="DTable"
                    :fields="fields1"
                    responsive="sm"
                    :per-page="perPage1"
                    :current-page="currentPage1"
                    :filter="filter1"
                    :filter-included-fields="filterOn1"
                    @filtered="onFiltered1"
                  ></b-table>
                </div>
                <div class="row">
                  <div class="col">
                    <div
                      class="
                        dataTables_paginate
                        paging_simple_numbers
                        float-end
                      "
                    >
                      <ul class="pagination pagination-rounded mb-0">
                        <!-- pagination -->
                        <b-pagination
                          v-model="currentPage1"
                          :total-rows="rows1"
                          :per-page="perPage1"
                        ></b-pagination>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </Layout>
</template>
