import { LightningElement,api,wire,track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getProducts from '@salesforce/apex/ProductListController.getProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import {MessageContext, APPLICATION_SCOPE, publish} from 'lightning/messageService';
import KPNOrder from "@salesforce/messageChannel/KPNOrderMessage__c";

const orderFields = [
    'Order.Id',
    'Order.Pricebook2Id',
    'Order.Status'
];



export default class BasicDatatable extends LightningElement {
    @track products = [];
    @api recordId;
    currentOrder;
    pricebookId;
    @api sortedDirection = 'asc';
    @api sortedBy = 'productName';
    result;
    

    @wire(MessageContext)
    context;

    @track page = 1; 
    @track buttonDisabled;
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 10; 
    @track totalRecountCount = 0;
    @track totalPage = 1;

    @track columns = [{
            label: 'Product name',
            fieldName: 'productName',
            type: 'text',
            sortable: true
        },
        {
            label: 'List Price',
            fieldName: 'unitPrice',
            type: 'currency',
            sortable: true
        }
    ];

    @track error;
    @track productsList ;

    
    @wire(getRecord, { recordId: '$recordId', fields: orderFields })
    wiredRecord({ error, data }) {
        if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading order',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {
            this.currentOrder = data;
            this.pricebookId = this.currentOrder.fields.Pricebook2Id.value;
            this.buttonDisabled = this.currentOrder.fields.Status.value == 'Activated';
        }
    }
    
    @wire(getProducts, { p_pricebookId: '$pricebookId' ,p_sortBy: '$sortedBy', p_sortDirection: '$sortedDirection' })
    wiredProducts({ error, data }) {
        if (data) {
            let d = [];
            data.forEach(element => {
                let elt = {};
                elt.productName = element.Product2.Name ;
                elt.unitPrice = element.UnitPrice ;
                elt.productId = element.Product2Id;
                elt.priceBookEntryId = element.Id;
                elt.productCode = element.Product2.ProductCode;
                d.push(elt);
            });
            this.totalRecountCount = d.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.endingRecord = this.pageSize;
            this.products = d;
            this.productsList = this.products.slice(0,this.pageSize);
            this.notHaveNextPage = this.page == this.totalPage;
            this.notHavePrevPage = this.page == 1;
        } else if (error) {
            this.error = 'Unknown error';
            if (Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
            this.productsList = undefined;
        }

       
    }

    showToast(title,message,variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant:variant
        });
        this.dispatchEvent(event);
    }

    handleClick(event){
        var el = this.template.querySelector('lightning-datatable');
        var selected = el.getSelectedRows();
        if(selected.length > 0){
            this.handlePublish(selected);
            this.template.querySelector('lightning-datatable').selectedRows=[];
        }
        else{
            this.showToast('No Items selected','Select at least one product.','warning');    
        }
        
    }

    handleNextPage(event){
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    handlePrevPage(event){
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }
        
    sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        return refreshApex(this.result);
        
    }

    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.productsList = this.products.slice(this.startingRecord, this.endingRecord);   
        this.startingRecord = this.startingRecord + 1;
        this.notHaveNextPage = this.page == this.totalPage;
        this.notHavePrevPage = this.page == 1;
    } 
    
    handlePublish(product) {
        let payload = {
            source: "LWC",
            messageBody: product
        };
        publish(this.context, KPNOrder, payload);
     
}

   
    
          
}
