/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dataServer;

import eu.proasense.internal.RecommendationEvent;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.swing.SortingFocusTraversalPolicy;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.thrift.TDeserializer;
import org.apache.thrift.protocol.TJSONProtocol;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

/**
 *
 * @author Giovanni
 */
public class StorageRESTClientManager {

	private static String StreamPipes;// = "http://proasense.nissatech.com/api/kpis";
    private static String storageLocation;// = "192.168.84.34"; NOVO ->192.168.84.41
    private static String storagePortRegistryC;// ="8080"; NOVO -> 8082
    private static String storageRegistryContext = "/storage-registry";
    private static String storageReaderContext = "/storage-reader";
    private static String storagePortReadC;// NOVO -> 8081
    
    // Default HTTP client and common properties for requests
    private static CloseableHttpClient client;
    private static PoolingHttpClientConnectionManager connManager;
    private StringBuilder requestUrl;
    private List<NameValuePair> params;
    private String queryString;
    private Main mainreference;
    
    public StorageRESTClientManager() {

        //HttpParams httpParameters = new BasicHttpParams();
        //int timeoutConnection = 5000;
        //HttpConnectionParams.setConnectionTimeout(httpParameters, timeoutConnection);
        //int timeoutSocket = 5000;
        //HttpConnectionParams.setSoTimeout(httpParameters, timeoutSocket);

    	connManager = new PoolingHttpClientConnectionManager();
        connManager.setDefaultMaxPerRoute(20);
        connManager.setMaxTotal(40);    	
    	
        client = HttpClients.custom().setConnectionManager(connManager).build();
        requestUrl = null;
        params = null;
        queryString = null;
        
        //get storage IPs, URLs and Ports from environment variables
		StreamPipes = System.getenv("StreamPipes");
		storageLocation = System.getenv("StorageLocation");
		storagePortReadC = System.getenv("StoragePortReadC");
		storagePortRegistryC = System.getenv("StoragePortRegistryC");
    }

    public void reconnect(){
    	//if(this.client.)
    }
    
    public List<RecommendationEvent> /*List<FeedbackEvent>*/ readFromStorage(String startDate, String endDate) {
        //        GetMethod get = new GetMethod("http://" + storageLocation + ":" + storagePort + storageContext + "/query/feedback/default/?startDate=" + startDate + "&endDate=" + endDate);
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;
        // Default query for simple events
        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePortRegistryC + storageRegistryContext + "/query/recommendation/default");

        params = new LinkedList<>();
        params.add(new BasicNameValuePair("startTime", startDate));
        params.add(new BasicNameValuePair("endTime", endDate));

        queryString = URLEncodedUtils.format(params, "utf-8");
        requestUrl.append("?");
        requestUrl.append(queryString);

        try {
            HttpGet query = new HttpGet(requestUrl.toString());
            query.setHeader("Content-type", "application/json");
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                throw new RuntimeException("Failed! HTTP error code: " + status);
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //System.out.println("RECOMMENDATION.DEFAULT: " + body);
            // The result is an array of feedback events serialized as JSON using Apache Thrift.
            // The feedback events can be deserialized into Java objects using Apache Thrift.
            ObjectMapper mapper = new ObjectMapper();
            JsonNode nodeArray = mapper.readTree(body);
            List<RecommendationEvent> events = new ArrayList<>();
            for (JsonNode node : nodeArray) {
                byte[] bytes = node.toString().getBytes();
                TDeserializer deserializer = new TDeserializer(new TJSONProtocol.Factory());
                RecommendationEvent event = new RecommendationEvent();
                deserializer.deserialize(event, bytes);
                System.out.println(event.toString());
                events.add(event);
            }
            return events;
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return null;
        }

////        GetMethod get = new GetMethod("http://" + storageLocation + ":" + storagePort + storageContext + "/query/feedback/default/?startDate=" + startDate + "&endDate=" + endDate);
//        // Default HTTP response and common properties for responses
//        HttpResponse response = null;
//        ResponseHandler<String> handler = null;
//        int status = 0;
//        String body = null;
//        // Default query for simple events
//        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePort + storageContext + "/query/feedback/default");
//
//        params = new LinkedList<>();
//        params.add(new BasicNameValuePair("startTime", startDate));
//        params.add(new BasicNameValuePair("endTime", endDate));
//
//        queryString = URLEncodedUtils.format(params, "utf-8");
//        requestUrl.append("?");
//        requestUrl.append(queryString);
//
//        try {
//            HttpGet query = new HttpGet(requestUrl.toString());
//            query.setHeader("Content-type", "application/json");
//            response = client.execute(query);
//
//            // Check status code
//            status = response.getStatusLine().getStatusCode();
//            if (status != 200) {
//                throw new RuntimeException("Failed! HTTP error code: " + status);
//            }
//
//            // Get body
//            handler = new BasicResponseHandler();
//            body = handler.handleResponse(response);
//
//            System.out.println("FEEDBACK.DEFAULT: " + body);
//            // The result is an array of feedback events serialized as JSON using Apache Thrift.
//            // The feedback events can be deserialized into Java objects using Apache Thrift.
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode nodeArray = mapper.readTree(body);
//            List<FeedbackEvent> events = new ArrayList<>();
//            for (JsonNode node : nodeArray) {
//                byte[] bytes = node.toString().getBytes();
//                TDeserializer deserializer = new TDeserializer(new TJSONProtocol.Factory());
//                FeedbackEvent event = new FeedbackEvent();
//                deserializer.deserialize(event, bytes);
//                System.out.println(event.toString());
//                events.add(event);
//            }
//            return events;
//        } catch (Exception e) {
//            System.out.println(e.getClass().getName() + ": " + e.getMessage());
//            return null;
//        }
    }
    
    //Lists

    public boolean insertKPIStorage(String kpiInfo) {
        
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        try {
            HttpPost query = new HttpPost(StreamPipes);
            query.setHeader("Content-type", "application/json");
            query.setEntity(new StringEntity(kpiInfo));
            
            System.out.println("\n\n\n########################################################################################################\n\n\n");
            System.out.println(kpiInfo);
            System.out.println("\n\n\n########################################################################################################\n\n\n");
            System.out.println(query.toString());
            System.out.println("\n\n\n########################################################################################################\n\n\n");
            
            response = client.execute(query);

            System.out.println("\n\n\nResponse:\n"+response.toString());
            
            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
            	
                //throw new RuntimeException("Failed! HTTP error code: " + status);
                //apagar kpi da BD
                System.out.println("Error accessing storage: "+status);
                
                return false;
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //result
            return true;
            
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return false;
        }
    }
    
 
    public boolean updateKPIStorage(String kpiInfo) {
        
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        try {
            HttpPost
            query = new HttpPost(StreamPipes);
            query.setHeader("Content-type", "application/json");
            query.setEntity(new StringEntity(kpiInfo));
            
            System.out.println("\n\n\n########################################################################################################\n\n\n");
            System.out.println(kpiInfo);
            System.out.println("\n\n\n########################################################################################################\n\n\n");
            System.out.println(query.toString());
            System.out.println("\n\n\n########################################################################################################\n\n\n");
            
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                //throw new RuntimeException("Failed! HTTP error code: " + status);
            	 System.out.println("Error accessing storage: "+status);
                 
                 return false;
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //result
            return true;
            
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return false;
        }
    }    
    
    public boolean deleteKPIStorage(String kpiID) {
      
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        try {
        	HttpDelete query = new HttpDelete(StreamPipes.concat("/").concat(kpiID));
        	
        	
        	System.out.println("\n\n\n########################################################################################################\n\n\n");
        	System.out.println(query.toString());
        	System.out.println("\n\n\n########################################################################################################\n\n\n");
            
        	response = client.execute(query);

            System.out.println("\n\n\nResponse:\n"+response.toString());

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                //throw new RuntimeException("Failed! HTTP error code: " + status);
                
                //keep the kpi in de DB
            	System.out.println("Error accessing storage: "+status);
                
                return false;
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //result
            return true;
            
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return false;
        }
    }
    
    public String getAllMachines() {
        // Default HTTP client and common properties for requests
        requestUrl = null;
        
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        // Query for machine list
        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePortRegistryC + storageRegistryContext + "/query/machine/list");

        try {
            HttpGet query = new HttpGet(requestUrl.toString());
            query.setHeader("Content-type", "application/json");
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                throw new RuntimeException("Failed! HTTP error code: " + status);
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //System.out.println("MACHINE LIST: " + body);
            return body;
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return null;
        }
    }
    
    public String getAllSensors(String context){
        // Default HTTP client and common properties for requests
        requestUrl = null;
      
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        // Query for sensor list
        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePortRegistryC + storageRegistryContext + "/query/sensor/list2?dataset="+context);
        
        //System.out.println("Request URL: "+requestUrl);
        
        try {
            HttpGet query = new HttpGet(requestUrl.toString());
            query.setHeader("Content-type", "application/json");
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                throw new RuntimeException("Failed! HTTP error code: " + status);
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //System.out.println("body: "+body);
            
            //System.out.println("SENSOR LIST: " + body);
            return body;
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return null;
        }
    }
    
    public String getAllProducts(){
        // Default HTTP client and common properties for requests
        requestUrl = null;
      
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        // Query for product list
        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePortRegistryC + storageRegistryContext + "/query/product/list");

        try {
            HttpGet query = new HttpGet(requestUrl.toString());
            query.setHeader("Content-type", "application/json");
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                throw new RuntimeException("Failed! HTTP error code: " + status);
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //System.out.println("PRODUCT LIST: " + body);
            return body;
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return null;
        }
    }
    
    public String getAllMoulds(){
        // Default HTTP client and common properties for requests
        requestUrl = null;
        
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        // Query for mould list
        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePortRegistryC + storageRegistryContext + "/query/mould/list");

        try {
            HttpGet query = new HttpGet(requestUrl.toString());
            query.setHeader("Content-type", "application/json");
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                throw new RuntimeException("Failed! HTTP error code: " + status);
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //System.out.println("MOULD LIST: " + body);
            return body;
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return null;
        }
    }
    
    //Properties
    
    public String getMachineProperties(String machineId){
        // Default HTTP client and common properties for requests
        requestUrl = null;
        params = null;
        queryString = null;
       
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        // Query for machine properties
        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePortRegistryC + storageRegistryContext + "/query/machine/properties");
        
        params = new LinkedList<NameValuePair>();
        params.add(new BasicNameValuePair("machineId", machineId));
        
        queryString = URLEncodedUtils.format(params, "utf-8");
        requestUrl.append("?");
        requestUrl.append(queryString);


        try {
            HttpGet query = new HttpGet(requestUrl.toString());
            query.setHeader("Content-type", "application/json");
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                throw new RuntimeException("Failed! HTTP error code: " + status);
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //System.out.println("MACHINE PROPRIETIES: " + body);
            return body;
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return null;
        }
    }
    
    public String getSensorProprerties(String sensorId,String context){
        // Default HTTP client and common properties for requests
        requestUrl = null;
        params = null;
        queryString = null;
       
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        // Query for sensor properties
        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePortRegistryC + storageRegistryContext + "/query/sensor/properties?dataset="+context+"&sensorId="+sensorId);

        try {
            HttpGet query = new HttpGet(requestUrl.toString());
            query.setHeader("Content-type", "application/json");
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                throw new RuntimeException("Failed! HTTP error code: " + status);
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //System.out.println("SENSOR PROPRIETIES: " + body);
            return body;
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return null;
        }
    }
    
    public String getProductProperties(String productId){
          // Default HTTP client and common properties for requests
        requestUrl = null;
        params = null;
        queryString = null;
       
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        // Query for product properties
        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePortRegistryC + storageRegistryContext + "/query/product/properties");
        
        params = new LinkedList<NameValuePair>();
        params.add(new BasicNameValuePair("productId", productId));
        
        queryString = URLEncodedUtils.format(params, "utf-8");
        requestUrl.append("?");
        requestUrl.append(queryString);


        try {
            HttpGet query = new HttpGet(requestUrl.toString());
            query.setHeader("Content-type", "application/json");
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                throw new RuntimeException("Failed! HTTP error code: " + status);
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //System.out.println("PRODUCT PROPRIETIES: " + body);
            return body;
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return null;
        }
    }
    
    public String getMouldProperties(String mouldId){
          // Default HTTP client and common properties for requests
        requestUrl = null;
        params = null;
        queryString = null;
       
        // Default HTTP response and common properties for responses
        HttpResponse response = null;
        ResponseHandler<String> handler = null;
        int status = 0;
        String body = null;

        // Query for mould properties
        requestUrl = new StringBuilder("http://" + storageLocation + ":" + storagePortRegistryC + storageRegistryContext + "/query/mould/properties");
        
        params = new LinkedList<NameValuePair>();
        params.add(new BasicNameValuePair("sensorId", mouldId));
        
        queryString = URLEncodedUtils.format(params, "utf-8");
        requestUrl.append("?");
        requestUrl.append(queryString);


        try {
            HttpGet query = new HttpGet(requestUrl.toString());
            query.setHeader("Content-type", "application/json");
            response = client.execute(query);

            // Check status code
            status = response.getStatusLine().getStatusCode();
            if (status != 200) {
                throw new RuntimeException("Failed! HTTP error code: " + status);
            }

            // Get body
            handler = new BasicResponseHandler();
            body = handler.handleResponse(response);

            //System.out.println("MOULD PROPRIETIES: " + body);
            return body;
        } catch (Exception e) {
            System.out.println(e.getClass().getName() + ": " + e.getMessage());
            return null;
		}
	}

}
