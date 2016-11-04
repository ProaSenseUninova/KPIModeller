<table class="screenTable">
	<tbody>
		<tr>
			<td width="150px">
				Name
			</td>
			<td colspan="5" style="text-align:left">
				<input style="width: 430px" class="form-control" id="name" type="textbox" data-toggle="tooltip" data-placement="right" title="Enter a name for KPI (max: 45 chars)" required maxlength="45"/>
			</td>
		</tr>
		<tr>
			<td width="150px">
				Description
			</td>
			<td colspan="5" style="text-align:left">
<!-- 				<input style="width: 430px" id="description" class="form-control" type="textbox" data-toggle="tooltip" data-placement="right" title="Provide a small description (max: 255 chars)" maxlength="255" />  --> 
				<textarea id="description" rows="1" cols="1" style="width: 430px;  height: 135px;" id="description" class="form-control" type="textbox" data-toggle="tooltip" data-placement="right" title="Provide a small description (max: 255 chars)" maxlength="255"  />
			</td>
		</tr>
		<tr>
			<td>
				Calculation </option> 
			</td>
			<td colspan=5>
				<select id="calculationType" class="box grey form-control form-control-custom2 select-15">
					<option value="" disabled selected hidden>Calculation Type</option>
					<option value="simple">Simple Measure</option>
					<option value="aggregate">Aggregate Measure</option>
					<option value="composed">Composed Measure</option>
				</select>
		        <select id="numberSupport" class="box grey form-control form-control-custom2 select-15" <!--onchange="addKpiNumberSupportFormat()"--> disabled="true">
		          	<option value="" disabled selected hidden>Number Type</option>
		          	<option value="numeric">Numeric</option>
		          	<option value="boolean">Boolean</option>
		          	<option value="text">Text</option>
		          	<option value="date">Date</option>
		          	<option value="category">Category</option>
		        </select>
				<select id="companyContext" class="box grey form-control form-control-custom2 select-15">
					<option value="hella" selected>Hella Saturnus</option>
					<option value="mhwirth">MH Wirth</option>
				</select>
		        <select id="numberSupportFormat" class="form-control grey form-control-custom2 select-10" style="visibility: hidden">
		        	<option value="decimal">Decimal</option>
		    	    <option value="percentage" selected>Percentage</option>
		        </select>
		        <select id="numberSupportFormatDecimalPlaces" class="form-control form-control-custom2 select-7" style="visibility: hidden">
		          	<option value="" disabled selected>Decimal digits</option>
		        	<option value="0">0</option>
		    	    <option value="1">1</option>
		    	    <option value="2">2</option>
		        </select>
			</td>


		</tr>
		<tr class="hiddenRow simple">
			<td>
				&nbsp;
			</td>
			<td>
				<select id="selectSensor1" class="box grey sensorBox form-control form-control-custom2 select-45" >
					<option value="" disabled selected hidden>Select Sensor</option>
				</select>
				<select id="selectSensorEvent1" class="box grey eventBox eventBoxType form-control form-control-custom2 select-45">
					<option value="" disabled selected hidden>Select Event</option>
				</select>
				<label id="eventType1" class="grey eventBoxType">Type: </label>
				<!--
				<input type="text" id="eventTypeValue1" value="Event value" class="eventTypeValue eventBoxType form-control" onfocus="if(this.value=='Event value')this.value=''" onblur="if(this.value=='')this.value='Event value'">
				-->
			</td>
			<td colspan=2>
				&nbsp;
			</td>


		</tr>

		<tr class="hiddenRow aggregate">
			<td>
				&nbsp;
			</td>
			<td>
				<select id="kpiSensor1" class="box grey form-control form-control-custom2 select-45">
					<option value="" disabled selected hidden>KPI/Sensor</option>
					<option value="kpi">KPI</option>
					<option value="sensor">Sensor</option>
				</select>
			</td>
			<td>
				&nbsp;
			</td>
			<td>
				<select id="selectAggType" class="box grey form-control form-control-custom2 select-25">
					<option value="" disabled selected hidden>Select Aggregation Type</option>
					<!--<option value="minimum">Minimum</option>
					<option value="maximum">Maximum</option>
					<option value="average">Average</option>
					<option value="sum">Sum</option>
					<option value="standard_deviation">Standard Deviation</option>
					<option value="count">Count</option>-->
				</select>
			</td>
		</tr>
		<tr class="hiddenRow elAggRow">
			<td>
				&nbsp;
			</td>
			<td>
				<select id="selectSensor2" class="box grey sensorBox form-control form-control-custom2 select-45">
					<option value="" disabled selected hidden>Select Sensor</option>
				</select>
				<select id="selectSensorEvent2" class="box grey eventBox eventBoxType form-control form-control-custom2 select-45">
					<option value="" disabled selected hidden>Select Event</option>
				</select>
				<label id="eventType2" class="grey eventBoxType">Type: </label>
				<!--
				<input type="text" id="eventTypeValue2" value="Event value" class="eventTypeValue eventBoxType form-control" onfocus="if(this.value=='Event value')this.value=''" onblur="if(this.value=='')this.value='Event value'">
				-->
				<select id="selectKpi1" class="box grey kpiBox form-control form-control-custom2 select-45">
					<option value="" disabled selected hidden>Select Kpi</option>
				</select>
			</td>
			<td>
				&nbsp;
			</td>
			<td>
				&nbsp;
			</td>
		</tr>
		<tr class="hiddenRow composed">
			<td>
				&nbsp;
			</td>
			<td>
				<select id="kpiSensor2" class="box grey kpiSensor form-control form-control-custom2 select-45">
					<option value="" disabled selected hidden>KPI/Sensor</option>
					<option value="kpi">KPI</option>
					<option value="sensor">Sensor</option>
				</select>
			</td>
			<td>
				<select id="op1" class="box grey form-control form-control-custom2 select-100" style="width:80">
					<option value="" disabled selected hidden>Op</option>
					<option value="SUM">+</option>
					<option value="DIFF">-</option>
					<option value="MULTIPLY">x</option>
					<option value="DIVIDE">/</option>
				</select>
			</td>
			<td>
				<select id="kpiSensor3" class="box grey kpiSensor form-control form-control-custom2 select-45">
					<option value="" disabled selected hidden>KPI/Sensor</option>
					<option value="kpi">KPI</option>
					<option value="sensor">Sensor</option>
				</select>
			</td>
			<td>
				<select id="op2" class="box grey form-control form-control-custom2 select-45" style="visibility: hidden">
					<option value="" disabled selected hidden>Op</option>
					<option value="SUM">+</option>
					<option value="DIFF">-</option>
					<option value="MULTIPLY">x</option>
					<option value="DIVIDE">/</option>
				</select>
			</td>
			<td>
				<select id="kpiSensor4" disabled class="box grey kpiSensor thEl form-control form-control-custom2 select-45" style="visibility: hidden">
					<option value="" disabled selected hidden>KPI/Sensor</option>
					<option value="kpi">KPI</option>
					<option value="sensor">Sensor</option>
				</select>
			</td>
			
		</tr>
		<tr class="hiddenRow elRow">
			<td>
				&nbsp;
			</td>
			<td>
				<select id="selectSensor3" class="box grey sensorBox sensorChoice form-control select-45" >
					<option value="" disabled selected hidden>Select Sensor</option>
				</select>
				<select id="selectSensorEvent3" class="box grey eventBox eventBoxType form-control select-45">
					<option value="" partition="false" disabled selected hidden>Select Event</option>
				</select>
				<label id="eventType3" class="grey eventBoxType">Type: </label>
				<!--
				<input type="text" id="eventTypeValue3" value="Event value" class="eventTypeValue eventBoxType form-control" onfocus="if(this.value=='Event value')this.value=''" onblur="if(this.value=='')this.value='Event value'">
				-->
				<select id="selectKpi2" class="box grey kpiBox kpiChoice form-control select-45">
					<option value="" disabled selected hidden>Select KPI</option>
				</select>
			</td>
			<td width=40>
				&nbsp;
			</td>
			<td>
				<select id="selectSensor4" class="box grey sensorBox sensorChoice form-control select-45" >
					<option value="" disabled selected hidden>Select Sensor</option>
				</select>
				<select id="selectSensorEvent4" class="box grey eventBox eventBoxType form-control select-45">
					<option value="" partition="false" disabled selected hidden>Select Event</option>
				</select>
				<label id="eventType4" class="grey eventBoxType">Type: </label>
				<!--
				<input type="text" id="eventTypeValue4" value="Event value" class="eventTypeValue eventBoxType form-control" onfocus="if(this.value=='Event value')this.value=''" onblur="if(this.value=='')this.value='Event value'">
				-->
				<select id="selectKpi3" class="box grey kpiBox kpiChoice form-control select-45">
					<option value="" disabled selected hidden>Select KPI</option>
				</select>
			</td>
			<td width=40>
				&nbsp;
			</td>
			<td>
				<select id="selectSensor5" disabled class="box grey sensorBox form-control thEl sensorChoice select-45" >
					<option value="" disabled selected hidden>Select Sensor</option>
				</select>
				<select id="selectSensorEvent5" class="box grey eventBox eventBoxType form-control select-45">
					<option value="" partition="false" disabled selected hidden>Select Event</option>
				</select>
				<label id="eventType5" class="grey eventBoxType">Type: </label>
				<input type="text" id="eventTypeValue5" value="Event value" class="eventTypeValue eventBoxType form-control" onfocus="if(this.value=='Event value')this.value=''" onblur="if(this.value=='')this.value='Event value'">
				<select id="selectKpi4" disabled class="box grey kpiBox form-control thEl kpiChoice select-45">
					<option value="" disabled selected hidden>Select KPI</option>
				</select>
			</td>

		</tr>
		<tr class="samplingRate">
			<td>
				Sampling
			</td>
			<td>
				<input id="samplingRate" class="form-control" type="textbox" data-toggle="tooltip" data-placement="right" title="Enter a number value for sampling frequency (max: 1 digits)" required maxlength="1"/>
			</td>
			<td colspan=4>
				<select id="samplingInterval" class="box grey form-control form-control-custom2">
					<option value="" disabled selected hidden>Interval</option>
					<option value="week">Week</option>
					<option value="day">Day</option>
					<option value="hour">Hour</option>
					<option value="minute">Minute</option>
				</select>
			</td>
		</tr>
		<!--<tr>
				<td width="15%">&nbsp</td>
				<td width="37%">&nbsp</td>
				<td width="10%">&nbsp</td>
				<td width="">&nbsp</td>
			</tr>		-->
		<br>
	</tbody>
</table>
<div align="left" class="partitionSelection">Contextual Information (partition)
<table class="bottomTable containerColor2 partitionSelection">
	<tr>
		<td>
			<form id="contextualInformation">
				<input name="partition" type="radio" value="product">Product
				<br>
				<input name="partition" type="radio" value="machine">Machine
				<br>
				<input name="partition" type="radio" value="shift">Shift
				<br>
				<input name="partition" type="radio" value="mould">Mould
				<br>
				<input name="partition" id="NonePartition" type="radio" value="none" checked>None
				<br>
			</form>
			<select id="partitionOptions" class="box grey eventBoxType form-control sensorChoice select-45" >
				<option value="" disabled selected hidden>Select Partition Id</option>
			</select>
		</td>
	</tr>
</table>
</div>
<br>
<div align="right" class="btn-group screen;" role="group" aria-label="...">
	<button type="button" id="cancelBtn" class="btn btn-default">Cancel</button>
	<button type="button" id="saveBtn" class="btn btn-default">Save</button>
</div>
