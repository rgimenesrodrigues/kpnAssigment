import { createElement } from 'lwc';
import OrderProductsList from 'c/orderProductsList';
import { getRecord } from 'lightning/uiRecordApi';
import {
    registerTestWireAdapter,
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';
import getOrderProducts from '@salesforce/apex/ProductListController.getOrderProducts';
import {jest} from '@jest/globals'

const mockGetRecord = require('./data/getOrderRecord.json');
const mockGetOrderProductsList = require('./data/getOrderProductsList.json');
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
const getOrderProductsListAdapter = registerApexTestWireAdapter(getOrderProducts);

describe('c-order-products-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

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
          element.currentOrderId = '8015Y000000V905QAC';
          document.body.appendChild(element);
          
      
          // Emit data from @wire
          getOrderProductsListAdapter.emit(mockGetOrderProductsList);
      
          
        });
      });
});