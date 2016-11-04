package dataServer.database.dbobjects;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.locks.ReentrantReadWriteLock.WriteLock;

import org.hsqldb.Table;
import org.hsqldb.persist.Log;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import dataServer.LoggingSystem;
import dataServer.database.enums.SamplingInterval;
import dataServer.database.enums.TableValueType;
import dataServer.mathUtils.mathOperations;

public class HeatMap extends ResultTable {
	public ArrayList<String> varXUnique = new ArrayList<String>();
	public ArrayList<String> varYUnique = new ArrayList<String>();

	private String[][] _heatMap;

	private Object _heatMapXLabels;
	private Object _heatMapYLabels;
	
	private Integer kpiId;
	/* moment of the point requested in UI*/
	private Timestamp moment;

	/*name and ID of the context element for which a heatmap is requested. 
	 * ex: for machine id = 2, this field would have the name of the machine number 2 */
	private String contextElementName;
	private Integer contextElementId;
	
	/*context type to appear on the heatmap X axis*/
	private TableValueType varXtype;
	/*context type to appear on the heatmap X axis*/
	private TableValueType varYtype;

	private Timestamp startTime;
	private Timestamp endTime;
	
	LoggingSystem log;


	public HeatMap(Integer kpiId, TableValueType type, SamplingInterval granularity, Timestamp startTime, Timestamp endTime, Integer contextElementId, TableValueType varXAxis, TableValueType varYAxis, LoggingSystem log) {
		super(type, granularity);
		varXtype = varXAxis;
		varYtype = varYAxis;
		this.kpiId = kpiId;
		this.contextElementId = contextElementId;
		this.startTime = startTime;
		this.endTime = endTime;
		this.log = log;
	}
	
	public String getHeatMapQueryString(String aggregation){
		String contextStr = super.tableVT.toString().toLowerCase();
		String varXStr = varXtype.toString().toLowerCase();
		String varYStr = varYtype.toString().toLowerCase();
		String valueColumnStr = "\"KPI_VALUE\"";
		String groupByClauseStr = " ";
		if (!aggregation.equals("NONE")){
			if (aggregation.equals("count")) {
				valueColumnStr = "SUM("+valueColumnStr+")";
			}
			else{
				valueColumnStr = aggregation+"("+valueColumnStr+")";
			}
			groupByClauseStr = " GROUP BY \"varX\", \"varY\"";
		}
		
		String query = "SELECT vx.\"NAME\" as \"varX\", vy.\"NAME\" as \"varY\", "+valueColumnStr+" as \"value\""
				+ " FROM \"KPI_VALUES\" kv"
				+ "	INNER JOIN \""+varXStr.toUpperCase()+"\" vx ON \""+varXStr.toUpperCase()+"_ID\" = vx.\"ID\""
				+ " INNER JOIN \""+varYStr.toUpperCase()+"\" vy ON \""+varYStr.toUpperCase()+"_ID\" = vy.\"ID\""
				+ " WHERE kv.\"KPI_TIMESTMP\" BETWEEN TIMESTAMP('"+startTime+"') AND TIMESTAMP('"+endTime+"')"
				+ getContextElementWhereClause(super.tableVT, contextStr, contextElementId, false).toUpperCase()
				+ " AND \"KPI_ID\" = "+kpiId
				+ " AND \""+varXStr.toUpperCase()+"_ID\" IS NOT NULL"
				+ " AND \""+varYStr.toUpperCase()+"_ID\" IS NOT NULL"
				+ groupByClauseStr
				+ " ORDER BY \"varX\", \"varY\";"; 
		
		log.saveToFile("HeatMap Query : "+query); 
		return query;
	}
		
	private String getSamplingIntervalWhereClause(SamplingInterval granularity, Timestamp time, boolean mainClause){
		String result = (mainClause)?" WHERE ":" AND ";
		switch (granularity){
		case DAILY: result += "DAY(CAST(kv.\"KPI_TIMESTMP\" AS DATE)) = DAY(CAST(TIMESTAMP'"+time+"' AS DATE)) ";
//					result += "DAY(CAST(kv.\"kpi_timestmp\" AS DATE)) = DAY(CAST(TIMESTAMP'"+time+"' AS DATE)) ";
			break;
		case HOURLY: result += "HOUR(CAST(kv.\"KPI_TIMESTMP\" AS TIME)) = HOUR(CAST(TIMESTAMP'"+time+"' AS TIME)) ";
//					 result += "HOUR(CAST(kv.\"kpi_timestmp\" AS TIME)) = HOUR(CAST(TIMESTAMP'"+time+"' AS TIME)) ";
			break;
		case MONTHLY: result += "MONTH(CAST(kv.\"KPI_TIMESTMP\" AS DATE)) = MONTH(CAST(TIMESTAMP'"+time+"' AS DATE)) ";
//					  result += "MONTH(CAST(kv.\"kpi_timestmp\" AS DATE)) = MONTH(CAST(TIMESTAMP'"+time+"' AS DATE)) ";
			break;
		case WEEKLY: result += "MONTH(CAST(kv.\"KPI_TIMESTMP\" AS DATE)) = MONTH(CAST(TIMESTAMP'"+time+"' AS DATE)) ";
//					 result += "MONTH(CAST(kv.\"kpi_timestmp\" AS DATE)) = MONTH(CAST(TIMESTAMP'"+time+"' AS DATE)) ";
			break;
		case MINUTELY: 
			break;
		case YEARLY: 
			break;
		case NONE:
			break;
		default:
			break;
		
		}
		return result; 
	}
	
	private String getContextElementWhereClause(TableValueType contextualInformation, String contextStr, Integer contextElmentId, boolean mainClause){
		String result = "";
		
		if (contextualInformation != TableValueType.GLOBAL){
			result = (mainClause)?" WHERE ":" AND ";
			result += "\""+contextStr+"_id\" = "+contextElementId;
		}

		return result;
	}
	
	private String getGranularityIDClause(Integer kpi){
		String result = (kpi > 3)?" AND \"granularity_id\" IS NOT NULL":" ";
		
		return result;
	} 

	public void setHeatMapValues(){
		Integer xSize = varXUnique.size();
		Integer ySize = varYUnique.size();
		Integer varXPos = -1, varYPos = -1;
		String value = "";
		
		_heatMap = new String[xSize][ySize];
		
		// _heatMap matrix initialization
		for (int i=0;i<xSize;i++)
			for (int j=0;j<ySize;j++){
				_heatMap[i][j] = "null";
			}
		
		// populate _heatMap matrix 
		for (int i = 0; i<resultsRows.size();i++) {
			varXPos = varXUnique.indexOf(resultsRows.get(i).columnValues[0]);
			varYPos = varYUnique.indexOf(resultsRows.get(i).columnValues[1]);
			value = resultsRows.get(i).columnValues[2];
			
			_heatMap[varXPos][varYPos] = value;
		}
	}
	
	public void setHeatMapValues(HeatMap heatMapA, HeatMap heatMapB,String operator, Integer xSize, Integer ySize){
//		Integer xSize = varXUnique.size();
//		Integer ySize = varYUnique.size(); 
		Integer varXPosA = -1, varYPosA = -1;
		Integer varXPosB = -1, varYPosB = -1;
		String value = "";
		mathOperations math = new mathOperations();
		
		log.saveToFile("xSize:"+xSize+";ySize:"+ySize); 
		
		_heatMap = new String[xSize][ySize];
		
		Double[][] _heatMapA = new Double[xSize][ySize];
		Double[][] _heatMapB = new Double[xSize][ySize];

		// _heatMap matrix initialization
		for (int i=0;i<xSize;i++)
			for (int j=0;j<ySize;j++){
				_heatMap[i][j] = "null";
				_heatMapA[i][j] = 0.0;
				_heatMapB[i][j] = 0.0;
			} 
		
		
		log.saveToFile("heatMapA.resultsRows.size():"+heatMapA.resultsRows.size());	

		log.saveToFile("heatMapB.resultsRows.size():"+heatMapB.resultsRows.size());
			
		System.out.println("HeatMap length" + _heatMap.length);
		System.out.println("HeatMap A length" + _heatMapA.length);
		System.out.println("HeatMap B length" + _heatMapB.length);
		
		// populate _heatMap matrix 
		for (int i = 0; i<heatMapA.resultsRows.size();i++) {
			System.out.println("Context calculation : ---------------- ");
			
			varXPosA = heatMapA.varXUnique.indexOf(heatMapA.resultsRows.get(i).columnValues[0]);
			System.out.println("i=("+i+")"+"kpiId("+kpiId+")"+"for <"+heatMapA.resultsRows.get(i).columnValues[0]+">"+"index: "+varXPosA);
			
			varYPosA = heatMapA.varYUnique.indexOf(heatMapA.resultsRows.get(i).columnValues[1]);
			System.out.println("i=("+i+")"+"kpiId("+kpiId+")"+"for <"+heatMapA.resultsRows.get(i).columnValues[1]+">"+"index: "+varYPosA);
			
			varXPosB = heatMapB.varXUnique.indexOf(heatMapB.resultsRows.get(i).columnValues[0]);
			System.out.println("i=("+i+")"+"kpiId("+kpiId+")"+"for <"+heatMapB.resultsRows.get(i).columnValues[0]+">"+"index: "+varXPosB);
			
			varYPosB = heatMapB.varYUnique.indexOf(heatMapB.resultsRows.get(i).columnValues[1]);
			System.out.println("i=("+i+")"+"kpiId("+kpiId+")"+"for <"+heatMapB.resultsRows.get(i).columnValues[1]+">"+"index: "+varYPosB);
			
			_heatMapA [varXPosA][varYPosA] += Double.parseDouble(heatMapA.resultsRows.get(i).columnValues[2]);
			_heatMapB [varXPosB][varYPosB] += Double.parseDouble(heatMapB.resultsRows.get(i).columnValues[2]);
			
			_heatMap[varXPosA][varYPosA] = Double.toString(math.getResult(_heatMapA[varXPosA][varYPosA],	_heatMapB[varXPosA][varYPosA], operator));
			log.saveToFile("i=("+i+")"+"valueA:"+ _heatMapA[varXPosA][varYPosA] +";"+
					   "valueB:"+ _heatMapB[varXPosA][varYPosA] + ";  " + operator); 



			log.saveToFile("i=("+i+")"+"valueA:"+ _heatMapA[varXPosA][varYPosA] +";"+
						"valueB:"+ _heatMapB[varXPosA][varYPosA] + ";" +
						"result: "+value); 
		} 
		
		System.out.println("END OF context calculation : ---------------- ");
	}
	
	public void setHeatMapLabels() {
		setHeatMapXLabels(varXUnique);
		setHeatMapYLabels(varYUnique);
	}

	public Object getHeatMapYLabels() {
		return _heatMapYLabels;
	}
	
	public void setHeatMapYLabels(ArrayList<String> labels) {
		_heatMapYLabels = toJsonObjectHeatMapLabels(labels);
	}

	public Object getHeatMapXLabels(){
		return _heatMapXLabels;
	}

	public void setHeatMapXLabels(ArrayList<String> labels) {
		_heatMapXLabels = toJsonObjectHeatMapLabels(labels);
	}
	
	public Object toJSonObjectHeatMap(){
		Object jsonObject = new JSONObject();
		JSONParser parser = new JSONParser();
		ArrayList<String> tempArrStr = new ArrayList<String>();

		for (int i=0;i<varXUnique.size();i++){
			for (int j=0;j<varYUnique.size();j++){
				tempArrStr.add("{\"varX\":"+(i+1)+", \"varY\":"+(j+1)+", \"value\":"+_heatMap[i][j]+"}");
			}
		}

		try {
			jsonObject = parser.parse(tempArrStr.toString());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return jsonObject;
	}
	
	public Object toJSonObjectHeatMap(Integer varXUniqueSize, Integer varYUniqueSize){
		Object jsonObject = new JSONObject();
		JSONParser parser = new JSONParser();
		ArrayList<String> tempArrStr = new ArrayList<String>();

		for (int i=0;i<varXUniqueSize;i++){
			for (int j=0;j<varYUniqueSize;j++){
				tempArrStr.add("{\"varX\":"+(i+1)+", \"varY\":"+(j+1)+", \"value\":"+_heatMap[i][j]+"}");
			}
		}

		try {
			jsonObject = parser.parse(tempArrStr.toString());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return jsonObject;
	}
	
	private Object toJsonObjectHeatMapLabels(ArrayList<String> labels){
		Object jsonObject = null;
		JSONParser parser = new JSONParser();
		
		String[] x = new String[labels.size()];
		for (int i=0;i<labels.size();i++){
			x[i] = "\""+labels.get(i)+"\"";
		}
		
		try {
			jsonObject = parser.parse(Arrays.toString(x));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return jsonObject;
	}

}
