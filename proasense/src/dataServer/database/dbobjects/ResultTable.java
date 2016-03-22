package dataServer.database.dbobjects;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import dataServer.database.enums.SamplingInterval;
import dataServer.database.enums.TableValueType;

public class ResultTable {
	SamplingInterval samplingInterval = SamplingInterval.NONE;
	TableValueType tableVT = TableValueType.NONE;
	
	String partsTableAlias = "";
	String scrappedPartsTableAlias = "";
	String typeTableAlias = "";
	String typeTableName = "";
	String partsTableName = "";
	String scrappedPartsTableName = "";
	Timestamp startTime = null;
	Timestamp endTime = null;
	public Integer columnQty = 0;
	
	public ArrayList<ResultTableElement> resultsRows = new ArrayList<ResultTableElement>();
	
	public ResultTable(){
		
	}
	
	public ResultTable(TableValueType tVT, SamplingInterval sI) {
		tableVT = tVT;
		samplingInterval = sI;
		configureTable(tVT, sI);
		
	}
	
	
	private void configureTable(TableValueType tableVT, SamplingInterval sI){
		switch (tableVT){
		case MACHINE: partsTableAlias = "mp";
					  scrappedPartsTableAlias = "ms";
					  typeTableAlias = "MC";
					  typeTableName = "MACHINE";
		  break;
		case PRODUCT: partsTableAlias = "pp";
					  scrappedPartsTableAlias = "ps";
					  typeTableAlias = "PRD";
					  typeTableName = "PRODUCT";
					  break;
		case MOULD: partsTableAlias = "mldp";
		  			scrappedPartsTableAlias = "mlds";
		  			typeTableAlias = "MLD";
		  			typeTableName = "MOULD";
		  			break;
		case GLOBAL: partsTableAlias = "glbp";
				   scrappedPartsTableAlias = "glbs";
				   typeTableAlias = "GLB";
				   typeTableName = "GLOBAL";
				   break;
		case SHIFT: partsTableAlias = "shftp";
			   scrappedPartsTableAlias = "shfts";
			   typeTableAlias = "SHFT";
			   typeTableName = "SHIFT";
			break; 
		case KPI:
			break;
		case KPI_AGG_TYE:
			break;
		case KPI_FORMULA:
			break;
		case KPI_TARGET:
			break;
		case KPI_VALUES:
			break;
		case SENSOR:
			break;
		default:
			break;
		}
		partsTableName = typeTableName.toLowerCase()
				+ "_parts_"+getSamplingIntervalAlias(sI);
		
		scrappedPartsTableName = typeTableName.toString().toLowerCase()
				+ "_scrapped_parts_"+getSamplingIntervalAlias(sI);

	}
	
	private String getSamplingIntervalAlias(SamplingInterval sI){
		String result = "";
		switch (sI){
		case DAILY: result = "per_day";
			break;
		case HOURLY: result = "per_hour";
			break;
		case MINUTELY: result = "per_minute";
			break;
		case MONTHLY: result = "per_month";
			break;
		case NONE: result = "global";
			break;
		case WEEKLY: result = "per_week";
			break;
		case YEARLY:result = "per_year";
			break;
		default:
			break;
		
		}
		
		return result;
	}
	
	/** *
	 * 
	 * @deprecated use {@link ResultTable#getResultTableQueryString(Integer, Timestamp, Timestamp, SamplingInterval, boolean, TableValueType, Integer)} instead.
	 * */
	@Deprecated
	public String getResultTableQueryString(Integer id, Timestamp startTime, Timestamp endTime){
		String time;
		if ( (startTime == null) && (endTime == null) ){
			time = "";
		}
		else
			time = "AND "+partsTableAlias+".DATE"+typeTableAlias+" BETWEEN TIMESTAMP('"+startTime+"') AND TIMESTAMP('"+endTime+"')";
		
		String query = "SELECT "+partsTableAlias+"."+typeTableName+", "
				 + ""+partsTableAlias+".DATE"+typeTableAlias+", "+partsTableAlias+".COUNT"+typeTableAlias+", "+scrappedPartsTableAlias+".SCR"+typeTableAlias+", ("+scrappedPartsTableAlias+".SCR"+typeTableAlias+"/"+partsTableAlias+".COUNT"+typeTableAlias+") as ScrapRate "
				 + "FROM \""+partsTableName+"\" "+partsTableAlias+" "
				 + "LEFT OUTER JOIN \""+scrappedPartsTableName+"\" "+scrappedPartsTableAlias+" "
				 + "ON "+partsTableAlias+"."+typeTableName+"="+scrappedPartsTableAlias+"."+typeTableName+" "
				 + " AND "+partsTableAlias+".DATE"+typeTableAlias+"="+scrappedPartsTableAlias+".DATE"+typeTableAlias+" "
				 + "INNER JOIN \""+typeTableName.toLowerCase()+"\" "+typeTableAlias.toLowerCase()+" "
				 + "ON "+partsTableAlias+"."+typeTableName+" = "+typeTableAlias.toLowerCase()+".\"name\" "
				 + "WHERE "+typeTableAlias.toLowerCase()+".\"id\" = '"+id+"' "
				 + time 
				 + " ORDER BY "+partsTableAlias+".DATE"+typeTableAlias+";";

		return query;
	}
	
	/** *
	 * 
	 * @deprecated use {@link ResultTable#getResultTableQueryString(Integer, Timestamp, Timestamp, SamplingInterval, boolean, TableValueType, Integer)} instead.
	 * */
	@Deprecated
	public String getResultTableQueryString(Timestamp startTime, Timestamp endTime){
		String time;
		if ( (startTime == null) && (endTime == null) ){
			time = "";
		}
		else
			time = "WHERE "+partsTableAlias+".DATE"+typeTableAlias+" BETWEEN TIMESTAMP('"+startTime+"') AND TIMESTAMP('"+endTime+"') ";

		String query = "SELECT 'Global' as Global, "+partsTableAlias+".DATE"+typeTableAlias+", "+partsTableAlias+".COUNT"+typeTableAlias+", "
				+ ""+scrappedPartsTableAlias+".SCR"+typeTableAlias+", ("+scrappedPartsTableAlias+".SCR"+typeTableAlias+"/"+partsTableAlias+".COUNT"+typeTableAlias+") as ScrapRate "
				 + "FROM \""+partsTableName+"\" "+partsTableAlias+" "
				 + "LEFT OUTER JOIN \""+scrappedPartsTableName+"\" "+scrappedPartsTableAlias+" "
				 + "ON "+partsTableAlias+".DATE"+typeTableAlias+"="+scrappedPartsTableAlias+".DATE"+typeTableAlias+" "
				 + time 
				 + " ORDER BY "+partsTableAlias+".DATE"+typeTableAlias+";";
		return query;
	}
	
	public String getResultTableQueryString(Integer kpi, Timestamp startTime, Timestamp endTime, SamplingInterval sI, boolean isGlobal, TableValueType tVtype, Integer contextId, Integer contextValueId, TableValueType secondContext){
		String query = "";
		String samplIntervalStr = getSamplingIntervalNumber(sI);
		if (isGlobal) {
		/* ** template for global ** */
//		query = "SELECT 'Global', kv.\"kpi_timestmp\" date1, \"kpi_value\" value "
//				+ "	FROM \"kpi_values\" kv"
//				+ " WHERE \"granularity_id\" = "+sIstr
//				+ " AND kv.\"kpi_timestmp\" BETWEEN TIMESTAMP('"+startTime+"') AND TIMESTAMP('"+endTime+"')"
//				+ " AND \"kpi_id\" = "+kpi+ " "
//				+ " AND \"machine_id\" IS NULL" 
//				+ " AND \"product_id\" IS NULL "
//				+ " AND \"mould_id\" IS NULL"
//				+ " AND \"shift_id\" IS NULL"
//				+ " ORDER BY date1;";
		query = "SELECT 'Global', kv.\"KPI_TIMESTMP\" date1, \"KPI_VALUE\" value "
				+ "	FROM \"KPI_VALUES\" kv"
				+ " WHERE \"GRANULARITY_ID\" = "+samplIntervalStr
				+ " AND kv.\"KPI_TIMESTMP\" BETWEEN TIMESTAMP('"+startTime+"') AND TIMESTAMP('"+endTime+"')"
				+ " AND \"KPI_ID\" = "+kpi+ " "
				+ " AND \"MACHINE_ID\" IS NULL" 
				+ " AND \"PRODUCT_ID\" IS NULL "
				+ " AND \"MOULD_ID\" IS NULL"
				+ " AND \"SHIFT_ID\" IS NULL"
				+ " ORDER BY date1;";
		}
		else {
			if (secondContext == TableValueType.NONE) {
				String contextName = getContextName(tVtype);
				String contextValueIdWhereClause = getContextValueIdWhereClause(contextValueId, contextName);
				/* ** template for per context ** */
//				query = "SELECT ct.\"name\", kv.\"kpi_timestmp\" date1, "+getAgregation(kpi)+"(\"kpi_value\") value "
//						+ " FROM \"kpi_values\" kv "
//						+ " LEFT OUTER JOIN \""+contextName+"\" ct ON \""+contextName+"_id\"=ct.\"id\" "
//						+ " WHERE \"kpi_id\" = "+kpi+" "
//						+ " AND \"granularity_id\" = "+sIstr+" "
//						+ " AND kv.\"kpi_timestmp\" BETWEEN TIMESTAMP('"+startTime+"') AND TIMESTAMP('"+endTime+"')"
//						+ " AND \""+contextName+"_id\" IS NOT NULL "
//						+ " AND ct.\"id\" = "+contextId+" "
//						+ contextValueIdWhereClause
//						+ " GROUP BY date1, ct.\"name\" "
//						+ " ORDER BY date1;";

				query = "SELECT ct.\"NAME\", kv.\"KPI_TIMESTMP\" date1, \"KPI_VALUE\" value "
						+ " FROM \"KPI_VALUES\" kv "
						+ " LEFT OUTER JOIN \""+contextName.toUpperCase()+"\" ct ON \""+contextName.toUpperCase()+"_ID\"=ct.\"ID\" "
						+ " WHERE \"KPI_ID\" = "+kpi+" "
						+ " AND \"GRANULARITY_ID\" = "+samplIntervalStr+" "
						+ " AND kv.\"KPI_TIMESTMP\" BETWEEN TIMESTAMP('"+startTime+"') AND TIMESTAMP('"+endTime+"')"
						+ " AND \""+contextName.toUpperCase()+"_ID\" = "+contextId+" "
//						+ " AND ct.\"ID\" = "+contextId+" "
//						+ contextValueIdWhereClause.toUpperCase()
//						+ " GROUP BY date1, ct.\"NAME\" "
						+ " ORDER BY date1;"; 
				
			}
			else{
				String contextName = getContextName(tVtype);
				String secondContextName = getContextName(secondContext);
				String contextValueIdWhereClause = getContextValueIdWhereClause(contextId, secondContextName);
				/* ** template for per context ** */
//				query = "SELECT ct.\"name\", kv.\"kpi_timestmp\" date1, "+getAgregation(kpi)+"(\"kpi_value\") value "
//						+ " FROM \"kpi_values\" kv "
//						+ " LEFT OUTER JOIN \""+secondContextName+"\" ct ON \""+secondContextName+"_id\"=ct.\"id\" "
//						+ " WHERE \"kpi_id\" = "+kpi+" "
//						+ " AND \"granularity_id\" = "+samplIntervalStr+" "
//						+ " AND kv.\"kpi_timestmp\" BETWEEN TIMESTAMP('"+startTime+"') AND TIMESTAMP('"+endTime+"')"
//						+ " AND \""+contextName+"_id\" IS NOT NULL "
//						+ " AND ct.\"id\" = "+contextId+" "
//						+ contextValueIdWhereClause
//						+ " GROUP BY date1, ct.\"name\" " 
//						+ " ORDER BY date1;";
				
				query = "SELECT ct.\"NAME\", kv.\"KPI_TIMESTMP\" date1, \"KPI_VALUE\" value "
						+ " FROM \"KPI_VALUES\" kv "
						+ " LEFT OUTER JOIN \""+secondContextName.toUpperCase()+"\" ct ON \""+secondContextName.toUpperCase()+"_ID\"=ct.\"ID\" "
						+ " WHERE \"KPI_ID\" = "+kpi+" "
						+ " AND \"GRANULARITY_ID\" = "+samplIntervalStr+" "
						+ " AND kv.\"KPI_TIMESTMP\" BETWEEN TIMESTAMP('"+startTime+"') AND TIMESTAMP('"+endTime+"')"
						+ " AND \""+contextName.toUpperCase()+"_ID\" = "+contextValueId+" "
//						+ " AND ct.\"ID\" = "+contextId+" "
						+ contextValueIdWhereClause.toUpperCase()
						+ " ORDER BY date1;"; 
			} 
		}
		
		return query;
	}

	
	private String getContextValueIdWhereClause(Integer contextValueId, String contextName) {
		String result = "";
		if (!contextValueId.equals(null) && contextValueId != 0){
			result = " AND \""+contextName+"_id\" = " + contextValueId;
		}
		return result;
	}

	protected String getAgregation(Integer kpi){
		String result = "";
		
		if (kpi<=3)
			result = "SUM";
//		else 
//			result = "";
		
		return result;
	}
	

	private String getContextName(TableValueType tVtype) {
		KpiDataObject kpiDO = null;
		switch (tVtype){
			case MACHINE: kpiDO = new Machine();
				break;
			case MOULD: kpiDO = new Mould();
				break;
			case PRODUCT: kpiDO = new Product();
				break;
			case SENSOR: kpiDO = new Sensor();
				break;
			case SHIFT: kpiDO = new Shift();
				break;
		}
		return kpiDO.tableName;
	}

	protected String getSamplingIntervalNumber(SamplingInterval sI) {
		String number = "";
		switch (sI){
			case MONTHLY: number = "1";
				break;
			case WEEKLY:  number = "2";
				break;		
			case DAILY:   number = "3";
				break;
			case HOURLY:  number = "4";
				break;
		}
		return number;
	}

	private String getTableValueType(){
		return tableVT.toString();
	}
	
	
	public Object toJSonObject(){
		Object jsonObject = new JSONObject();
		JSONParser parser = new JSONParser();
		String temp = "[";
		for (int i = 0; i<resultsRows.size();i++) {
			temp += resultsRows.get(i).toJSonObject()+",";
		}
		temp = temp.substring(0, temp.length()-1);
		temp +="]";
		try {
			jsonObject = parser.parse(temp);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return jsonObject;
	}
	
	public Object toJSonObject(Integer column, String[] rowsRefStr){
		Object jsonObject = new JSONObject();
		JSONParser parser = new JSONParser();
		String[] tempStr = new String[rowsRefStr.length];
		Integer refPos = -1; 
		String titleValue = "";
		
		for (int i = 0; i<resultsRows.size();i++) {
			titleValue = resultsRows.get(i).columnValues[1];
			for (int j=0;j<rowsRefStr.length;j++){
				if (titleValue.equals(rowsRefStr[j])){
					refPos=j;
					break;
				}
			}
			if (refPos != -1){
				tempStr[refPos] = resultsRows.get(i).toJSonObject(column).toString();
				refPos = -1;
			}
		}
		
		
		try {
			jsonObject = parser.parse(Arrays.toString(tempStr));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return jsonObject;
	}
	
	public Object toJsonObjectLegend(){
		Object jsonObject = new JSONObject();
		JSONParser parser = new JSONParser();
		String tempLegend = "[null]";
		
		tempLegend = "\"" + resultsRows.get(0).toJSonObject(1) + "\"";
		
		try {
			jsonObject = "\"" +parser.parse(tempLegend)+"\"";
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return jsonObject;
	}
	
	
	public String getLastNDays(Integer days) {
		String query = "SELECT COUNT(*) as CountGlb, CAST(kv.\"kpi_timestmp\" as DATE) as dateA "
					 + "FROM  \"kpi_values\" kv "
					 + "WHERE CAST(kv.\"kpi_timestmp\" AS DATE) > dateadd('day', -" + days + ", (SELECT MAX(kv.\"kpi_timestmp\") FROM \"kpi_values\" kv) ) "
					 + "GROUP BY dateA "
					 + "ORDER BY dateA";
		 
		return query;
	}
	
}
