<table class="headerTable">
	<tr>
		<td colspan=3>
			<div class="pageHeader"><b>Real time KPIs</b></div>
		</td>
	</tr>
	<tr>
		<td width=33% style="vertical-align: middle">
			<div class="pageHeader">Total units</div>
			<div class="pageHeader" id="totalUnits" style="color:#999">0</div>
		</td>
		<td width=33% align="center" style="vertical-align: middle">
			<div id="gauge" style="width: 150px; height: 120px;"></div>
		</td>
		<td style="vertical-align: middle;">
			<div class="pageHeader">OEE</div>
			<div class="progress" style="width:60%;margin:auto">
				<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">
					0%
				</div>
			</div>
		</td>
	</tr>
</table>
<table id="graphTable" class="containerColor chartTable" width="100%">
	<tr>
		<form id="chartSelector" action="">
			<td data-cInfo="context_global">
				<label onclick="insertContextSelectList()">
					<input type="radio" checked name="type" value="Global"> Global
				</label>
				<br>
			</td>
			<td data-cInfo="context_product">
				<label onclick="insertContextSelectList(1)">
					<input type="radio" name="type" value="product"> Product 
				</label>
				<span id="contextProductSelectList"></span>
				<span id="secContextProductSelectList"></span>
			</td>
			<td data-cInfo="context_machine">
				<label onclick="insertContextSelectList(2)">
					<input type="radio" name="type" value="machine"> Machine 
				</label>
					<span id="contextMachineSelectList"></span>
					<span id="secContextMachineSelectList"></span>
			</td>
			<td data-cInfo="context_shift">
				<label onclick="insertContextSelectList(3)">
					<input type="radio" name="type" value="shift"> Shift 
				</label>
				<span id="contextShiftSelectList"></span>
				<span id="secContextShiftSelectList"></span>
			</td>
			<td data-cInfo="context_mould">
				<label onclick="insertContextSelectList(4)">
					<input type="radio" name="type" value="mould"> Mould 
				</label>
				<span id="contextMouldSelectList"></span>
				<span id="secContextMouldSelectList"></span>
			</td>
		</form>
	</tr>
	<tr>
		<td id="graphCell" align="center" rowspan=2 colspan=5>
			<div id="chartTitle"></div>
			<div id="chart"></div>
		</td>
		<td class="td-dataselectionbox" >
			<b>period covered:</b>
			<br>
			<br> From:
			<br>
			<input type="text" class="inputField" id="fromDateChart" value="">
			<br> To:
			<br>
			<input type="text" class="inputField" id="toDateChart" value="">
			<br>
			<br>
			<b>Granularity:</b>
			<br>
			<br>
			<select id="granularityChart" class="box btn btn-primary form-control granularityBoxes">
				<option value="hourly">Hourly</option>
				<option value="daily">Daily</option>
				<option value="weekly" style="display:none">Weekly</option>
				<option selected value="monthly">Monthly</option>
			</select>
		</td>
	</tr>
	<tr>
		<td>
			<div align="right" class="btn-group screen;" role="group" aria-label="...">
				<button type="button" id="graphButton" class="btn btn-default">Update</button>
			</div>
		</td>
	</tr>
</table>
<br>
<div align="left">Contextual Information</div>
<table id="heatMapTable" class="containerColor chartTable" width="100%">
	<tr>
		<td width="25%">&nbsp;</td>
		<td  width="25%" style="text-align:center">
			<b>Vertical set:&emsp;</b>
			<select id="verticalSet" class="form-control form-control-custom"> 
				<option selected value="product">Product</option>
				<option value="machine">Machine</option>
				<option value="shift">Shift</option>
				<option value="mould">Mould</option>
			</select>
		</td>
		<td  width="25%" style="text-align:center">
			<b>Horizontal set:&emsp;</b>
			<select id="horizontalSet" class="form-control form-control-custom"> 
				<option value="product">Product</option>
				<option value="machine">Machine</option>
				<option selected value="shift">Shift</option>
				<option value="mould">Mould</option>
			</select>
		</td>&nbsp;<td>
	</tr>
	<tr>
		<td rowspan=2 colspan=4 align="center">
			<div id="heatMapTitle"></div>
			<div id="heatMap" class="heatmap"></div>
		</td>
		<td class="td-dataselectionbox" >
			<b>period covered:</b>
			<br>
			<br> From:
			<br>
			<input type="text" class="inputField" id="fromDateHeatMap" value="">
			<br> To:
			<br>
			<input type="text" class="inputField" id="toDateHeatMap" value="">
			<br>
			<br>
<!-- 			<b>Granularity:</b> -->
<!-- 			<br> -->
<!-- 			<br> -->
<!-- 			<select id="granularityHeatMap" class="box btn btn-primary form-control granularityBoxes"> -->
<!-- 				<option value="hourly">Hourly</option> -->
<!-- 				<option value="daily">Daily</option> -->
<!-- 				<option value="weekly">Weekly</option> -->
<!-- 				<option selected value="monthly">Monthly</option> -->
<!-- 			</select> -->
		</td>
	</tr>
	<tr>
		<td>
			<div align="right" class="btn-group screen;" role="group" aria-label="...">
				<button type="button" id="heatMapButton" class="btn btn-default">Update</button>
			</div>
		</td>
	</tr>
</table>
