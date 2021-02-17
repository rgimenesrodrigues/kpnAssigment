import { createElement } from 'lwc';
import ProductList from 'c/productList';
<<<<<<< HEAD
import {MessageContext, APPLICATION_SCOPE, publish} from 'lightning/messageService';
import KPNOrder from "@salesforce/messageChannel/KPNOrderMessage__c";
=======
>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69
import { getRecord } from 'lightning/uiRecordApi';
import {
    registerTestWireAdapter,
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';
import getProducts from '@salesforce/apex/ProductListController.getProducts';
import {jest} from '@jest/globals'
<<<<<<< HEAD
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
const SHOW_TOAST_EVT = 'lightning__showtoast';
=======

>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69
const mockGetRecord = require('./data/getOrderRecord.json');
const mockGetProductsList = require('./data/getProductsList.json');
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
const getProductsListAdapter = registerApexTestWireAdapter(getProducts);
<<<<<<< HEAD
const messageContextWireAdapter = registerTestWireAdapter(MessageContext);

const MOCK_APEX_RESPONSE = 2;
const mockOrderId = '8015Y000000V905QAC';
const mockProd1 = '01u5Y00000yI911QAD';
const mockProd2 = '01u5Y00000yI911QAC';
const mockProd3 = '01u5Y00000yI911QAB';
const mockProd4 = '01u5Y00000yI911QAA';
const mockProd5 = '01u5Y00000yI911QAE';
const mockProd6 = '01u5Y00000yI911QAF';
const handleClick = jest.fn();
const SELECTED_ROWS = 
  [
    {
      "RecordId" : mockProd1,
      "Name" : "Product 1",
      "Selected" : true

    }

  ]  ;

  const SELECTED_ROWS_EMPTY = 
  [
  ]  ;


describe('c-product-list', () => {
  afterEach(() => {
=======

describe('c-product-list', () => {
    afterEach(() => {
>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

<<<<<<< HEAD
  describe('context @wire', () => {
      it('Renders message context', () => {
        const element = createElement('c-product-list', {
          is: ProductList
        });
        
        document.body.appendChild(element);

        const payload = {
          update: true
        };
        publish(messageContextWireAdapter, KPNOrder, payload);
        
        return Promise.resolve()
          .then(() => {
              // will write assert statements here.
          })
        
      });
    });


  describe('getRecord @wire', () => {
      it('Render order details', () => {
        const element = createElement('c-product-list', {
          is: ProductList
        });
        
        element.recordId = "8015Y000000V905QAC";
        document.body.appendChild(element);
        getRecordAdapter.emit(mockGetRecord);
        
        
        return Promise.resolve()
          .then(() => {
            
          })
        
      });
    });
    describe('getRecord @wire error', () => {
      it('shows error message', () => {
        const element = createElement('c-product-list', {
          is: ProductList
        });
        const showToastHandler = jest.fn();
        element.addEventListener(ShowToastEventName,showToastHandler);
        
        document.body.appendChild(element);
        // Emit error from @wire
        getRecordAdapter.error();
    
        return Promise.resolve().then(() => {
          
        });
      });
    });
    it('Test No Records Selected', () => {
      
      const showToastHandler = jest.fn();
      
      // Create initial element
      const element = createElement('c-product-list', {
          is: ProductList
      });
     
      element.sortedDirection = 'asc';
      element.sortedBy = 'productName';
      element.recordId = '8015Y000000V905QAC';
      element.pagesize = 2;
      element.addEventListener(ShowToastEventName,showToastHandler);
      element.addEventListener("handleClick",handleClick);
      
      handleClick.mockResolvedValue(MOCK_APEX_RESPONSE);
      document.body.appendChild(element);
      
  
      getRecordAdapter.emit(mockGetRecord);
      getProductsListAdapter.emit(mockGetProductsList);
      
      
      return flushPromises().then(() => {
        const tableProduct = element.shadowRoot.querySelector('lightning-datatable');
        tableProduct.getSelectedRows = jest.fn().mockReturnValue(SELECTED_ROWS_EMPTY);
        const buttonEl = element.shadowRoot.querySelector('lightning-button[data-id=addOrderBtn]');
        buttonEl.click();  
        expect(showToastHandler).toHaveBeenCalled();
        expect(showToastHandler.mock.calls[0][0].detail.title).toBe('No Items selected');
        expect(showToastHandler.mock.calls[0][0].detail.message).toBe('Select at least one product.');
        expect(showToastHandler.mock.calls[0][0].detail.variant).toBe('warning');
      });
  });
  it('Test Records Selected', () => {
      
    const element = createElement('c-product-list', {
        is: ProductList
    });
    const handleNextPage = jest.fn();
    const sortHandler = jest.fn();
    element.sortedDirection = 'asc';
    element.sortedBy = 'productName';
    element.recordId = '8015Y000000V905QAC';
    element.pagesize = 2;
    element.addEventListener("handleClick",handleClick);
    handleClick.mockResolvedValue(MOCK_APEX_RESPONSE);
    element.addEventListener("handleSort",sortHandler);
    sortHandler.mockResolvedValue(MOCK_APEX_RESPONSE);
    document.body.appendChild(element);
    const sortCol = new CustomEvent("sort", {
      detail: { sortedDirection: "desc",sortedBy :"productName"  }
    });

    getRecordAdapter.emit(mockGetRecord);
    getProductsListAdapter.emit(mockGetProductsList);
    
    
    return flushPromises().then(() => {
      const tableProduct = element.shadowRoot.querySelector('lightning-datatable');
      tableProduct.getSelectedRows = jest.fn().mockReturnValue(SELECTED_ROWS);
      element.sortedDirection = 'desc';
      element.sortedBy = 'productName';
      //tableProduct.data.sort() = jest.fn().mockImplementation('"event":{"sortedDirection":"desc","sortedBy":"productName"}"');
      const buttonEl = element.shadowRoot.querySelector('lightning-button[data-id=addOrderBtn]');
      buttonEl.click();  
      const buttonNext = element.shadowRoot.querySelector('lightning-button[data-id=nextPageBtn]');
      buttonNext.click();  
      const buttonPrev = element.shadowRoot.querySelector('lightning-button[data-id=prevPageBtn]');
      buttonPrev.click();
      tableProduct.dispatchEvent(sortCol);
    });
});

  function flushPromises() {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setImmediate(resolve));
  }
  describe('getProducts @wire error', () => {
    it('shows error message', () => {
      const element = createElement('c-product-list', {
        is: ProductList
      });
      document.body.appendChild(element);
  
      // Emit error from @wire
      getProductsListAdapter.error();
  
      return Promise.resolve().then(() => {
        
      });
    });
  });
     
=======
describe('getRecord @wire data', () => {
  it('renders order details', () => {
      const element = createElement('c-product-list', {
        is: ProductList
      });
      
      element.recordId = '8015Y000000V905QAC';
      element.sortedDirection = 'asc';
      element.sortedBy = 'productName';
      document.body.appendChild(element);
      getRecordAdapter.emit(mockGetRecord);
          
      return Promise.resolve()
        .then(() => {
                // will write assert statements here.
        })
          
    });
  });

      describe('getProducts @wire data', () => {
        it('renders products details', () => {
          const element = createElement('c-product-list', {
            is: ProductList
          });
          element.currentOrderId = '8015Y000000V905QAC';
          document.body.appendChild(element);
          getProductsListAdapter.emit(mockGetProductsList);
      
          
        });
      });
>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69
});