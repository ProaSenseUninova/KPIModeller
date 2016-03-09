package dataServer;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;

import java.awt.image.renderable.ContextualRenderedImageFactory;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.Map;


import org.hsqldb.types.TimestampData;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import dataServer.database.DBConfig;
import dataServer.database.dbobjects.Product;
import dataServer.database.enums.SamplingInterval;
import dataServer.database.enums.TableValueType;

@WebServlet("/data/*")
public class Main extends HttpServlet
{
	static LoggingSystem _log;
	String logPath;
	String dbPath;
	DBConfig dbConfig;
	DatabaseAccessObject dAO;
	
	public static Map<String, String> splitQuery(String query) throws UnsupportedEncodingException {
	    Map<String, String> query_pairs = new LinkedHashMap<String, String>();
	    String[] pairs = query.split("&");
	    for (String pair : pairs) {
	        int idx = pair.indexOf("=");
	        query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
	    }
	    return query_pairs;
	}
	
	public void getData(HttpServletResponse response,String dbName,String tableName,Integer idReq,String remoteAddress, String queryString)
	{
		try {
			DriverManager.registerDriver(new org.hsqldb.jdbcDriver());
			Map<String, String> queryParams = new LinkedHashMap<String, String>();
			
			if(queryString!=null)
			{
				queryParams = splitQuery(queryString);
				writeLogMsg("<request>"+queryString+"</request>");
			}
			if(dbName.equals("func"))
			{
				String x = tableName.substring(0,12);
				if(tableName.contains("getGraphData"))
				{
					response.getWriter().println(getGraphData(queryParams));
				}
				else if(tableName.contains("getHeatMapData"))
				{
					response.getWriter().println(getHeatMapData(queryParams));
				}		
				else if(tableName.contains("getRealTimeKpis"))
				{
					response.getWriter().println(getRealTimeKpis(queryParams));
				}
			}
			else
			{
				Connection c = DriverManager.getConnection(dbConfig.jdbcURL+dbName, dbConfig.userName, dbConfig.password);
				Statement s =  c.createStatement();
				String query = "SELECT * FROM \""+tableName+"\"";
				
				if(tableName.equals("kpi")) {
					query += " WHERE \"active\" = true ";
					if(idReq!=null)
					{
						writeLogMsg(tableName);
						query+= " AND \"id\"="+idReq;
					}
				}
				else {
					if(idReq!=null)
					{
						writeLogMsg(tableName);
						query+= " WHERE \"id\"="+idReq;
					}
				}

				writeLogMsg("SQL Query: "+query);
				
				
				ResultSet r = s.executeQuery(query);
				 // are implementation dependent unless you use the SQL ORDER statement
		        ResultSetMetaData meta;
		
				String qm=null;
				meta = r.getMetaData();
				String str ="[";
		        int               colmax = meta.getColumnCount();
		        int               i;
		        Object            o = null;
		        // the result set is a cursor into the data.  You can only
		        // point to one row at a timeop
		        // assume we are pointing to BEFORE the first row
		        // rs.next() points to next row and returns true
		        // or false if there is no next row, which breaks the loop
		        for (; r.next(); ) {
		        	str=str+"{";
		            for (i = 0; i < colmax; ++i) {
		            	o = r.getObject(i+1);
		            	
		            	if(o!=null)
		            	{
		            		qm=o instanceof Integer  || o.equals(true)|| o.equals(false)? "":"\""; 
		            	}
		            	else
		            	{
		            		qm="";
		            	}
		            	str=str+"\""+meta.getColumnName(i+1)+"\":"+qm+o+qm;
		                if(i<colmax-1)
		                {
		                	str=str+",";
		                }
		                
		                // with 1 not 0
		                
		            }
		            str=str+"},";
		        }
		        if(!str.endsWith("["))
		        {
		        	str=str.substring(0,str.length()-1);
		        }
		        str=str+"]";
		       response.getWriter().println(str);
		       writeLogMsg(str);
		       writeLogMsg("Response at: "+remoteAddress);
		       c.close();
			}		
				
		
		} catch (Exception e) {
			writeLogMsg("Error: "+e.getMessage());
		}
			
	}
	
	public Object getGraphData(Map<String,String>requestData)
	{
		Integer kpiId = Integer.parseInt(requestData.get("kpiId"));
		Timestamp startTime = null;
		Timestamp endTime = null;
		
		
		TableValueType tableValueType = null;
		
		if ( (requestData.get("contextualInformation")).equals(null) || ((requestData.get("contextualInformation")).equals("")) ){
			tableValueType = TableValueType.NONE;
		}
		else
		{
			tableValueType = TableValueType.valueOf(getParamValueOf(requestData.get("contextualInformation").toUpperCase()));
		}

		SamplingInterval samplingInterval = SamplingInterval.valueOf(getParamValueOf(requestData.get("granularity").toUpperCase()));
		String startTimeStr = requestData.get("startTime");
		String endTimeStr = requestData.get("endTime");
		
		if ( ( startTimeStr != null ) && ( endTimeStr != null))  {
			startTime = new Timestamp(Long.parseLong(requestData.get("startTime")));
			endTime = new Timestamp(Long.parseLong(requestData.get("endTime")));
		}
		
		Integer contextValueId = null;
		String contextValueIdStr = requestData.get("contextValueId");
		if ( contextValueIdStr != null){
			contextValueId = Integer.parseInt(requestData.get("contextValueId"));	
		}
		
		String secondContextStr = requestData.get("secondContext");
		TableValueType secondContext = TableValueType.NONE; 
		if ( secondContextStr != null){
			secondContext = TableValueType.valueOf(getParamValueOf(requestData.get("secondContext").toUpperCase()));	
		}
		
		
		try
		{
			writeLogMsg("--------------- START GRAPH DATA ----------------------");
			JSONParser parser = new JSONParser();
			JSONObject obj = new JSONObject();
			
			Object data = dAO.getData(kpiId, tableValueType, samplingInterval, startTime, endTime, contextValueId, secondContext);
			Object legend = dAO.getLegends();
			Object labels = dAO.getXLabels(samplingInterval);
			Object labelsTimeStamp = dAO.getXLabelsTimeStamp();
			Object title = dAO.getTitle(kpiId);
			
			writeLogMsg("--------------- GRAPH DATA ----------------------------");
			writeLogMsg("Data: "+data.toString());
			writeLogMsg("Labels: "+labels.toString());
			writeLogMsg("Labels Time Stamp: "+labelsTimeStamp.toString());
			writeLogMsg("Title: "+title.toString());
			writeLogMsg("--------------- END GRAPH DATA ------------------------");
			
			obj.put("data", data);
			obj.put("legend", legend);
			obj.put("labels", labels);
			obj.put("labelsTimeStamp", labelsTimeStamp);
			obj.put("title", title);
			obj.put("subTitle", "Source: use case data");
			
			return obj;
		}
		catch(Exception e)
		{
			writeLogMsg(e.getMessage());
			return "";
		}
	}
	
	public Object getRealTimeKpis(Map<String,String> requestData)
	{
		try
		{
			JSONObject obj = new JSONObject();
			
//			dAO.getCurrentDayTotalUnits();
			
			obj.put("oee", 87);
			obj.put("totalUnits", 1834);
			obj.put("scrapRate", 11);
			return obj;
		}
		catch(Exception e)
		{
			writeLogMsg(e.getMessage());
			return new JSONObject();
		}
	}
	private String getParamValueOf(String paramString){
		return paramString.substring(paramString.indexOf("=")+1);
	}
	
	public Object getHeatMapData(Map<String,String> requestData)
	{
		Integer kpiId = Integer.parseInt(requestData.get("kpiId"));
		
		TableValueType tableValueType = TableValueType.NONE;
		if ( (requestData.get("contextualInformation")).equals(null) || ((requestData.get("contextualInformation")).equals("")) ){
			tableValueType = TableValueType.NONE;
		}
		else
		{
			tableValueType = TableValueType.valueOf(getParamValueOf(requestData.get("contextualInformation").toUpperCase()));
		}
		
		Timestamp startTime = null;
		Timestamp endTime = null;
		String startTimeStr = requestData.get("startTime");
		String endTimeStr = requestData.get("endTime");
		
		if ( ( startTimeStr != null ) && ( endTimeStr != null))  {
			writeLogMsg("requestData startTime:"+requestData.get("startTime"));
			startTime = new Timestamp(Long.parseLong(requestData.get("startTime")));
			endTime = new Timestamp(Long.parseLong(requestData.get("endTime")));
			writeLogMsg("after startTime long parse:"+startTime);
		}

		SamplingInterval samplingInterval = SamplingInterval.valueOf(getParamValueOf(requestData.get("granularity").toUpperCase()));

		String contextName = requestData.get("contextName");
		
		TableValueType varX = TableValueType.NONE;
		TableValueType varY = TableValueType.NONE;

		if ( (requestData.get("varX")).equals(null) || (requestData.get("varY")).equals(null) || 
				((requestData.get("varX")).equals("")) || ((requestData.get("varY")).equals("")) ){
			varX = TableValueType.NONE;
			varY = TableValueType.NONE;
		}
		else
		{
			varX = TableValueType.valueOf(getParamValueOf(requestData.get("varX").toUpperCase()));
			varY = TableValueType.valueOf(getParamValueOf(requestData.get("varY").toUpperCase()));
		}

		try
		{
			JSONObject obj = new JSONObject();
			JSONParser parser = new JSONParser();

			writeLogMsg("---------- START HEATMAP DATA -------------------------");
			
			Object data = dAO.getHeatMapData(kpiId, tableValueType, startTime, endTime, samplingInterval, contextName, varX, varY);
			Object yLabels = dAO.getHeatMapYLabels();
			Object xLabels = dAO.getHeatMapXLabels();
			String varXStr = varX.equals(TableValueType.NONE)?"":"per "+varX.toString().toLowerCase();
			String varYStr = varY.equals(TableValueType.NONE)?"":"per "+varY.toString().toLowerCase();
			Object title = dAO.getTitle(kpiId) + " " + varYStr + " " + varXStr + " of " 
						 + contextName + " for " + dAO.getLabelName(samplingInterval, startTime.toString()).toString().toLowerCase();
			writeLogMsg("HeatMap title: "+title);
			
			writeLogMsg("---------- HEATMAP DATA -------------------------------");
			writeLogMsg("Data: "+data.toString());
			writeLogMsg("xLabels: "+xLabels.toString());
			writeLogMsg("yLabels: "+yLabels.toString());
			writeLogMsg("Title: "+title.toString());
			writeLogMsg("---------- END HEATMAP DATA ---------------------------");

			obj.put("data", data);
			obj.put("xLabels", xLabels);
			obj.put("yLabels", yLabels);
			obj.put("title", title);
			return obj;
		}
		catch(Exception e)
		{
			writeLogMsg(e.getMessage());
			return "";
		}
		
	}

	public void insertData(HttpServletResponse response,String dbName,String tableName,Object data,String remoteAddress)
	{
		try {
			String str="";
			String query="";
			Integer insRows = null;
			JSONParser parser = new JSONParser();
			JSONArray parsedData =  (JSONArray)data;
			JSONObject obj=null;
			String insertId="";
			obj=(JSONObject)parsedData.get(0);
			Object[] propertiesVect = obj.keySet().toArray();
			String properties="(";
			for(int i =0;i<propertiesVect.length;i++)
			{
				properties=properties+"\""+propertiesVect[i]+"\",";
			}
			properties=properties.substring(0,properties.length()-1)+")";
			
			query="INSERT INTO \""+tableName+"\" "+properties+" VALUES ";
			for(int i=0;i<parsedData.size();i++)
			{
				obj=(JSONObject)parsedData.get(i);
				query=query+"(";
				for(int j=0;j<propertiesVect.length;j++)
				{
					Object val = obj.get(propertiesVect[j]);
					query=query+(val instanceof String?"'"+val+"'":val);
					if(j<propertiesVect.length-1)
					{
						query=query+",";
					}
					
				}
				query=query+")";
				if(i<parsedData.size()-1)
				{
					query=query+",";
				}
			}
			
			Connection c = DriverManager.getConnection(dbConfig.jdbcURL+dbName, dbConfig.userName, dbConfig.password);
			writeLogMsg("SQL Query: "+query);

			PreparedStatement s =  c.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			insRows = s.executeUpdate();

			insertId="[";
			if(insRows>0)
			{
				ResultSet generatedKeys = s.getGeneratedKeys();	
				while(generatedKeys.next())
				{
					insertId=insertId+generatedKeys.getInt(1)+",";
				}
				insertId=insertId.substring(0,insertId.length()-1);
			}
			insertId=insertId+"]";
			response.getWriter().println("{\"succeeded\":true,\"result\":\""+insRows+" records added\",\"insertId\":"+insertId+"}");
			writeLogMsg("Response at: "+remoteAddress);
			c.close();
		} 
		catch(Exception e)
		{
			try {
				response.getWriter().println("{\"succeeded\":false,\"result\":\""+e.toString().replace("\"", "\\\"")+"\"}");
				writeLogMsg("Response at: "+remoteAddress);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} 

		
	}
	
	public void updateData(HttpServletResponse response,String dbName,String tableName,Object data,String remoteAddress)
	{
		try {
			String str="";
			String query="";
			Integer upRows = null;
			JSONObject obj=(JSONObject)data;
			String idEl=null;
			idEl="id";

			Object id = obj.get(idEl);
			Object[] propertiesVect = obj.keySet().toArray();
			query="UPDATE \""+tableName+"\" SET ";
			
			for(int i=0;i<propertiesVect.length;i++)
			{
				if(propertiesVect[i].equals(idEl))
				{
					continue;
				}
				Object val = obj.get(propertiesVect[i]);
				query=query+"\""+propertiesVect[i]+"\"="+(val instanceof String?"'"+val+"'":val)+",";

				
			}
			query=query.substring(0,query.length()-1)+" WHERE \""+idEl+"\"="+id;
			Connection c = DriverManager.getConnection(dbConfig.jdbcURL+dbName, dbConfig.userName, dbConfig.password);
			Statement s =  c.createStatement();
			writeLogMsg("SQL Query: "+query);

			upRows = s.executeUpdate(query);
			response.getWriter().println("{\"succeeded\":"+(upRows==0?"false":"true")+",\"result\":\""+(upRows==0?"Record not found":"Record updated")+"\"}");
			writeLogMsg("Response at: "+remoteAddress);
			c.close();
		} 
		catch(Exception e)
		{
			try {
				response.getWriter().println("{\"succeeded\":false,\"result\":\""+e.toString().replace("\"", "\\\"")+"\"}");
				writeLogMsg("Response at: "+remoteAddress);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}
	
	public void deleteData(HttpServletResponse response,String dbName,String tableName,Object data,String remoteAddress)
	{
		try {
			Integer delRows =null;
			String query = "DELETE FROM \""+tableName+"\" WHERE ";
			JSONArray parsedData =  (JSONArray)data;
			JSONObject obj=null;
			Connection c = DriverManager.getConnection(dbConfig.jdbcURL+dbName, dbConfig.userName, dbConfig.password);
			Statement s =  c.createStatement();
			for(int i=0;i<parsedData.size();i++)
			{
				obj = (JSONObject)parsedData.get(i);
				
				query = query+"\"id\"="+obj.get("id");

				if(i<parsedData.size()-1)
				{
					query=query+" OR ";
				}
				
			}
			writeLogMsg("SQL Query: "+query);
			delRows = s.executeUpdate(query);
			response.getWriter().println("{\"succeeded\":"+(delRows==0?"false":"true")+",\"result\":\""+delRows+" records deleted\"}");
			writeLogMsg("Response at: "+remoteAddress);
		    c.close();
		} 
		catch(Exception e)
		{
			try {
				response.getWriter().println("{\"succeeded\":false,\"result\":\""+e.toString().replace("\"", "\\\"")+"\"}");
				writeLogMsg("Response at: "+remoteAddress);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}

		
	}
	
    public void handle(String target,  HttpServletRequest baseRequest, HttpServletResponse response) throws IOException, ServletException
	{		
		String method = baseRequest.getMethod();
		String remoteAddress = baseRequest.getHeader("X-Forwarded-for")==null?baseRequest.getRemoteAddr():baseRequest.getHeader("X-Forwarded-for");

		String queryString = baseRequest.getQueryString();

//		String requestParamTP = baseRequest.getParameter("tp");
//		String requestParams6 = baseRequest.getServletPath();
		writeLogMsg(method+" Request from: "+ remoteAddress + " Request target: " + target);
		writeReceivedHeadersToLog(baseRequest);

		String[] parts = target.split("/");
		JSONParser parser = new JSONParser();
		Object obj = null;
		String data ="";
		String line=null;
		Integer idReq = null;

		try
		{
			BufferedReader reader = baseRequest.getReader();
			while((line=reader.readLine())!=null)
			{
				data=data+line;
			}

		}
		catch(Exception e)
		{
			writeLogMsg(e.getMessage());
		}

		response.setContentType("application/json;charset=utf-8");
		response.setStatus(HttpServletResponse.SC_OK);
		//baseRequest.setHandled(true);

		if(parts.length>2)
		{
			if(data!="")
			{
				writeLogMsg("Payload: "+data);
			}
			if(parts.length>3)
			{
				try
				{
					idReq = Integer.parseInt(parts[3]);
					writeLogMsg("Id requested: "+idReq);
				}
				catch(NumberFormatException e)
				{
					writeLogMsg(e.getMessage());
				}
			}
			
			String dbName=parts[1];
			String tableName = parts[2];
			JSONObject tmpObj = null;
			JSONArray tmpArr = null;
			
			if(method=="GET")
			{
				getData(response,dbName,tableName,idReq,remoteAddress, queryString);
			}
			else
			{
				try {
					obj = parser.parse(data);
					if(method=="POST")
					{
						tmpObj = (JSONObject)obj;
						Object type = tmpObj.get("type");
						Object reqData = tmpObj.get("data");
						
						if(type!=null )
						{
							if(type.equals("GET"))
							{
								getData(response,dbName,tableName,idReq,remoteAddress, queryString);
							}
							else if(type.equals("INSERT") && reqData!=null)
							{
								insertData(response,dbName,tableName,reqData,remoteAddress);
							}
							else if(type.equals("UPDATE") && reqData!=null)
							{
								updateData(response,dbName,tableName,reqData,remoteAddress);
							}
							else if(type.equals("DELETE") && reqData!=null)
							{
								deleteData(response,dbName,tableName,reqData,remoteAddress);
							}
						}
						
					}
					else if(method.equals("PUT"))
					{
						insertData(response,dbName,tableName,obj,remoteAddress);
					}
					else if(method.equals("PATCH"))
					{
						updateData(response,dbName,tableName,obj,remoteAddress);
					}
					else if(method.equals("DELETE"))
					{
						deleteData(response,dbName,tableName,obj,remoteAddress);
					}							
				} catch (Exception e) {
					response.getWriter().println("{\"succeeded\":false,\"result\":\""+e.toString().replace("\"", "\\\"")+"\"}");
					writeLogMsg("Response at: "+remoteAddress);
				}
			}

		}						
	}

	private void writeReceivedHeadersToLog(HttpServletRequest baseRequest) {
		Enumeration<String> headers = baseRequest.getHeaderNames();
		while (headers.hasMoreElements()) 
		{
			String header = headers.nextElement();
			String headerContent = baseRequest.getHeader(header);
			writeLogMsg("Header: "+ header + " " + headerContent);
		}
	}
    
    private static void writeLogMsg(String msg)
    {
		System.out.println(msg);
		_log.saveToFile(msg);
    }
    
    public void Test(){
    	this.insertData(null, "proasense_hella", "kpi", null, null);
    }
    
	  @Override
	  public void doGet(HttpServletRequest request,
	                    HttpServletResponse response)
	      throws ServletException, IOException {
		writeLogMsg("------------------ doGet ---------------");
		writeReceivedHeadersToLog(request);
		writeLogMsg("------------- end of doGet -------------");
		
	    handle(request.getPathInfo(),request,response);
	
	  }
	  
	  @Override
	  public void doPost(HttpServletRequest request,
	                    HttpServletResponse response)
	      throws ServletException, IOException {

		writeLogMsg("------------------ doPost ---------------");
		writeReceivedHeadersToLog(request);
		writeLogMsg("------------- end of doPost -------------");


	    handle(request.getPathInfo(),request,response);
	  }
	
	  public void init()
	  {
		  ServletContext context = getServletContext();
		  logPath =  context.getRealPath("WEB-INF")+"/";
		  dbPath = context.getRealPath("WEB-INF/db/");
		  dbConfig = new DBConfig("jdbc:hsqldb:file:"+dbPath, "", "SA", "");
		  dAO = new DatabaseAccessObject(dbPath,logPath);
		  _log = LoggingSystem.getLog(logPath);
		  System.out.println("LogSystem configured in: "+logPath);
	  }
}
