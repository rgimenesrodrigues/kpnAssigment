<<<<<<< HEAD
import { LightningElement,api,wire,track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getOrderProducts from '@salesforce/apex/ProductListController.getOrderProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe,unsubscribe, MessageContext } from 'lightning/messageService';
import KPNOrder from "@salesforce/messageChannel/KPNOrderMessage__c";
import fetchConfirmation from '@salesforce/apex/ProductListController.saveAndConfirmOrder';
const orderFields = [
    'Order.Id',
    'Order.Account.AccountNumber',
    'Order.Status',
    'Order.Type',
    'Order.OrderNumber'
];

export default class BasicDatatable extends LightningElement {
    @api recordId;
    currentOrder;
    currentOrderId;
    result;
    boolShowSpinner = false;
    strUrl;
    @track buttonDisabled;

    @wire(MessageContext)
    messageContext;

    @track columns = [{
            label: 'Product name',
            fieldName: 'productName',
            type: 'text',
        },
        {
            label: 'Unit Price',
            fieldName: 'unitPrice',
            type: 'currency',
        },
        {
            label: 'Quantity',
            fieldName: 'quantity',
            type: 'decimal',
        },
        {
            label: 'Total Price',
            fieldName: 'totalPrice',
            type: 'currency',
        }
    ];

    @track error;
    @track orderProductsList ;

    
    @wire(getRecord, { recordId: '$recordId', fields: orderFields })
    wiredRecord({ error, data }) {
        if (error) {
            let message = 'Error retrieving order';
            if (typeof error.body.message === 'string') {
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
            this.currentOrderId = this.currentOrder.fields.Id.value;
            this.buttonDisabled = this.currentOrder.fields.Status.value == 'Activated';
            //this.subscription = subscribe(this.context, KPNOrder, (message) => {
            //    this.handleMessage(message);
            //}, {scope: APPLICATION_SCOPE});
        }
    }
    
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    @wire(getOrderProducts, { p_orderId: '$currentOrderId'})
    wiredProducts({ error, data }) {
        if (data) {
            this.orderProductsList = data;
        } else if (error) {
            this.error = 'Error retrieving products from order';
            if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
            this.showToast('Order Productas',this.error,'error');
            this.orderProductsList = undefined;
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
        this.boolShowSpinner = true;
        var requestObj = new Object();
        requestObj.accountNumber = this.currentOrder.fields.Account.value.fields.AccountNumber.value;
        requestObj.orderNumber  = this.currentOrder.fields.OrderNumber.value;
        requestObj.type = this.currentOrder.fields.Type.value;
        requestObj.status =this.currentOrder.fields.Status.value;
        var requestProdObj;
        var requestProdsList = [];
        this.orderProductsList.forEach(prodTemp => {
            requestProdObj = new Object();
            requestProdObj.name = prodTemp.productName;
            requestProdObj.code = prodTemp.productCode;
            requestProdObj.unitPrice = prodTemp.unitPrice;
            requestProdObj.quantity = prodTemp.quantity;
            requestProdsList.push(requestProdObj);        
        });    
        requestObj.orderProducts = requestProdsList;
        var jsonString= JSON.stringify(requestObj);

        fetchConfirmation({p_jsonBody:jsonString, p_records:this.orderProductsList}).then(response => {
            if(response.contains('Error')){
                this.showToast('Error',response,'error');    
            }
            else{
                this.showToast('Success',response,'success');    
            }
            
            this.boolShowSpinner = false;
        }).catch(error => {
            this.showToast('Error saving and confiming order',error,'warning');    
        });
        
    }
    @track receivedMessage = '';
    @track subscription = null;
 
    //context = createMessageContext();
 

    handleMessage(event) {
    if (event) {
        var products = event.messageBody
        if(products.length > 0){
            products.forEach(prod => {
                const elementIndex = this.orderProductsList.findIndex(el => el.productId === prod.productId);
                let ordersProductClone = [...this.orderProductsList]; 
                if(elementIndex>=0){
                    ordersProductClone[elementIndex] = {
                        itemId :  this.orderProductsList[elementIndex].itemId,
                        quantity : this.orderProductsList[elementIndex].quantity +1,
                        productId : prod.productId,
                        orderId : this.currentOrder.fields.Id.value,
                        priceBookEntryId : prod.priceBookEntryId,
                        productName : prod.productName,
                        productCode : prod.productCode,
                        unitPrice : prod.unitPrice,
                        totalPrice : this.orderProductsList[elementIndex].totalPrice+prod.unitPrice,
                        updated : true
                    };
                }
                else{
                    ordersProductClone.push({ 
                        itemId : null,
                        quantity : 1,
                        productId : prod.productId,
                        orderId : this.currentOrder.fields.Id.value,
                        priceBookEntryId : prod.priceBookEntryId,
                        productName : prod.productName,
                        productCode : prod.productCode,
                        unitPrice : prod.unitPrice,
                        totalPrice : prod.unitPrice,
                        updated : true
                    });

                }
                this.orderProductsList = ordersProductClone;
                this.showToast('Success','Selected items added to Order','success');    
                
             });
        }
        else{
            this.showToast('No Items selected','Select at least one product.','warning');    
        }
           
        }
    }
    
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            KPNOrder,
            (message) => this.handleMessage(message)
        );
    }
   
    
          
}
=======
import { LightningElement,api,wire,track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getOrderProducts from '@salesforce/apex/ProductListController.getOrderProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {createMessageContext, releaseMessageContext, APPLICATION_SCOPE, subscribe, unsubscribe} from 'lightning/messageService';
import KPNOrder from "@salesforce/messageChannel/KPNOrderMessage__c";
import fetchConfirmation from '@salesforce/apex/ProductListController.saveAndConfirmOrder';
const orderFields = [
    'Order.Id',
    'Order.Account.AccountNumber',
    'Order.Status',
    'Order.Type',
    'Order.OrderNumber'
];



export default class BasicDatatable extends LightningElement {
    @api recordId;
    currentOrder;
    currentOrderId;
    result;
    boolShowSpinner = false;
    strUrl;
    @track buttonDisabled;

    @track columns = [{
            label: 'Product name',
            fieldName: 'productName',
            type: 'text',
        },
        {
            label: 'Unit Price',
            fieldName: 'unitPrice',
            type: 'currency',
        },
        {
            label: 'Quantity',
            fieldName: 'quantity',
            type: 'decimal',
        },
        {
            label: 'Total Price',
            fieldName: 'totalPrice',
            type: 'currency',
        }
    ];

    @track error;
    @track orderProductsList ;

    
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
            alert(data);
            this.currentOrder = data;
            this.currentOrderId = this.currentOrder.fields.Id.value;
            this.buttonDisabled = this.currentOrder.fields.Status.value == 'Activated';
            this.subscription = subscribe(this.context, KPNOrder, (message) => {
                this.handleMessage(message);
            }, {scope: APPLICATION_SCOPE});
        }
    }
    
    @wire(getOrderProducts, { p_orderId: '$currentOrderId'})
    wiredProducts({ error, data }) {
        if (data) {
            this.orderProductsList = data;
        } else if (error) {
            this.error = 'Unknown error';
            if (Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
            this.orderProductsList = undefined;
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
        this.boolShowSpinner = true;
        var requestObj = new Object();
        requestObj.accountNumber = this.currentOrder.fields.Account.value.fields.AccountNumber.value;
        requestObj.orderNumber  = this.currentOrder.fields.OrderNumber.value;
        requestObj.type = this.currentOrder.fields.Type.value;
        requestObj.status =this.currentOrder.fields.Status.value;
        var requestProdObj;
        var requestProdsList = [];
        this.orderProductsList.forEach(prodTemp => {
            requestProdObj = new Object();
            requestProdObj.name = prodTemp.productName;
            requestProdObj.code = prodTemp.productCode;
            requestProdObj.unitPrice = prodTemp.unitPrice;
            requestProdObj.quantity = prodTemp.quantity;
            requestProdsList.push(requestProdObj);        
        });    
        requestObj.orderProducts = requestProdsList;
        var jsonString= JSON.stringify(requestObj);




        fetchConfirmation({p_jsonBody:jsonString, p_records:this.orderProductsList}).then(response => {
            if(response.contains('Error')){
                this.showToast('Error',response,'error');    
            }
            else{
                this.showToast('Success',response,'success');    
            }
            
            //this.strUrl = JSON.parse(response);
            this.boolShowSpinner = false;
        }).catch(error => {
           alert('Error: ' +error.body.message);
        });
        
    }
    @track receivedMessage = '';
    @track subscription = null;
 
    context = createMessageContext();
 
    handleSubscribe() { 
        if (this.subscription) {
            return;
        }
        this.context = createMessageContext();
        this.subscription = subscribe(this.context, KPNOrder, (message) => {
            this.handleMessage(message);
        }, {scope: APPLICATION_SCOPE});
    }
 
    handleMessage(event) {
    if (event) {
        var products = event.messageBody
        if(products.length > 0){
            products.forEach(prod => {
                const elementIndex = this.orderProductsList.findIndex(el => el.productId === prod.productId);
                let ordersProductClone = [...this.orderProductsList]; 
                if(elementIndex>=0){
                    ordersProductClone[elementIndex] = {
                        itemId :  this.orderProductsList[elementIndex].itemId,
                        quantity : this.orderProductsList[elementIndex].quantity +1,
                        productId : prod.productId,
                        orderId : this.currentOrder.fields.Id.value,
                        priceBookEntryId : prod.priceBookEntryId,
                        productName : prod.productName,
                        productCode : prod.productCode,
                        unitPrice : prod.unitPrice,
                        totalPrice : this.orderProductsList[elementIndex].totalPrice+prod.unitPrice,
                        updated : true
                    };
                }
                else{
                    ordersProductClone.push({ 
                        itemId : null,
                        quantity : 1,
                        productId : prod.productId,
                        orderId : this.currentOrder.fields.Id.value,
                        priceBookEntryId : prod.priceBookEntryId,
                        productName : prod.productName,
                        productCode : prod.productCode,
                        unitPrice : prod.unitPrice,
                        totalPrice : prod.unitPrice,
                        updated : true
                    });

                }
                this.orderProductsList = ordersProductClone;
                this.showToast('Success','Selected items added to Order','success');    
                
             });
        }
        else{
            this.showToast('No Items selected','Select at least one product.','warning');    
        }
           
        }
    }
 
    handleUnsubscribe() {
        unsubscribe(this.subscription);
        this.subscription = undefined;
        releaseMessageContext(this.context);
    }
 
    get subscribeStatus() {
        return this.subscription ? 'TRUE' : 'FALSE';
    }
    

   
    
          
}
>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69
