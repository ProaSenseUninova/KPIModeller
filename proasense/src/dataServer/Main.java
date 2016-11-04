package dataServer;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;

import java.awt.geom.RoundRectangle2D;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import org.apache.commons.lang.SystemUtils;

import dataServer.database.DBConfig;
import dataServer.database.enums.SamplingInterval;
import dataServer.database.enums.TableValueType;
import dataServer.utils.myPoint;
import dataServer.poninomialPrediction.ProasensePredictivePolynomial;
import dataServer.utils.RegressionResult;
import dataServer.utils.RegressionResults;
import dataServer.utils.myDataset;
import dataServer.utils.myDatasets;

@WebServlet("/data/*")
public class Main extends HttpServlet {
	
	static LoggingSystem _log;
	String logPath;
	String dbPath;
	DBConfig dbConfig;
	DatabaseAccessObject dAO;
	
	StorageRESTClientManager SRCM;
	
	// ################################################ variavel para
	// utilizar storage ou valores de teste
	// ###################################
	boolean testing = true;
	// #################################################################################################################################################

				

	public static Map<String, String> splitQuery(String query) throws UnsupportedEncodingException {
	    Map<String, String> query_pairs = new LinkedHashMap<String, String>();
	    String[] pairs = query.split("&");
	    for (String pair : pairs) {
	        int idx = pair.indexOf("=");
	        query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
	    }
	    return query_pairs;
	}
	
	public void getData(HttpServletResponse response,String dbName,String tableName,String idReq,String remoteAddress, String queryString)
	{
		try {
			
			DriverManager.registerDriver(new org.hsqldb.jdbcDriver());
			Map<String, String> queryParams = new LinkedHashMap<String, String>();

			if (queryString != null) {
				queryParams = splitQuery(queryString);
				writeLogMsg("<request>" + queryString + "</request>");
			}
			if (dbName.equals("func")) {
				//String x = tableName.substring(0, 12);
				if (tableName.contains("getGraphData")) {
					response.getWriter().println(getGraphData(queryParams));
				} else if (tableName.contains("getHeatMapData")) {
					response.getWriter().println(getHeatMapData(queryParams));
				} else if (tableName.contains("getRealTimeKpis")) {
					response.getWriter().println(getRealTimeKpis(queryParams));
				}
			} else {

				String responseStr;

				switch (tableName) {
				case "sensor": // sensor
					
					// string de teste
					if (testing)
						responseStr = "[{\"id\":\"sensor_1_id\",\"name\":\"sensor 1\"},{\"id\":\"sensor_2_id\",\"name\":\"sensor 2\"}]";
					else
						responseStr = this.getSensorIdsNameList(idReq);

					writeLogMsg(tableName + ":" + responseStr);
					response.getWriter().println(responseStr); // sending the
																// result
					break;

				case "sensorProperties": // sensorEvents
					
					String reqId = idReq.substring(0,idReq.indexOf('_'));
					String context = idReq.substring(idReq.indexOf('_')+1);
					
					//System.out.println("Contexto : "+context);
					
					// string de teste
					if (testing)
						responseStr = "[{\"name\":\"event 1\",\"type\":\"boolean\",\"partition\":\"true\"},{\"name\":\"event 2\",\"type\":\"string\",\"partition\":\"false\"},{\"name\":\"event 3\",\"type\":\"double\",\"partition\":\"true\"},{\"name\":\"event 4\",\"type\":\"long\",\"partition\":\"true\"}]";
					else
						responseStr = this.getSensorPropertiesList(reqId,context);

					writeLogMsg(tableName + ":" + responseStr);
					response.getWriter().println(responseStr); // sending the
																// result
					break;

				case "partitionType": // sensorEvents

					// string de teste
					if (testing)
						responseStr = "[{\"id\":\"partition_1\"},{\"id\":\"partition_2\"},{\"id\":\"partition_3\"},{\"id\":\"partition_4\"}]";
					else
						switch (idReq) {
						case "machine":
							responseStr = getAllMachineIds();
							break;
						case "product":
							responseStr = getAllProductsIds();
							break;
						case "mould":
							responseStr = getAllMouldsIds();
							break;
						case "shift":
							responseStr = getAllShiftsIds();
							break;
						default:
							responseStr = "[]";
							break;
						}

					writeLogMsg(tableName + ":" + responseStr);
					response.getWriter().println(responseStr); // sending the
																// result
					break;

				default:
					
					//getting info from de DB
					
					Connection c = DriverManager.getConnection(dbConfig.jdbcURL + dbName, dbConfig.userName, dbConfig.password);
					Statement s = c.createStatement();
					// String query = "SELECT * FROM \""+tableName+"\"";
					String query = "SELECT * FROM \"" + tableName.toUpperCase() + "\"";

					if (tableName.toUpperCase().equals("KPI")) {
						// query += " WHERE \"active\" = true ";
						query += " WHERE \"ACTIVE\" = true ";
						if (idReq != null && idReq.trim().equals("")) {
							writeLogMsg(tableName);
							// query+= " AND \"id\"="+idReq;
							query += " AND \"ID\"=" + idReq;
						}
					} else {
						if (idReq != null && idReq.trim().equals("")) {
							writeLogMsg(tableName);
							// query+= " WHERE \"id\"="+idReq;
							query += " WHERE \"ID\"=" + idReq;
						}
					}

					writeLogMsg("SQL Query: " + query);

					ResultSet r = s.executeQuery(query);
					// are implementation dependent unless you use the SQL ORDER
					// statement
					ResultSetMetaData meta;

					String qm = null;
					meta = r.getMetaData();
					String str = "[";
					int colmax = meta.getColumnCount();
					int i;
					Object o = null;
					// the result set is a cursor into the data. You can only
					// point to one row at a timeop
					// assume we are pointing to BEFORE the first row
					// rs.next() points to next row and returns true
					// or false if there is no next row, which breaks the loop
					for (; r.next();) {
						str = str + "{";
						for (i = 0; i < colmax; ++i) {
							o = r.getObject(i + 1);

							if (o != null) {
								qm = o instanceof Integer || o.equals(true) || o.equals(false) ? "" : "\"";
							} else {
								qm = "";
							}
							str = str + "\"" + meta.getColumnName(i + 1).toLowerCase() + "\":" + qm + o + qm;
							if (i < colmax - 1) {
								str = str + ",";
							}

							// with 1 not 0

						}
						str = str + "},";
					}
					if (!str.endsWith("[")) {
						str = str.substring(0, str.length() - 1);
					}
					str = str + "]";
					response.getWriter().println(str);
					writeLogMsg(tableName + ":" + str);
					writeLogMsg("Response at: " + remoteAddress);
					c.close();
					
				}
			}

		} catch (Exception e) {
			writeLogMsg("Error: " + e.getMessage());
		}
	}

	private String getSensorIdsNameList(String context) {

		try {
		String result = this.SRCM.getAllSensors(context);
		JSONParser parser = new JSONParser();
		JSONObject sensors = (JSONObject) parser.parse(result);
		
		JSONArray sensorList = (JSONArray) sensors.get("sensor");

			return sensorList.toJSONString();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "";
		
	}

	private String getSensorPropertiesList(String sensorId, String context) {

		String responseStr;
		responseStr = "[";

		try {

			String result = this.SRCM.getSensorProprerties(sensorId, context);
			JSONParser parser = new JSONParser();
			JSONObject properties;
			properties = (JSONObject) parser.parse(result);

			JSONArray events = (JSONArray) properties.get("eventProperties");

			if (events.equals("") || events == null || events.isEmpty()) {
				responseStr = responseStr.concat("]");
				writeLogMsg("\t\t\t\t\t\t Pedido de propriedades de Sensor: sem propriedades!!!!!!");
			} else {
				JSONObject jAux;

				for (Object event : events) {
					jAux = (JSONObject) ((JSONObject) event).get("eventProperty");

					responseStr = responseStr.concat("{\"name\":\"" + jAux.get("name") + "\",\"type\":\""
							+ jAux.get("type") + "\",\"partition\":\"" + jAux.get("partition") + "\"},");
				}

				responseStr = responseStr.substring(0, responseStr.length() - 1).concat("]");
			}
		} catch (ParseException e) {
			writeLogMsg("Error: " + e.getMessage());
		}

		if (responseStr.length() == 1)
			responseStr = responseStr.concat("]");

		return responseStr;
	}

	private String getAllMachineIds() {

		String responseStr;
		responseStr = "[";

		try {
			String result = this.SRCM.getAllMachines();
			JSONParser parser = new JSONParser();
			JSONObject machines = (JSONObject) parser.parse(result);

			JSONArray machineList = (JSONArray) machines.get("machine");

			if (machineList.equals("") || machineList == null || machineList.isEmpty()) {
				responseStr = responseStr.concat("]");
				writeLogMsg("\t\t\t\t\t\t Pedido de ids de maquina: sem ids!!!!!!");
			} else {

				for (Object machine : machineList) {

					responseStr = responseStr.concat("{\"id\":\"" + machine.toString() + "\"},");
				}

				responseStr = responseStr.substring(0, responseStr.length() - 1).concat("]");

			}
		} catch (ParseException e) {
			writeLogMsg("Error: " + e.getMessage());
		}

		if (responseStr.length() == 1)
			responseStr = responseStr.concat("]");

		return responseStr;
	}

	private String getAllProductsIds() {

		String responseStr;
		responseStr = "[";

		try {
			String result = this.SRCM.getAllProducts();
			JSONParser parser = new JSONParser();
			JSONObject products = (JSONObject) parser.parse(result);

			JSONArray productsList = (JSONArray) products.get("product");

			if (productsList.equals("") || productsList == null || productsList.isEmpty()) {
				responseStr = responseStr.concat("]");
				writeLogMsg("\t\t\t\t\t\t Pedido de ids de maquina: sem ids!!!!!!");
			} else {

				for (Object product : productsList) {

					responseStr = responseStr.concat("{\"id\":\"" + product.toString() + "\"},");
				}

				responseStr = responseStr.substring(0, responseStr.length() - 1).concat("]");

			}
		} catch (ParseException e) {
			writeLogMsg("Error: " + e.getMessage());
		}

		if (responseStr.length() == 1)
			responseStr = responseStr.concat("]");

		return responseStr;
	}

	private String getAllMouldsIds() {

		String responseStr;
		responseStr = "[";

		try {
			String result = this.SRCM.getAllMoulds();
			JSONParser parser = new JSONParser();
			JSONObject moulds = (JSONObject) parser.parse(result);

			JSONArray mouldsList = (JSONArray) moulds.get("mould");

			if (mouldsList.equals("") || mouldsList == null || mouldsList.isEmpty()) {
				responseStr = responseStr.concat("]");
				writeLogMsg("\t\t\t\t\t\t Pedido de ids de maquina: sem ids!!!!!!");
			} else {

				for (Object mould : mouldsList) {

					responseStr = responseStr.concat("{\"id\":\"" + mould.toString() + "\"},");
				}

				responseStr = responseStr.substring(0, responseStr.length() - 1).concat("]");

			}
		} catch (ParseException e) {
			writeLogMsg("Error: " + e.getMessage());
		}

		if (responseStr.length() == 1)
			responseStr = responseStr.concat("]");

		return responseStr;
	}
	
	//############################################################### not supported
	private String getAllShiftsIds() {

		String responseStr;
		responseStr = "[";

		try {
			String result = null; //this.SRCM.getAllMoulds();
			JSONParser parser = new JSONParser();
			JSONObject moulds = (JSONObject) parser.parse(result);

			JSONArray mouldsList = (JSONArray) moulds.get("mould");

			if (mouldsList.equals("") || mouldsList == null || mouldsList.isEmpty()) {
				responseStr = responseStr.concat("]");
				writeLogMsg("\t\t\t\t\t\t Pedido de ids de maquina: sem ids!!!!!!");
			} else {

				for (Object mould : mouldsList) {

					responseStr = responseStr.concat("{\"id\":\"" + mould.toString() + "\"},");
				}

				responseStr = responseStr.substring(0, responseStr.length() - 1).concat("]");

			}
		} catch (ParseException e) {
			writeLogMsg("Error: " + e.getMessage());
		}

		if (responseStr.length() == 1)
			responseStr = responseStr.concat("]");

		return responseStr;
	}

	public Object getGraphData(Map<String, String> requestData) {
		Integer kpiId = Integer.parseInt(requestData.get("kpiId"));
		Timestamp startTime = null;
		Timestamp endTime = null;

		TableValueType tableValueType = null;

		if ((requestData.get("contextualInformation")).equals(null)
				|| ((requestData.get("contextualInformation")).equals(""))) {
			tableValueType = TableValueType.NONE;
		} else {
			tableValueType = TableValueType
					.valueOf(getParamValueOf(requestData.get("contextualInformation").toUpperCase()));
		}

		SamplingInterval samplingInterval = SamplingInterval.valueOf(getParamValueOf(requestData.get("granularity").toUpperCase()));
		String startTimeStr = requestData.get("startTime");
		String endTimeStr = requestData.get("endTime");

		if ((startTimeStr != null) && (endTimeStr != null)) {
			startTime = new Timestamp(Long.parseLong(requestData.get("startTime")));
			endTime = new Timestamp(Long.parseLong(requestData.get("endTime")));
		}

		Integer contextValueId = null;
		String contextValueIdStr = requestData.get("contextValueId");
		if (contextValueIdStr != null) {
			contextValueId = Integer.parseInt(requestData.get("contextValueId"));
		}

		String secondContextStr = requestData.get("secondContext");
		TableValueType secondContext = TableValueType.NONE; 
		if ( secondContextStr != null){
			secondContext = TableValueType.valueOf(getParamValueOf(requestData.get("secondContext").toUpperCase()));	
		}
		
		String includeGlobalStr = requestData.get("includeGlobal");
		
		boolean includeGlobal = true;
		if ( includeGlobalStr != null){
			includeGlobal = includeGlobalStr.equals("true") ? true : false; 
		}
		
		try {
			writeLogMsg("Requesting <" + samplingInterval.toString().toLowerCase() + "> data from <"
					+ startTime.toString() + "> to <" + endTime.toString() + "> for <KPI = " + kpiId + ">.");
			writeLogMsg("--------------- START GRAPH DATA ----------------------");
			JSONParser parser = new JSONParser();
			JSONObject obj = new JSONObject();

			// writeLogMsg("--------------- START GRAPH DATA --- data method
			// start -------------------");
			Object data = dAO.getData(kpiId, tableValueType, samplingInterval, startTime, endTime, contextValueId,
					secondContext, includeGlobal);
			// writeLogMsg("--------------- START GRAPH DATA --- data method
			// over -------------------");
			Object legend = dAO.getLegends();
			Object labels = dAO.getXLabels(samplingInterval);
			Object labelsTimeStamp = dAO.getXLabelsTimeStamp();
			Object title = dAO.getTitle(kpiId);
			
			//create prediction object
			JSONArray pred = new JSONArray();
			String predEnable = requestData.get("withPrediction");
			
			if(predEnable.equals("true")){
				
				//calculation of forecasts
				JSONArray kValues = (JSONArray)data;
				JSONArray timestamps = (JSONArray)labelsTimeStamp;
				int nrOfLines = kValues.size();
				int nrOfValues = timestamps.size();
				int granularity = Integer.parseInt((requestData.get("granularityID")).toString());
				
						
				myDataset[] datasets = new myDataset[nrOfLines];
				
				int numb;
				
				for(int j=0; j< nrOfLines;j++)
				{	
					numb = 0;
					for( int ind = 0; ind < nrOfValues; ind++ )
						if(((JSONArray)kValues.get(j)).get(ind) != null)
							numb++;
					
					//if(numb>0)
					
					myPoint[] points = new myPoint[numb];	
					
					for(int i=0, pointInd=0; i<nrOfValues;i++){
						//problema em calular aqui!! prende no null
						if(((JSONArray)kValues.get(j)).get(i) != null){
							points[pointInd] = new myPoint(Double.parseDouble(timestamps.get(i).toString()),Double.parseDouble(((JSONArray)kValues.get(j)).get(i).toString()));
							pointInd++;
						}
					}
					datasets[j]= new myDataset(points);
				}
				
				myDatasets mydatasets = new myDatasets( granularity, nrOfValues, datasets);
	
				ProasensePredictivePolynomial algorithm = new ProasensePredictivePolynomial();
				RegressionResults results = algorithm.generatePrediction(mydatasets);
	
				int maxLength=0, maxIndex=0;
				int graphLength=nrOfValues;
				List<RegressionResult> RRs = results.getRegressionResults();
				int numberOfRegressions = RRs.size();
				
				ArrayList<Double> predLine = new ArrayList<Double>();
				
				double[] stamps;
				double[] values;	
				Double sAux;
				
				for(int ind = 0, len = 0 ; ind < numberOfRegressions ; ind ++){
					len = RRs.get(ind).getPredictions().length; 
					if(len > maxLength){
						maxLength=len;
						maxIndex = ind;
					}
				}
				
				//new length of the graph
				graphLength+=maxLength;
	
				//put the result in the correct format to the chart
				for(int ind = 0 ; ind < numberOfRegressions ; ind ++){
					stamps = RRs.get(ind).getIndependentVariables();
					values = RRs.get(ind).getPredictions();
					
					//get new values to the correct position
					for(int j = 0; j<graphLength ; j++ ){
						if(j < nrOfValues){
							predLine.add(null);//predLine.add(new JSONObject());
						}else{
							predLine.add(values[j-nrOfValues]);//predLine.add(String.valueOf(values[j-nrOfValues]));
						}
					}
					
					//get 2 last known values
					for(int last = nrOfValues-1; last >= 0; last --){
						sAux = (Double)((JSONArray)kValues.get(ind)).get(last);
						System.out.println("valor : "+sAux);
						if( sAux != null){
							
							predLine.set(last, sAux);
							break;
						}
					}
					pred.add((Object)predLine.clone());
					predLine.clear();
				}
				
				String newTimeStamp;
				
				for(int ind=0; ind < maxLength; ind++){
					//set new timestamps
					newTimeStamp = String.format("%.0f",(RRs.get(maxIndex).getIndependentVariables())[ind]);
					((ArrayList)labelsTimeStamp).add(newTimeStamp);
					
					//set new labels
					Date dValue = new Date(Long.parseLong(newTimeStamp));
					((ArrayList)labels).add(dAO.getLabelName(samplingInterval,new SimpleDateFormat("YYYY-MM-dd hh:mm:ss").format(dValue),false));
				
					//cover new positions
					for(int i = 0; i < nrOfLines; i++ ){
						((ArrayList)((ArrayList)data).get(i)).add(null);
					}
				}
			}
			
			writeLogMsg("--------------- GRAPH DATA ----------------------------");
			writeLogMsg("Data: " + data.toString());
			writeLogMsg("Pred: " +pred.toString());
			writeLogMsg("Labels: " + labels.toString());
			writeLogMsg("Labels Time Stamp: " + labelsTimeStamp.toString());
			writeLogMsg("Title: " + title.toString());
			writeLogMsg("--------------- END GRAPH DATA ------------------------");

			obj.put("data", data);
			obj.put("predictions", pred);
			obj.put("legend", legend);
			obj.put("labels", labels);
			obj.put("labelsTimeStamp", labelsTimeStamp);
			obj.put("title", title);
			obj.put("subTitle", "Source: use case data");

			return obj;
		} catch (Exception e) {
			writeLogMsg(e.getMessage());
			return "";
		}
	}

	public Object getRealTimeKpis(Map<String, String> requestData) {
		try {
			JSONObject obj = new JSONObject();

			// dAO.getCurrentDayTotalUnits();

			obj.put("oee", 87);
			obj.put("totalUnits", 1834);
			obj.put("scrapRate", 11);
			return obj;
		} catch (Exception e) {
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

		SamplingInterval samplingInterval = SamplingInterval.valueOf(getParamValueOf(requestData.get("granularity").toUpperCase()));
		
		if ( ( startTimeStr != null ) && ( endTimeStr != null))  {
			writeLogMsg("requestData startTime:"+requestData.get("startTime"));
			startTime = new Timestamp(Long.parseLong(requestData.get("startTime")));
			endTime = new Timestamp(Long.parseLong(requestData.get("endTime")));
			writeLogMsg("after startTime long parse:"+startTime);
			if (samplingInterval == SamplingInterval.MONTHLY) {
				java.util.Date monthlyDate;
			}
			
		}

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
						 + contextName + " from " + dAO.getLabelName(SamplingInterval.HOURLY, startTime.toString(), true).toString().toLowerCase()
						 + " to " + dAO.getLabelName(SamplingInterval.HOURLY, endTime.toString(), true).toString().toLowerCase();
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

	//insert data in the DB
	public void insertData(HttpServletResponse response, String dbName, String tableName, Object data,
			String remoteAddress) {
		
		
		try {
			String str = "";
			String query = "";
			Integer insRows = null;
			JSONParser parser = new JSONParser();
			JSONArray parsedData = (JSONArray) data;
			JSONObject obj = null;
			String insertId = "";
			obj = (JSONObject) parsedData.get(0);
			Object[] propertiesVect = obj.keySet().toArray();
			String properties = "(";
			for (int i = 0; i < propertiesVect.length; i++) {
				properties = properties + "\"" + propertiesVect[i] + "\",";
			}
			properties = properties.substring(0, properties.length() - 1) + ")";

			// query="INSERT INTO \""+tableName+"\" "+properties+" VALUES ";
			query = "INSERT INTO \"" + tableName.toUpperCase() + "\" " + properties.toUpperCase() + " VALUES ";
			for (int i = 0; i < parsedData.size(); i++) {
				obj = (JSONObject) parsedData.get(i);
				query = query + "(";
				for (int j = 0; j < propertiesVect.length; j++) {
					Object val = obj.get(propertiesVect[j]);
					query = query + (val instanceof String ? "'" + val + "'" : val);
					if (j < propertiesVect.length - 1) {
						query = query + ",";
					}

				}
				query = query + ")";
				if (i < parsedData.size() - 1) {
					query = query + ",";
				}
			}

			int first = query.indexOf("''");
			if (first > 0) {
				int second = query.substring(first + 2).indexOf("''");
				if (second == -1)
					query = query.replace("''", "null");
			}

			Connection c = DriverManager.getConnection(dbConfig.jdbcURL + dbName, dbConfig.userName, dbConfig.password);
			writeLogMsg("SQL Query: " + query);

			PreparedStatement s = c.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
			insRows = s.executeUpdate();

			insertId = "[";
			if (insRows > 0) {
				ResultSet generatedKeys = s.getGeneratedKeys();
				while (generatedKeys.next()) {
					insertId = insertId + generatedKeys.getInt(1) + ",";
				}
				insertId = insertId.substring(0, insertId.length() - 1);
			}
			insertId = insertId + "]";
			response.getWriter().println(
					"{\"succeeded\":true,\"result\":\"" + insRows + " records added\",\"insertId\":" + insertId + "}");
			writeLogMsg("Response at: " + remoteAddress);
			c.close();
		} catch (Exception e) {
			try {
				response.getWriter()
						.println("{\"succeeded\":false,\"result\":\"" + e.toString().replace("\"", "\\\"") + "\"}");
				writeLogMsg("Response at: " + remoteAddress);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}

	//update data in de DB
	public void updateData(HttpServletResponse response, String dbName, String tableName, Object data,
			String remoteAddress) {
		
		try {
			String str = "";
			String query = "";
			Integer upRows = null;
			JSONObject obj = (JSONObject) data;
			String idEl = null;
			idEl = "id";

			Object id = obj.get(idEl);
			Object[] propertiesVect = obj.keySet().toArray();
			// query="UPDATE \""+tableName+"\" SET ";
			query = "UPDATE \"" + tableName.toUpperCase() + "\" SET ";

			for (int i = 0; i < propertiesVect.length; i++) {
				if (propertiesVect[i].equals(idEl)) {
					continue;
				}
				Object val = obj.get(propertiesVect[i]);
				query = query + "\"" + propertiesVect[i].toString().toUpperCase() + "\"=" + (val instanceof String ? "'" + val + "'" : val)
						+ ",";

			}
			query = query.substring(0, query.length() - 1) + " WHERE \"" + idEl.toString().toUpperCase() + "\"=" + id;
			Connection c = DriverManager.getConnection(dbConfig.jdbcURL + dbName, dbConfig.userName, dbConfig.password);
			Statement s = c.createStatement();
			writeLogMsg("SQL Query: " + query);

			upRows = s.executeUpdate(query);
			response.getWriter().println("{\"succeeded\":" + (upRows == 0 ? "false" : "true") + ",\"result\":\""
					+ (upRows == 0 ? "Record not found" : "Record updated") + "\"}");
			writeLogMsg("Response at: " + remoteAddress);
			c.close();
		} catch (Exception e) {
			try {
				response.getWriter()
						.println("{\"succeeded\":false,\"result\":\"" + e.toString().replace("\"", "\\\"") + "\"}");
				writeLogMsg("Response at: " + remoteAddress);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}

	//delete data from de DB
	public void deleteData(HttpServletResponse response, String dbName, String tableName, Object data,
			String remoteAddress) {
		
		try {
			Integer delRows = null;
			// String query = "DELETE FROM \""+tableName+"\" WHERE ";
			String query = "DELETE FROM \"" + tableName.toUpperCase() + "\" WHERE ";
			JSONArray parsedData = (JSONArray) data;
			JSONObject obj = null;
			Connection c = DriverManager.getConnection(dbConfig.jdbcURL + dbName, dbConfig.userName, dbConfig.password);
			Statement s = c.createStatement();
			for (int i = 0; i < parsedData.size(); i++) {
				obj = (JSONObject) parsedData.get(i);

				query = query + "\"ID\"=" + obj.get("id");
				// query = query+"\"id\"="+obj.get("id");

				if (i < parsedData.size() - 1) {
					query = query + " OR ";
				}

			}
			writeLogMsg("SQL Query: " + query);			
			delRows = s.executeUpdate(query);			
			response.getWriter().println("{\"succeeded\":" + (delRows == 0 ? "false" : "true") + ",\"result\":\""
					+ delRows + " records deleted\"}");
			writeLogMsg("Response at: " + remoteAddress);
			c.close();
		} catch (Exception e) {
			try {
				response.getWriter()
						.println("{\"succeeded\":false,\"result\":\"" + e.toString().replace("\"", "\\\"") + "\"}");
				writeLogMsg("Response at: " + remoteAddress);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}

	public void informData(HttpServletResponse response, String dbName, String informType,Object data,
			String remoteAddress) {
		try {
			
			JSONArray parsedData = (JSONArray) data;
			JSONObject obj = (JSONObject) parsedData.get(0);
			String kpiJSON;
			
			boolean result = false;
			
			switch(informType){
			case "delete":
				if(testing){
					System.out.println("\n\n################################################################################\n");
					System.out.println("Envia inform do tipo delete com :");
					System.out.println(obj.get("id").toString());
					System.out.println("\n################################################################################\n\n");
					
					result = true;
				}else
					result = SRCM.deleteKPIStorage(obj.get("id").toString());
				
				break;
			case "insert":
				
				kpiJSON = convertKPIObjectToJSON(obj);
				
				if(testing){
					System.out.println("\n\n################################################################################\n");
					System.out.println("Envia inform do tipo add com :");
					System.out.println(kpiJSON);
					System.out.println("\n################################################################################\n\n");
					
					result = true;
				}else
					result = SRCM.insertKPIStorage(kpiJSON);
				
				break;
			case "update":
					
				kpiJSON = convertKPIObjectToJSON(obj);
				
				if(testing){
					System.out.println("\n\n################################################################################\n");
					System.out.println("Envia inform do tipo update com :");
					System.out.println(kpiJSON);
					System.out.println("\n################################################################################\n\n");
					result = true;
				}else{
					
					if(SRCM.deleteKPIStorage(obj.get("id").toString())){
						result = SRCM.insertKPIStorage(kpiJSON);
						break;
					}
					result = false;
				
					break;
				}
					
			default:
				result = true;
				break;
				
			}
			
			response.getWriter().println("{\"succeeded\":"+result+"}");
						
		} catch (Exception e) {
			try {
				response.getWriter()
						.println("{\"succeeded\":false,\"result\":\"" + e.toString().replace("\"", "\\\"") + "\"}");
				writeLogMsg("Response at: " + remoteAddress);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}

	}

	@SuppressWarnings("unchecked")
	private String convertKPIObjectToJSON(JSONObject obj){
		
		// parsing the information to integrate with storage
		JSONObject storageModelObject = new JSONObject();
		JSONObject operation = new JSONObject();
		JSONObject properties = new JSONObject();
		JSONObject window = new JSONObject();
				
		switch(obj.get("calculation_type").toString()){
			case "simple":
									
				window.put("windowType", "TIME");
				window.put("value", obj.get("sampling_rate"));
				window.put("timeUnit", obj.get("sampling_interval"));
				
				properties.put("unaryOperationType", obj.get("aggregationName"));
				properties.put("sensorId", obj.get("sensorid"));
				properties.put("eventPropertyName", obj.get("eventname"));
				properties.put("propertyRestriction", obj.get("partitionid"));
				properties.put("propertyType", obj.get("eventtype"));
				properties.put("partition", obj.get("eventpartition"));
				properties.put("operationType",  obj.get("number_support"));
				properties.put("window", window);
				
				operation.put("type", "de.fzi.cep.sepa.kpi.UnaryOperation");
				operation.put("properties", properties);
				
				storageModelObject.put("kpiId", obj.get("id"));
				storageModelObject.put("kpiName", obj.get("name"));
				storageModelObject.put("context", obj.get("company_context"));
				storageModelObject.put("kpiDescription", obj.get("description"));
				storageModelObject.put("kpiOperation", "ADD");
				storageModelObject.put("operation", operation);
									
				break;
			case "aggregate":
				
				window.put("windowType", "TIME");
				window.put("value", obj.get("sampling_rate"));
				window.put("timeUnit", obj.get("sampling_interval"));
				
				properties.put("unaryOperationType", obj.get("aggregationName"));
				properties.put("sensorId", obj.get("sensorid"));
				properties.put("eventPropertyName", obj.get("eventname"));
				properties.put("propertyRestriction", obj.get("partitionid"));
				properties.put("propertyType", obj.get("eventtype"));
				properties.put("partition", obj.get("eventpartition"));
				properties.put("operationType",  obj.get("number_support"));
				properties.put("window", window);
				
				operation.put("type", "de.fzi.cep.sepa.kpi.UnaryOperation");
				operation.put("properties", properties);
				
				storageModelObject.put("kpiId", obj.get("id"));
				storageModelObject.put("kpiName", obj.get("name"));
				storageModelObject.put("context", obj.get("company_context"));
				storageModelObject.put("kpiDescription", obj.get("description"));
				storageModelObject.put("kpiOperation", "ADD");
				storageModelObject.put("operation", operation);
				
				break;
			case "composed":
										
				JSONObject leftOp = new JSONObject();
				JSONObject leftOpP = new JSONObject();
				JSONObject rightOp = new JSONObject();
				JSONObject rightOpP = new JSONObject();
				
				window.put("windowType", "TIME");
				window.put("value", obj.get("sampling_rate"));
				window.put("timeUnit", obj.get("sampling_interval"));
				
				//operation with 2 operators
				if(obj.get("operator2") != null && obj.get("operator2") != "none" ){
				
				}
				else{
					leftOpP.put("unaryOperationType", obj.get("aggregationName"));
					leftOpP.put("sensorId", obj.get("sensorid1"));
					leftOpP.put("eventPropertyName", obj.get("eventname1"));
					leftOpP.put("propertyRestriction", obj.get("partitionid1"));
					leftOpP.put("propertyType", obj.get("eventtype1"));
					leftOpP.put("partition", obj.get("eventpartition1"));
					leftOpP.put("window", window);
					
					leftOp.put("type", "de.fzi.cep.sepa.kpi.UnaryOperation");
					leftOp.put("properties", leftOpP);
					
					rightOpP.put("unaryOperationType", obj.get("aggregationName"));
					rightOpP.put("sensorId", obj.get("sensorid2"));
					rightOpP.put("eventPropertyName", obj.get("eventname2"));
					rightOpP.put("propertyRestriction", obj.get("partitionid2"));
					rightOpP.put("propertyType", obj.get("eventtype2"));
					rightOpP.put("partition", obj.get("eventpartition2"));
					rightOpP.put("window", window);
					
					rightOp.put("type", "de.fzi.cep.sepa.kpi.UnaryOperation");
					rightOp.put("properties", rightOpP);
					
					properties.put("left", leftOp);
					properties.put("right", rightOp);
					properties.put("arithmeticOperationType", obj.get("operator1"));
					properties.put("operationType", obj.get("number_support"));
					
					operation.put("type", "de.fzi.cep.sepa.kpi.BinaryOperation");
					operation.put("properties", properties);
					
					storageModelObject.put("kpiId", obj.get("id"));
					storageModelObject.put("kpiName", obj.get("name"));
					storageModelObject.put("context", obj.get("company_context"));
					storageModelObject.put("kpiDescription", obj.get("description"));
					storageModelObject.put("kpiOperation", "ADD");
					storageModelObject.put("operation", operation);
				}
				
				break;
			default:
				
				
				break;
		}
		
		return (storageModelObject.toJSONString());
	}
	
	
	public void handle(String target, HttpServletRequest baseRequest, HttpServletResponse response)
			throws IOException, ServletException {
		
		String method = baseRequest.getMethod();
		String remoteAddress = baseRequest.getHeader("X-Forwarded-for") == null ? baseRequest.getRemoteAddr()
				: baseRequest.getHeader("X-Forwarded-for");

		String queryString = baseRequest.getQueryString();

		// String requestParamTP = baseRequest.getParameter("tp");
		// String requestParams6 = baseRequest.getServletPath();
		writeLogMsg(method + " Request from: " + remoteAddress + " Request target: " + target);
		//System.out.println("\n\n"+method + " Request from: " + remoteAddress + " Request target: " + target);
		writeReceivedHeadersToLog(baseRequest);

		String[] parts = target.split("/");
		JSONParser parser = new JSONParser();
		Object obj = null;
		String data = "";
		String line = null;
		String idReq = null;

		try {
			BufferedReader reader = baseRequest.getReader();
			while ((line = reader.readLine()) != null) {
				data = data + line;
			}

		} catch (Exception e) {
			writeLogMsg(e.getMessage());
		}

		response.setContentType("application/json;charset=utf-8");
		response.setStatus(HttpServletResponse.SC_OK);
		// baseRequest.setHandled(true);

		if (parts.length > 2) {
			if (data != "") {
				writeLogMsg("Payload: " + data);
			}
			if (parts.length > 3) {
				try {
					idReq = parts[3];
					writeLogMsg("Id requested: " + idReq);
				} catch (NumberFormatException e) {
					writeLogMsg(e.getMessage());
				}
			}

			String dbName = parts[1];
			String tableName = parts[2];
			JSONObject tmpObj = null;

			if (method == "GET") {
				getData(response, dbName, tableName, idReq, remoteAddress, queryString);
			} else {
				try {
					obj = parser.parse(data);
					if (method == "POST") {
						tmpObj = (JSONObject) obj;
						Object type = tmpObj.get("type");
						Object reqData = tmpObj.get("data");

						if (type != null) {

							if (type.equals("GET")) 
							{

								getData(response, dbName, tableName, idReq, remoteAddress, queryString);
							} 
							else if (type.equals("INSERT") && reqData != null) 
							{
								insertData(response, dbName, tableName, reqData, remoteAddress);
							} 
							else if (type.equals("UPDATE") && reqData != null) 
							{
								updateData(response, dbName, tableName, reqData, remoteAddress);
							} 
							else if (type.equals("DELETE") && reqData != null) 
							{
								deleteData(response, dbName, tableName, reqData, remoteAddress);
							} 
							else if (type.equals("INFORM") && reqData != null) 
							{
								informData(response, dbName, tableName, reqData, remoteAddress);
							} 
							else if (type.equals("LOGOUT")) {
								writeLogMsg("LOGOUT request received");
//								response.getWriter().println("{\"succeeded\":"+"true"+",\"result\":\"Logout ok\"}");
								response.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
								response.setHeader("Pragma","no-cache");
								response.setDateHeader("Expires", 0);								
								response.sendError(response.SC_UNAUTHORIZED, "You are not authorized to enter PROASENSE.");

							}
						}

					} else if (method.equals("PUT")) {
						insertData(response, dbName, tableName, obj, remoteAddress);
					} else if (method.equals("PATCH")) {
						updateData(response, dbName, tableName, obj, remoteAddress);
					} else if (method.equals("DELETE")) {
						deleteData(response, dbName, tableName, obj, remoteAddress);
					}
				} catch (Exception e) {
					response.getWriter()
							.println("{\"succeeded\":false,\"result\":\"" + e.toString().replace("\"", "\\\"") + "\"}");
					writeLogMsg("Response at: " + remoteAddress);
				}
			}

		}
	}

	private void writeReceivedHeadersToLog(HttpServletRequest baseRequest) {
		Enumeration<String> headers = baseRequest.getHeaderNames();
		while (headers.hasMoreElements()) {
			String header = headers.nextElement();
			String headerContent = baseRequest.getHeader(header);
			writeLogMsg("Header: " + header + " " + headerContent);
		}
	}

	private static void writeLogMsg(String msg) {
		System.out.println(msg);
		_log.saveToFile(msg);
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		writeLogMsg("------------------ doGet ---------------");
		writeReceivedHeadersToLog(request);
		writeLogMsg("------------- end of doGet -------------");

		handle(request.getPathInfo(), request, response);

	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		writeLogMsg("------------------ doPost ---------------");
		writeReceivedHeadersToLog(request);
		writeLogMsg("------------- end of doPost -------------");

		handle(request.getPathInfo(), request, response);
	}

	public void init() {
		//ServletContext context = getServletContext();
		
		if(SystemUtils.IS_OS_UNIX){
			logPath = File.separator+"home"
					+File.separator+"proasense"
					+File.separator+"proasenseModeller"
					+File.separator+"KPIrepMaven"
					+File.separator;
			// Database that needs to be used IMPORTANT:has its identifiers as
			// uppercase
			dbPath = File.separator+"home"
					+File.separator+"proasense"
					+File.separator+"proasenseModeller"
					+File.separator+"KPIrepMaven"
					+File.separator+"db"
					+File.separator;
		}else{
			logPath = System.getProperty("user.home")
					+File.separator+"proasense"
					+File.separator+"proasenseModeller"
					+File.separator+"KPIrepMaven"
					+File.separator;
			// Database that needs to be used IMPORTANT:has its identifiers as
			// uppercase
			dbPath = System.getProperty("user.home")
					+File.separator+"proasense"
					+File.separator+"proasenseModeller"
					+File.separator+"KPIrepMaven"
					+File.separator+"db"
					+File.separator;
		}
		
		dbConfig = new DBConfig("jdbc:hsqldb:file:" + dbPath, "", "SA", "");
		dAO = new DatabaseAccessObject(dbPath, logPath);
		_log = LoggingSystem.getLog(logPath);
		
		System.out.println("Database path: " + dbPath);
		System.out.println("LogSystem configured in: " + logPath);
		 
		this.SRCM = new StorageRESTClientManager();	
	}
}
