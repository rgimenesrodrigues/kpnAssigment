import { createElement } from 'lwc';
import ProductList from 'c/productList';
import { getRecord } from 'lightning/uiRecordApi';
import {
    registerTestWireAdapter,
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';
import getProducts from '@salesforce/apex/ProductListController.getProducts';
import {jest} from '@jest/globals'

const mockGetRecord = require('./data/getOrderRecord.json');
const mockGetProductsList = require('./data/getProductsList.json');
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
const getProductsListAdapter = registerApexTestWireAdapter(getProducts);

describe('c-product-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

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
});