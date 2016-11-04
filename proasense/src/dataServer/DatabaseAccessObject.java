package dataServer;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;

import org.hsqldb.result.ResultMetaData;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import dataServer.database.DBConfig;
import dataServer.database.DBUtils;
import dataServer.database.dbobjects.HeatMap;
import dataServer.database.dbobjects.KpiDataObject;
import dataServer.database.dbobjects.ResultTable;
import dataServer.database.dbobjects.ResultTableElement;
import dataServer.database.enums.SamplingInterval;
import dataServer.database.enums.TableValueType;

public class DatabaseAccessObject {
	
	String dbName = "proasense_hella";
//	String dbName = "dbTest";
	DBUtils dBUtil;
//	DBUtils dBUtil = new DBUtils(new DBConfig("jdbc:hsqldb:file:dbTest/", dbName, "SA", ""));
	LoggingSystem log;
	String logFileName = "daoTestFile.log";
	
	private Object _legends;
	private Object _graphTitle;
	private Integer _valueRefQty;
	private boolean _valueRefQtyFlag = false;
	private String[] _refRows;
	private Object _heatMapXLabels;
	private Object _heatMapYLabels;
	private String[][] _heatMap;
	
	
	public DatabaseAccessObject(String dbPath,String logPath)
	{
		dBUtil = new DBUtils(new DBConfig("jdbc:hsqldb:file:"+dbPath, dbName, "SA", ""),logPath);
		log =   LoggingSystem.getLog(logPath);
	}
	
	public int getNameId(String tableName, String valueName){
		int id=0;
		dBUtil.openConnection(dbName);
		
//		String query = "SELECT \"id\" FROM \""+tableName+"\" WHERE \"name\"='"+valueName+"';";
		String query = "SELECT \"ID\" FROM \""+tableName.toUpperCase()+"\" WHERE NAME='"+valueName+"';";
		
		ResultSet queryResult = dBUtil.processQuery(query);
		
        try {
			for (; queryResult.next(); ) {
				id = (int)queryResult.getObject(1);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		
		dBUtil.closeConnection();
		return id;
	}
	
	
	public int getForeignKeyId(String tableName, String foreignKeyName, String valueName){
		Integer id=0;
		dBUtil.openConnection(dbName);
		
//		String query = "SELECT \""+foreignKeyName+"\" FROM \""+tableName+"\" WHERE NAME='"+valueName+"';";
		String query = "SELECT \""+foreignKeyName.toUpperCase()+"\" FROM \""+tableName.toUpperCase()+"\" WHERE NAME='"+valueName+"';";
		
		ResultSet queryResult = dBUtil.processQuery(query);
		
	    try {
			for (; queryResult.next(); ) {
				id = (Integer)queryResult.getObject(1);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			log.saveToFile("getForeignKeyId exception: "+e );
			e.printStackTrace();
		}		
		
		dBUtil.closeConnection();
		return id;
	}

	public int getMaxId(String tableName) {
		Integer id=0;
		dBUtil.openConnection(dbName);
		
//		String query = "SELECT MAX(\"id\") FROM \""+tableName+"\";";
		String query = "SELECT MAX(\"ID\") FROM \""+tableName.toUpperCase()+"\";";
		log.saveToFile("<Processing query>"+query);
		
		ResultSet queryResult = dBUtil.processQuery(query);
		log.saveToFile("<Query processed>");
		
        try {
        	if (queryResult.next()) {
	        	id = (Integer)queryResult.getObject(1);

	        	if (id == null) {
	            	id = 0;
	            }
        	}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		dBUtil.closeConnection();
		return id;
	}
	
	public long getMaxDate(String tableName){
		return 0;
	}
	
	private ArrayList<String> prepareInsertQuery(ArrayList<KpiDataObject> buffer){
		// create insert query string

		String columnNames = "";
		String values = "";
		ArrayList<String> queryList = new ArrayList<>();
		//int id = getMaxId("kpi_values");

		for (KpiDataObject kpiValue : buffer) {
//			columnNames = "\"id\", ";
//			values = (++id) + ", ";
			columnNames = "";
			values = "";
			for (String col : kpiValue.columnsNames){
				columnNames += "\""+col+"\", ";
				values += kpiValue.getColumnValue(col) + ", ";
			}
			columnNames = columnNames.substring(0, columnNames.length()-2);
			values = values.substring(0, values.length()-2);
//			queryList.add("INSERT INTO \""+kpiValue.tableName+"\" ("+columnNames+") VALUES ("+values+");");  
			queryList.add("INSERT INTO \""+kpiValue.tableName.toUpperCase()+"\" ("+columnNames.toUpperCase()+") VALUES ("+values+");");  
		}
		
		
		return queryList;
	}
	
	public boolean insertBatchData(ArrayList<KpiDataObject> buffer){
		ArrayList<String> batchQuery = prepareInsertQuery(buffer);
		dBUtil.openConnection(dbName);
		dBUtil.processBatchQuery(batchQuery);
		dBUtil.closeConnection();
		return true;
	} 
	
	public Object getHeatMapData(Integer kpiId, TableValueType contextualInformation, Timestamp startTime, Timestamp endTime,
			SamplingInterval granularity, String contextName, TableValueType varX, TableValueType varY) {
		
		Integer contextElementId = (contextualInformation == TableValueType.GLOBAL)?0:getNameId(contextualInformation.toString(), contextName);
		contextElementId = (contextElementId==0)? 1:contextElementId;
		
		HeatMap heatMap = new HeatMap(kpiId, contextualInformation, granularity, startTime, endTime,contextElementId, varX, varY, log);
		String aggregation = getAggregation(kpiId);
		
		Object resultObject = null;
		
		String query = "";
		if (!aggregation.equals("NONE")){
			query = heatMap.getHeatMapQueryString(aggregation);
			heatMap = getHeatMapFromDb(query, heatMap, contextualInformation);
			heatMap.setHeatMapValues();
			resultObject = heatMap.toJSonObjectHeatMap();
			
		} else {
			String formula = getFormula(kpiId);
			if (formula.length()==3) {
				String kpiIdA = formula.substring(0,1);
				String operator = formula.substring(1,2); 
				String kpiIdB = formula.substring(2,3);
				
				HeatMap heatMapA = new HeatMap(Integer.parseInt(kpiIdA), contextualInformation, granularity, startTime, endTime,contextElementId, varX, varY, log);
				String queryA = heatMapA.getHeatMapQueryString(aggregation);
				heatMapA = getHeatMapFromDb(queryA, heatMapA, contextualInformation);
				HeatMap heatMapB = new HeatMap(Integer.parseInt(kpiIdB), contextualInformation, granularity, startTime, endTime,contextElementId, varX, varY, log);
				String queryB = heatMapB.getHeatMapQueryString(aggregation);
				heatMapB = getHeatMapFromDb(queryB, heatMapB, contextualInformation);
				
				heatMap.setHeatMapValues(heatMapA, heatMapB, operator, heatMapA.varXUnique.size(), heatMapA.varYUnique.size());
				
				heatMap.varXUnique = heatMapA.varXUnique;
				heatMap.varYUnique = heatMapA.varYUnique;
				
				resultObject = heatMap.toJSonObjectHeatMap(heatMapA.varXUnique.size(), heatMapA.varYUnique.size());
			}
		}

		heatMap.setHeatMapLabels(); 
		
		_heatMapXLabels = heatMap.getHeatMapXLabels();
		_heatMapYLabels = heatMap.getHeatMapYLabels();
		
//		heatMap.setHeatMapValues(); 
		
		return resultObject;
	}
	

	public HeatMap getHeatMapFromDb(String query, HeatMap heatMap, TableValueType contextualInformation) {
		dBUtil.openConnection(dbName);
		log.saveToFile("<Processing query>"+query);
		
		ResultSet queryResult = dBUtil.processQuery(query);
		
		log.saveToFile("<Query processed>");
		
        try {
        	ResultSetMetaData rMD = queryResult.getMetaData();
        	Integer colN = rMD.getColumnCount();
        	heatMap.columnQty = colN;

        	ResultTableElement resultRow = new ResultTableElement(contextualInformation, colN);
        	
        	for (; queryResult.next(); ) {

				for (int i = 0; i<rMD.getColumnCount(); i++) {
					resultRow.columnsNames.add(rMD.getColumnLabel(i+1));
					if (queryResult.getObject(i+1)==null)
						resultRow.columnValues[i] = "null";
					else{
						resultRow.columnValues[i] = queryResult.getObject(i+1).toString();
						switch (i){
						case 0: if (!heatMap.varXUnique.contains(resultRow.columnValues[i])) {
									heatMap.varXUnique.add(resultRow.columnValues[i]);
								}
								break;
						case 1: if (!heatMap.varYUnique.contains(resultRow.columnValues[i])) {
									heatMap.varYUnique.add(resultRow.columnValues[i]);
								}
								break;
								
						default:break;
						}
					}
				}

				heatMap.resultsRows.add(resultRow);
				resultRow = new ResultTableElement(contextualInformation, colN);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}		
		
		dBUtil.closeConnection();
		
		return heatMap;
	}
	
	
	public Object getData(Integer kpiId, TableValueType contextualInformation, SamplingInterval granularity, Timestamp startTime, Timestamp endTime, Integer contextValueId, TableValueType secondContext, boolean includeGlobal){
		Object data = null;
		JSONParser parser = new JSONParser();
		ArrayList<ResultTable> tempResultTable = null;

		_valueRefQtyFlag = false;
		
		tempResultTable = getKpiValue(kpiId, contextualInformation, granularity, startTime, endTime, contextValueId, secondContext, includeGlobal);
		
		String legend = "";
		String[] tempDataStr = new String[tempResultTable.size()];
		Integer pos = -1;
		for (ResultTable rt : tempResultTable){

			if (rt.resultsRows.size() != 0) {
				legend += rt.toJsonObjectLegend()+",";
				tempDataStr[++pos] = rt.toJSonObject(rt.columnQty, _refRows).toString();
			}
		}  

//		legend = "["+legend+"]";
		if (legend.length() > 0)
			legend = "["+legend.substring(0, legend.length()-1)+"]";
		else
			legend = "[]"; 
			
//		legend +="]"; 
		try {
			log.saveToFile("<Values>"+Arrays.toString(tempDataStr)+"</Values>");
			log.saveToFile("<Legends>"+legend+"</Legends>");

			data = parser.parse(Arrays.toString(tempDataStr));
			_legends = parser.parse(legend);
		} catch (ParseException e) {
			e.printStackTrace();
			log.saveToFile("<Error parsing results kpiId="+kpiId+" contextualInformation="+contextualInformation.toString()
					+" granularity="+granularity+" startTime="+startTime+" endTime="+endTime+"> "+e.getMessage()+" </Error parsing results>");
		}
		
		
		return data;
	}
	
	public ArrayList<ResultTable> getKpiValue(Integer kpi, TableValueType contextualInformation, SamplingInterval granularity, Timestamp startTime, Timestamp endTime, Integer contextValueId, TableValueType secondContext, boolean includeGlobal){
		ArrayList<ResultTable> alrt = new ArrayList<ResultTable>();
		ResultTable resTabTmp = getOneKpiValue(kpi, startTime, endTime, granularity, true, TableValueType.GLOBAL, null, null, TableValueType.NONE); 
		
		if (includeGlobal) {
			alrt.add(resTabTmp);
		}
		
		if (!contextualInformation.equals(TableValueType.GLOBAL)){
			if ((contextValueId !=0 ) && (secondContext == TableValueType.NONE) ){
				ResultTable tbResult = getOneKpiValue(kpi, startTime, endTime, granularity, false, contextualInformation, contextValueId, contextValueId, TableValueType.NONE);
				if (tbResult.resultsRows.size() != 0)
					alrt.add(tbResult);
			}
			else {
				Integer numTableElements = 0;
				if (secondContext == TableValueType.NONE)
					numTableElements = getMaxId(contextualInformation.toString().toLowerCase());
				else
					numTableElements = getMaxId(secondContext.toString().toLowerCase());
				for (int k = 1; k<=numTableElements;k++){
					ResultTable tbResult = getOneKpiValue(kpi, startTime, endTime, granularity, false, contextualInformation, k, contextValueId, secondContext);
					if (tbResult.resultsRows.size() != 0)
						alrt.add(tbResult);
				}
			}
				
		}
			
		return alrt;
	}
		
	public ResultTable getOneKpiValue(Integer kpi, Timestamp startTime, Timestamp endTime, SamplingInterval granularity, boolean isGlobal, TableValueType contextualInformation, Integer contextId, Integer contextValueId, TableValueType secondContextualInformation){
		ResultTable resultTable = new ResultTable(contextualInformation, granularity);
		//String query = resultTable.getResultTableQueryString(startTime, endTime);
		String query = resultTable.getResultTableQueryString(kpi, startTime, endTime, granularity, isGlobal, contextualInformation, contextId, contextValueId, secondContextualInformation);
		
		dBUtil.openConnection(dbName);
		log.saveToFile("<Processing query>"+query);
		
		ResultSet queryResult = dBUtil.processQuery(query);
		log.saveToFile("<Query processed>");
		
        try {
        	ResultSetMetaData rMD = queryResult.getMetaData();
        	Integer colN = rMD.getColumnCount();
        	resultTable.columnQty = colN;
        	
        	ResultTableElement resultRow = new ResultTableElement(contextualInformation, colN);
        	
        	for (; queryResult.next(); ) {

				for (int i = 0; i<rMD.getColumnCount(); i++) {
					resultRow.columnsNames.add(rMD.getColumnName(i+1));
					if (queryResult.getObject(i+1)==null)
						resultRow.columnValues[i] = "null";
					else
						resultRow.columnValues[i] = queryResult.getObject(i+1).toString();
				}
 
				resultTable.resultsRows.add(resultRow);
				resultRow = new ResultTableElement(contextualInformation, colN);
			}
        	
        	
		} catch (SQLException e) {
			e.printStackTrace();
		}		
		
		dBUtil.closeConnection();
		
		if (!_valueRefQtyFlag)
			initializeValueRefQtyVector(resultTable.resultsRows);
		
		return resultTable;
	}

	private void initializeValueRefQtyVector(ArrayList<ResultTableElement> rows){
		_valueRefQty = rows.size();
    	_refRows = new String[_valueRefQty];
    	
    	for(int j=0;j<_valueRefQty;j++){
    		_refRows[j] = rows.get(j).columnValues[1];
    	}
    	
    	_valueRefQtyFlag = true;
	}
	
	public Object getLegends() {
		return _legends;
	}

	public Object getXLabels(SamplingInterval granularity){
		JSONParser parser = new JSONParser();
		Object result = null;

		try {
			String tmp = "";
			for (int i=0;i<_refRows.length;i++){
				tmp += "\""+getLabelName(granularity, _refRows[i], false)+"\",";
			}
			if (tmp.length() > 0)
				tmp = "["+tmp.substring(0, tmp.length()-1)+"]";
			else
				tmp = "[]";
//			tmp += "]";
			result = parser.parse(tmp);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public String getLabelName(SamplingInterval granularity, String element, boolean heatMapTitle){
		String labelName ="";
		String labelNameTimeZone ="";
		String format ="";
		log.saveToFile("getLabelName method: element->"+element);
		switch (granularity) {
		case HOURLY:
					format = "";
					if (heatMapTitle) {
						format = "HH'h'mm'm' dd'-'MMM";
					}
					else {
						format = "HH'h' dd MMM";
					}
					log.saveToFile("getLabelName method: format->" + format + "<-");
					labelName = (new SimpleDateFormat(format)).format(Timestamp.valueOf(element));
					labelNameTimeZone = (new SimpleDateFormat(format.concat("'<TimeZones: ' Z'/' z'/' X'>'"))).format(Timestamp.valueOf(element));
					break;
		case DAILY: format = "dd MMM ''yy";
					labelName = (new SimpleDateFormat(format)).format(Timestamp.valueOf(element)); //yyyy-mm-dd
					labelNameTimeZone = (new SimpleDateFormat(format.concat("'<TimeZones: ' Z'/' z'/' X'>'"))).format(Timestamp.valueOf(element));
			break;
		case MONTHLY: format = "MMM ''yy";
					  labelName = (new SimpleDateFormat(format)).format(Timestamp.valueOf(element)); // "April" 
					  labelNameTimeZone = (new SimpleDateFormat(format.concat("'<TimeZones: ' Z'/' z'/' X'>'"))).format(Timestamp.valueOf(element));
			break;
		case WEEKLY: format = "'W'ww ''yy";
					 labelName = (new SimpleDateFormat(format)).format(Timestamp.valueOf(element));
					 labelNameTimeZone = (new SimpleDateFormat("'W'ww ''yy".concat("'<TimeZones: ' Z'/' z'/' X'>'"))).format(Timestamp.valueOf(element));
			break;
		case YEARLY: format = "yyyy";
					 labelName = (new SimpleDateFormat(format)).format(Timestamp.valueOf(element));
					 labelNameTimeZone = (new SimpleDateFormat("yyyy".concat("'<TimeZones: ' Z'/' z'/' X'>'"))).format(Timestamp.valueOf(element));
			break;
		default: labelName = "NO DATE-TIME FORMAT AVAILABLE";
			break;
		}
		log.saveToFile("getLabelName method: labelName->"+labelName);
		log.saveToFile("getLabelName method: labelNameTimeZone->"+labelNameTimeZone);
		return labelName;
		
	}
	
	public Object getXLabelsTimeStamp(){
		JSONParser parser = new JSONParser();
		Object result = null;

		try {
			String tmp = "";
			for (int i=0;i<_refRows.length;i++){
				tmp += "\""+getLabelNameTimeStamp(_refRows[i])+"\",";
			}
			if (tmp.length()>0)
				tmp = "["+tmp.substring(0, tmp.length()-1)+"]";
			else
				tmp = "[]";
//			tmp += "]";
			result = parser.parse(tmp);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return result; 
	}
	
	private Long getLabelNameTimeStamp(String element){
//		return Timestamp.valueOf(element).getTime();
		return Long.parseLong(""+Timestamp.valueOf(element).getTime());
	}

	public Object getTitle(Integer kpiId) {
		setTitle(kpiId);
		JSONParser parser = new JSONParser();
		Object result = null;

		try {
			String tmp = "";
			tmp += "\""+_graphTitle+"\",";
			tmp = tmp.substring(0, tmp.length()-1);
			tmp += "";
			result = parser.parse(tmp);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public String getAggregation(Integer kpiId){
		String aggregation = "";
		dBUtil.openConnection(dbName);
		String query = "SELECT \"KPI_AGG_TYPE\".\"AGGREGATION\" "
					 + "	FROM \"KPI\" "
					 + "	INNER JOIN \"KPI_AGG_TYPE\" ON \"KPI\".\"AGGREGATION\" = \"KPI_AGG_TYPE\".\"ID\" "
					 + "    WHERE \"ID\" = "+kpiId; 

		log.saveToFile("<Processing query>"+query);
		
		ResultSet queryResult = dBUtil.processQuery(query);
		log.saveToFile("<Query processed>");
		
        try {
        	if (queryResult.next()) {
	        	aggregation = (String)queryResult.getObject(1);
        	}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		dBUtil.closeConnection();
		return aggregation;
	}
	
	public String getFormula(Integer kpiId){
		String formula = "";
		String query = "SELECT \"TERM1_KPI_ID\", \"OPERATOR_1\", \"TERM2_KPI_ID\", \"OPERATOR_2\", \"TERM3_KPI_ID\" "
					 + " FROM \"KPI_FORMULA\" "
					 + " WHERE \"KPI_ID\" = "+kpiId;

		log.saveToFile("<Processing query>"+query);
		
		ResultSet queryResult = dBUtil.processQuery(query);
		
		log.saveToFile("<Query processed>");
		
        try {
        	if (queryResult.next()) {
	        	String termA = "";
	        	if (queryResult.getObject(1) != null){
	        		termA = queryResult.getObject(1).toString();
	        	}
	        	
	        	String operator1 = "";
	        	if (queryResult.getObject(2) != null) {
	        		operator1 = queryResult.getObject(2).toString();
	        	}
	        	
	        	String termB = "";
	        	if (queryResult.getObject(3) != null) {
	        		termB = queryResult.getObject(3).toString();
	        	}
	        	
	        	String operator2 = "";
	        	if (queryResult.getObject(4) != null) {
	        		operator2 = queryResult.getObject(4).toString();
	        	}
	        	
	        	String termC = ""; 
	        	if (queryResult.getObject(5) != null){
	        		termC = queryResult.getObject(5).toString();
	        	}
	        	formula = termA + operator1 + termB + operator2 + termC;
        	}
		} catch (SQLException e) { 
			e.printStackTrace();
		}
		
		dBUtil.closeConnection();
		
		return formula;	
	}
	
	public String getCurrentDayTotalUnits() {
		String currentDayTotalUnits = "";
		
//		String query = "SELECT COUNT(*) "
//				+ "FROM \"kpi_values\" kv "
//				+ "WHERE kv.\"timestamp\" "
//					+ "BETWEEN CAST(CONCAT(CAST((SELECT MAX(kv.\"timestamp\") FROM \"kpi_values\" kv) AS DATE), ' 00:00:00.0') AS TIMESTAMP) "
//					+ "AND (SELECT MAX(kv.\"timestamp\") FROM \"kpi_values\" kv);";
		
		String query = "SELECT COUNT(*) "
				+ "FROM \"KPI_VALUES\" kv "
				+ "WHERE kv.\"KPI_TIMESTMP\" "
					+ "BETWEEN CAST(CONCAT(CAST((SELECT MAX(kv.\"KPI_TIMESTMP\") FROM \"KPI_VALUES\" kv) AS DATE), ' 00:00:00.0') AS TIMESTAMP) "
					+ "AND (SELECT MAX(kv.\"KPI_TIMESTMP\") FROM \"KPI_VALUES\" kv);";
		
		dBUtil.openConnection(dbName);
		
		log.saveToFile("<Processing query>"+query);
		
		ResultSet queryResult = dBUtil.processQuery(query);
		log.saveToFile("<Query processed>");
		
        try {
        	if (queryResult.next()) {
        		currentDayTotalUnits = (String)queryResult.getObject(1);

	        	if (currentDayTotalUnits  == null) {
	        		currentDayTotalUnits = "";
	            }
	        	
        	}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		dBUtil.closeConnection();
		
		return currentDayTotalUnits;
	}
	
	private void setTitle(Integer kpiId) {
		dBUtil.openConnection(dbName);
		
//		String query = "SELECT \"name\" FROM \"kpi\" WHERE \"kpi\".\"id\"='"+kpiId+"';";
		String query = "SELECT \"NAME\" FROM \"KPI\" WHERE \"KPI\".\"ID\"='"+kpiId+"';";
		log.saveToFile("<Processing query>"+query);
		
		ResultSet queryResult = dBUtil.processQuery(query);
		log.saveToFile("<Query processed>");
		
        try {
        	if (queryResult.next()) {
	        	_graphTitle = (String)queryResult.getObject(1);

	        	if (_graphTitle  == null) {
	        		_graphTitle = "";
	            }
        	}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		dBUtil.closeConnection();
	}
	
	public Object getHeatMapXLabels() {
		return _heatMapXLabels;
	}
	
	public Object getHeatMapYLabels() {
		return _heatMapYLabels;
	}

	/*
	 * @deprecated {@link #getKpiValue()} instead.
	 * */
	@Deprecated
	public ArrayList<ResultTable> getScrapRate(TableValueType contextualInformation, SamplingInterval granularity, Timestamp startTime, Timestamp endTime){
		ArrayList<ResultTable> alrt = new ArrayList<ResultTable>();
		alrt.add(getOneScrapRate(TableValueType.GLOBAL, granularity, startTime, endTime));
		if (!contextualInformation.equals(TableValueType.GLOBAL)){
			Integer numTableElements = getMaxId(contextualInformation.toString().toLowerCase());
			for (int k = 1; k<=numTableElements;k++){
				ResultTable tbResult = getOneScrapRate(contextualInformation, granularity, startTime, endTime, k);
				if (tbResult.resultsRows.size() != 0)
					alrt.add(tbResult);
			}
				
		}
			
		return alrt;
	}
	
	/* 
	 * 
	 * @deprecated use {@link #getOneKpiValue()} instead.
	 * */
	@Deprecated
	public ResultTable getOneScrapRate(TableValueType contextualInformation, SamplingInterval granularity, Timestamp startTime, Timestamp endTime, Integer id){
		ResultTable resultTable = new ResultTable(contextualInformation, granularity);
		String query = resultTable.getResultTableQueryString(id, startTime, endTime);
		
		dBUtil.openConnection(dbName);
		log.saveToFile("<Processing query>"+query);
		
		ResultSet queryResult = dBUtil.processQuery(query);
		log.saveToFile("<Query processed>");
		
        try {
        	ResultSetMetaData rMD = queryResult.getMetaData();
        	Integer colN = rMD.getColumnCount();
        	resultTable.columnQty = colN;

        	ResultTableElement resultRow = new ResultTableElement(contextualInformation, colN);
        	
        	for (; queryResult.next(); ) {

				for (int i = 0; i<rMD.getColumnCount(); i++) {
					resultRow.columnsNames.add(rMD.getColumnName(i+1));
					if (queryResult.getObject(i+1)==null)
						resultRow.columnValues[i] = "null";
					else
						resultRow.columnValues[i] = queryResult.getObject(i+1).toString();
				}

				resultTable.resultsRows.add(resultRow);
				resultRow = new ResultTableElement(contextualInformation, colN);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}		
		
		dBUtil.closeConnection();
		return resultTable;
	}
	
	/*
	 * 
	 *  @deprecated use {@link #getOneKpiValue()} instead.
	 *  */
	@Deprecated
	public ResultTable getOneScrapRate(TableValueType contextualInformation, SamplingInterval granularity, Timestamp startTime, Timestamp endTime){
		ResultTable resultTable = new ResultTable(contextualInformation, granularity);
		String query = resultTable.getResultTableQueryString(startTime, endTime);
		
		dBUtil.openConnection(dbName);
		log.saveToFile("<Processing query>"+query);
		
		ResultSet queryResult = dBUtil.processQuery(query);
		log.saveToFile("<Query processed>");
		
        try {
        	ResultSetMetaData rMD = queryResult.getMetaData();
        	Integer colN = rMD.getColumnCount();
        	resultTable.columnQty = colN;
        	
        	ResultTableElement resultRow = new ResultTableElement(contextualInformation, colN);
        	
        	for (; queryResult.next(); ) {

				for (int i = 0; i<rMD.getColumnCount(); i++) {
					resultRow.columnsNames.add(rMD.getColumnName(i+1));
					if (queryResult.getObject(i+1)==null)
						resultRow.columnValues[i] = "null";
					else
						resultRow.columnValues[i] = queryResult.getObject(i+1).toString();
				}

				resultTable.resultsRows.add(resultRow);
				resultRow = new ResultTableElement(contextualInformation, colN);
			}
        	
        	
		} catch (SQLException e) {
			e.printStackTrace();
		}		
		
		dBUtil.closeConnection();
		
		initializeValueRefQtyVector(resultTable.resultsRows);
		
		return resultTable;
	}

	public static void main(String[] args) {
//		DatabaseAccessObject dAO = new DatabaseAccessObject();
//		LoggingSystem log = LoggingSystem.getLog();
//		String logFileName = "daoTestFile.log";
//		
//
//		String query2 = "SELECT Count(*) cnt1, mc.\"name\" Machine1 "
//					 + "FROM \"kpi_values\" kv "
//					 + "LEFT OUTER JOIN \"product\" mc ON kv.\"product_id\" = mc.\"id\" "
//					 + "WHERE kv.\"good_part\" = 'false' "
//					 + "AND CAST(kv.\"timestamp\" AS TIME) BETWEEN TIME'00:00:00' AND TIME'23:59:59' "
//					 + "AND CAST(kv.\"timestamp\" AS DATE) BETWEEN DATE'2014-10-01' AND DATE'2015-05-03' "		  
//					 + "GROUP BY Machine1; ";
//		
//		String ScrapRateTotalPerMachine = "SELECT ((BadParts.cnt2)/(BadParts.cnt2+GoodParts.cnt1))*100 ScrapRate, GoodParts.cnt1, GoodParts.Machine1, BadParts.cnt2 "
//					  +"FROM (SELECT Count(*) cnt1, mc.\"name\" Machine1, kv.\"good_part\" Part1 "
//							+"FROM \"kpi_values\" kv, \"machine\" mc "
//							+"WHERE kv.\"machine_id\" = mc.\"id\"  "
//							+"AND kv.\"good_part\" = 'true' "
//							+"AND CAST(kv.\"timestamp\" AS TIME) BETWEEN TIME'00:00:00' AND TIME'23:59:59' "
//							+"AND CAST(kv.\"timestamp\" AS DATE) BETWEEN DATE'2014-10-01' AND DATE'2015-04-05' "
//							+"GROUP BY Machine1, Part1) AS GoodParts "
//					  +"INNER JOIN (SELECT Count(*) cnt2, mc.\"name\" Machine2, kv.\"good_part\" Part2 FROM \"kpi_values\" kv, \"machine\" mc "
//							 	  +"WHERE kv.\"machine_id\" = mc.\"id\"  "
//								  +"AND kv.\"good_part\" = 'false' "
//								  +"AND CAST(kv.\"timestamp\" AS TIME) BETWEEN TIME'00:00:00' AND TIME'23:59:59' "
//								  +"AND CAST(kv.\"timestamp\" AS DATE) BETWEEN DATE'2014-10-01' AND DATE'2015-04-05' "
//								  +"GROUP BY Machine2, Part2) AS BadParts "
//					  +"ON Machine1 = Machine2; ";
//		
//		
////		Integer id=0;
//		dAO.dBUtil.openConnection(dAO.dbName);
//		log.saveToFile("Connection opened", logFileName);
//		
//		ResultSet queryResult = dAO.dBUtil.processQuery(ScrapRateTotalPerMachine);
//		
//        try {
//        	for (;queryResult.next();)
//        	{
//        		String s = "";
//	        	s += "<Machine:"+queryResult.getObject(3).toString()+">";
//	        	s += "<Good Parts:"+queryResult.getObject(2).toString()+">";
//	        	s += "<Scrapped Parts:"+queryResult.getObject(4).toString()+">";
//	        	s += "<ScrapRate:"+queryResult.getObject(1).toString()+">";
//
//	        	log.saveToFile(s, logFileName);
//        	}
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
//        
//        log.saveToFile("Connection closed", logFileName);
//        dAO.dBUtil.closeConnection();
//		
//		
//		
//		
//		dAO.getNameId("machine", "KM1");
//		dAO.getNameId("kpi", "");
	}
}
