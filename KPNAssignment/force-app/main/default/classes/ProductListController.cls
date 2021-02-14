public with sharing class ProductListController {
    @AuraEnabled(cacheable=true)
    public static List<PricebookEntry> getProducts(string p_pricebookId,string p_sortBy, string p_sortDirection){
        string query = 'SELECT Id,Product2Id,Product2.Name,UnitPrice,ProductCode FROM PricebookEntry Where pricebook2Id = : p_pricebookId' ;
        
        if (p_sortBy != null && p_sortDirection != null) {
            
            query += ' ORDER BY ' + (p_sortBy=='productName'?'Product2.Name':p_sortBy) + ' ' + p_sortDirection;
        }
       
         
        return Database.query( query );
    }

    @AuraEnabled(cacheable=true)
    public static List<orderProductsWrapper> getOrderProducts(string p_orderId){
        List<orderProductsWrapper> returnValue = new List<orderProductsWrapper>();
        orderProductsWrapper record;
        for(OrderItem oi : [SELECT Id,OrderId,PricebookEntryId,Product2Id,Product2.ProductCode,Product2.Name,Quantity,TotalPrice,UnitPrice FROM OrderItem Where OrderId  = : p_orderId  Order By OrderItemNumber ]){
            record = new orderProductsWrapper();
            record.productId = oi.Product2Id;
            record.orderId = oi.OrderId;
            record.priceBookEntryId = oi.priceBookEntryId;
            record.productName = oi.Product2.Name;
            record.quantity = oi.Quantity;
            record.unitPrice = oi.UnitPrice;
            record.totalPrice = oi.TotalPrice;
            record.productCode = oi.Product2.ProductCode;
            record.itemId = oi.Id;
            record.updated = false;
            returnValue.add(record);
        }
         
        return returnValue;
    }

    public class orderProductsWrapper{
        @AuraEnabled
        public id orderId{get;set;}
        @AuraEnabled
        public id itemId{get;set;}
        @AuraEnabled
        public id productId{get;set;}
        @AuraEnabled
        public id priceBookEntryId{get;set;}
        @AuraEnabled
        public string productName{get;set;}
        @AuraEnabled
        public string productCode{get;set;}
        @AuraEnabled
        public decimal quantity{get;set;}
        @AuraEnabled
        public double unitPrice{get;set;}
        @AuraEnabled
        public double totalPrice{get;set;}
        @AuraEnabled
        public boolean updated{get;set;}

    }

    @AuraEnabled
    public static String saveAndConfirmOrder(string p_jsonBody,list<orderProductsWrapper> p_records) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        string savingResult = ''; 
        request.setEndpoint('callout:ConfirmOrderKPNNC');
        request.setMethod('POST');
        request.setBody(p_jsonBody)  ;    
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            savingResult = saveItems(p_records); 
            if(string.IsBlank(savingResult)){
                return 'Order confirmed sucessfully';
            }    
            else{
                return savingResult;
            }
        }
        else{
            return 'The server returns the follow error when we were trying to confirm the order : ' +  response.getBody();
        }
        
    }

    private static string saveItems(list<orderProductsWrapper> p_records){
        list<Orderitem> ordersToUpsert = new list<Orderitem>();
        Orderitem oItem = new Orderitem();
        string returnValue = '';
        string orderId;

        try{
            
            for(orderProductsWrapper record : p_records){
                oItem = new Orderitem();
                if(record.updated){
                    orderId = record.orderId;
                    oItem.Quantity = record.quantity;
                    oitem.UnitPrice = record.unitPrice;
                    if(record.itemId==null){
                        oItem.OrderId = record.orderId;            
                        oitem.PricebookEntryId = record.priceBookEntryId;
                    }
                    else{
                        oItem.Order = new Order(Id = record.orderId);            
                        oitem.PricebookEntry = new PriceBookEntry(id = record.priceBookEntryId);
                        oItem.Id = record.itemId;
                    }
                    ordersToUpsert.add(oItem);
                    
                }
                
                
            }   
                
            upsert ordersToUpsert;

            Order order = new Order(Id = orderId,status='Activated');
            update order;

            
        }
        catch(exception ex){
            returnValue = 'Error saving records :' + ex.getMessage();    
        }
        return returnValue;

        
        
              
           
            
    }


    
}