import { createElement } from 'lwc';
import OrderProductsList from 'c/orderProductsList';
<<<<<<< HEAD
import ProductList from 'c/productList';
import { subscribe, MessageContext, publish } from 'lightning/messageService';
=======
>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69
import { getRecord } from 'lightning/uiRecordApi';
import {
    registerTestWireAdapter,
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';
import getOrderProducts from '@salesforce/apex/ProductListController.getOrderProducts';
import {jest} from '@jest/globals'
<<<<<<< HEAD
import KPNOrder from "@salesforce/messageChannel/KPNOrderMessage__c";
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import fetchConfirmation from '@salesforce/apex/ProductListController.saveAndConfirmOrder';

const mockGetRecord = require('./data/getOrderRecord.json');
const mockGetOrderProductsList = require('./data/getOrderProductsList.json');
const mockGetFetchConfirmation = require('./data/getFetchOrderConfirmation.json');
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
const getOrderProductsListAdapter = registerApexTestWireAdapter(getOrderProducts);
const getFecthOrderConfirmation = registerTestWireAdapter(mockGetFetchConfirmation);
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
const ROWS = 
  [
    {
      "RecordId" : mockProd1,
      "Name" : "Product 1",
      "Selected" : true

    }

  ]  ;


function flushPromises() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setImmediate(resolve));
}

=======

const mockGetRecord = require('./data/getOrderRecord.json');
const mockGetOrderProductsList = require('./data/getOrderProductsList.json');
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
const getOrderProductsListAdapter = registerApexTestWireAdapter(getOrderProducts);
>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69

describe('c-order-products-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

<<<<<<< HEAD
    it('registers the LMS subscriber during the component lifecycle', () => {
      
      const element = createElement('c-order-products-list', {
          is: OrderProductsList
      });
      document.body.appendChild(element);

      // Validate if pubsub got registered after connected to the DOM
      expect(subscribe).toHaveBeenCalled();
      expect(subscribe.mock.calls[0][1]).toBe(KPNOrder);
  });
    
=======
>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69
    describe('getRecord @wire data', () => {
        it('renders order details', () => {
          const element = createElement('c-order-products-list', {
            is: OrderProductsList
          });
          
          element.recordId = '8015Y000000V905QAC';
          document.body.appendChild(element);
          getRecordAdapter.emit(mockGetRecord);
          
          return Promise.resolve()
            .then(() => {
                // will write assert statements here.
            })
          
        });
      });

      describe('getOrderProducts @wire data', () => {
        it('renders products details', () => {
          const element = createElement('c-order-products-list', {
            is: OrderProductsList
          });
<<<<<<< HEAD
          element.recordId = '8015Y000000V905QAC';
=======
          element.currentOrderId = '8015Y000000V905QAC';
>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69
          document.body.appendChild(element);
          
      
          // Emit data from @wire
          getOrderProductsListAdapter.emit(mockGetOrderProductsList);
<<<<<<< HEAD
          
          
        });
      });

      describe('getFetchOrder @wire data', () => {
        it('renders fetch order details', () => {
          const element = createElement('c-order-products-list', {
            is: OrderProductsList
          });
          element.recordId = '8015Y000000V905QAC';
          document.body.appendChild(element);
          
      
          // Emit data from @wire
          getFecthOrderConfirmation.emit(mockGetFetchConfirmation);
          return Promise.resolve().then(() => {
            //const errorElement = element.shadowRoot.querySelector('p');
            //expect(errorElement).not.toBeNull();
            //expect(errorElement.textContent).toBe('No account found.');
          });
          
        });
      });

      describe('getRecord @wire error', () => {
        it('shows error message', () => {
          const element = createElement('c-order-products-list', {
            is: OrderProductsList
          });
          document.body.appendChild(element);
      
          // Emit error from @wire
          getRecordAdapter.error();
      
          return Promise.resolve().then(() => {
            //const errorElement = element.shadowRoot.querySelector('p');
            //expect(errorElement).not.toBeNull();
            //expect(errorElement.textContent).toBe('No account found.');
          });
        });
      });
      
      describe('getOrderProducts @wire error', () => {
        it('shows error message', () => {
          const element = createElement('c-order-products-list', {
            is: OrderProductsList
          });
          document.body.appendChild(element);
          
          //getOrderProductsListAdapter.error().message = 'Error getting products';

          // Emit error from @wire
          getOrderProductsListAdapter.error();
      
          return Promise.resolve().then(() => {
            //const errorElement = element.shadowRoot.querySelector('p');
            //expect(errorElement).not.toBeNull();
            //expect(errorElement.textContent).toBe('No account found.');
          });
        });
      });
      
      describe('test button click ', () => {
        it('test button click', () => {
          const element = createElement('c-order-products-list', {
            is: OrderProductsList
          });
          element.recordId = '8015Y000000V905QAC';
          document.body.appendChild(element);
          
      
          getRecordAdapter.emit(mockGetRecord);
          getOrderProductsListAdapter.emit(mockGetOrderProductsList);
          return flushPromises().then(() => {
            const buttonEl = element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();
            expect(subscribe).toHaveBeenCalled();
    });
  });
  
});

describe('getRecord @wire error', () => {
  it('displays a toast message', () => {
      // Create initial element
      const element = createElement('c-order-products-list', {
          is: OrderProductsList
      });
      document.body.appendChild(element);

      // Mock handler for toast event
      const handler = jest.fn();
      // Add event listener to catch toast event
      element.addEventListener(ShowToastEventName, handler);

      // Emit error from @wire
      getRecordAdapter.error();

      // Return a promise to wait for any asynchronous DOM updates. Jest
      // will automatically wait for the Promise chain to complete before
      // ending the test and fail the test if the promise rejects.
      return Promise.resolve().then(() => {
          
      });
  });
});
describe('getRecord @wire error', () => {
  it('shows error message', () => {
    const element = createElement('c-order-product-list', {
      is: OrderProductsList
    });
    const showToastHandler = jest.fn();
    element.addEventListener(ShowToastEventName,showToastHandler);
    
    document.body.appendChild(element);
    // Emit error from @wire
    getRecordAdapter.error();

    return flushPromises().then(() => {
      
    });
  });
});
it('Test error saving order', () => {
  
  const showToastHandler = jest.fn();
  
  // Create initial element
  const element = createElement('c-order-products-list', {
      is: OrderProductsList
  });
 
  element.addEventListener(ShowToastEventName,showToastHandler);
  element.addEventListener("handleClick",handleClick);
  
  handleClick.mockResolvedValue(MOCK_APEX_RESPONSE);
  document.body.appendChild(element);
  

  getRecordAdapter.emit(mockGetRecord);
  getOrderProductsListAdapter.emit(mockGetOrderProductsList);
  
  
  return flushPromises().then(() => {
    const tableProduct = element.shadowRoot.querySelector('lightning-datatable');
    //tableProduct.data = jest.fn().mockReturnValue(ROWS);
    const buttonEl = element.shadowRoot.querySelector('lightning-button');
    buttonEl.click();  
    
    //expect(showToastHandler.mock.calls[0][0].detail.title).toBe('No Items selected');
    //expect(showToastHandler.mock.calls[0][0].detail.message).toBe('Select at least one product.');
    //expect(showToastHandler.mock.calls[0][0].detail.variant).toBe('warning');
  });
});
describe('handle message', () => {
  it('calls publish based on an event ', () => {
    const messagePayload = {
      "messageBody": [{
          "productId": "123456789",
          "productName": "Product 1",
          "unitPrice": 100.0,
          "quantity": 1,
          "totalPrice": 100.00
        },
        {
          "productId": "123456788",
          "productName": "Product 2",
          "unitPrice": 110.0,
          "quantity": 3,
          "totalPrice": 3300.00
        }
      ],
      "source": "LWC"
    };
    
    // Create initial element
    const element = createElement('c-order-products-list', {
        is: OrderProductsList
    });
    
    document.body.appendChild(element);
    getRecordAdapter.emit(mockGetRecord);
    getOrderProductsListAdapter.emit(mockGetOrderProductsList);
  
    //const messagePayload = '{"messageBody" : ' + message +',"source":"LWC"}';
        publish(
            messageContextWireAdapter,
            KPNOrder,
            messagePayload
        );

      return flushPromises().then(() => {
        
    });

  });
});    
=======
      
          
        });
      });
>>>>>>> ec97bc5f7c276e12456155b3b36f373c844c4b69
});