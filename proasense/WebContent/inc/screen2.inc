<div align="left">Contextual Information</div>
<table class="middleTable containerColor2">
	<tr>
		<td>
			<form id="contextualInformation" >
				<input type="checkbox" style="cursor: default" value="product_id" name="Product" disabled="true">Product
				<!--  <input type="checkbox" style="cursor: default" value="product_id" name="Product" disabled="true">Product  -->
				<input type="checkbox" style="cursor: default" value="machine_id" name="Machine" disabled="true">Machine
				<input type="checkbox" style="cursor: default" value="shift_id" name="Shift" disabled="true">Shift
				<input type="checkbox" style="cursor: default" value="mould_id" name="Mould" disabled="true">Mould
			</form>
		</td>
	</tr>
</table>
<br>
<table id="targetTable" border=1 width=100%>
</table>
<br>
<table width=100%>

	<tr height=50>
		<td width="40%">
			<table id="targetList" width="60%" >
			</table>
		</td>
		<td id="lowerBoundBoxLabel" align="right" style="padding:0 1% 0 0; width:180px;">
			Lower bound
		</td>
		<td>
			<input id="lowerBoundBox" style="width: 90%; display:inline; text-align: right;" type="textbox" class="form-control">
			<div id="lowerBoundBoxDecimalSeparator" style="display:none;">.</div>
			<input id="lowerBoundBoxDecimalPlaces" style="width: 25%; display:none; text-align: left;" type="textbox" class="form-control">
		</td>
		<td id="upperBoundBoxLabel" align="right" style="padding:0 1% 0 0; width:180px;">
			Upper bound
		</td>
		<td>
			<input id="upperBoundBox" style="width: 90%; display:inline; text-align: right;" type="textbox" class="form-control">
			<div id="upperBoundBoxDecimalSeparator" style="display:none;">.</div>
			<input id="upperBoundBoxDecimalPlaces" style="width: 25%; display:none; text-align: left;" type="textbox" class="form-control">
		</td>
		<td>
			&nbsp;
		</td>

	</tr>
	<tr height=30>
		<td width="30%">
			&nbsp;
		</td>
<!-- 		<td> -->
<!-- 			Lower bound -->
<!-- 		</td> -->
<!-- 		<td> -->
			<!--  <input id="lowerBoundBox" style="width: 100%" type="textbox" class="form-control">  -->
<!-- 		</td> -->
		<td>
		</td>
	</tr>
	<tr>
		<td></td>
		<td align="right">
			<div align="right" class="btn-group screen;" role="group" aria-label="...">
				<button type="button" id="cancelBtn" class="btn btn-default">Cancel</button>
				<button type="button" id="addTargetBtn" class="btn btn-default">Add Target</button>
				<button type="button" id="editTargetBtn" class="btn btn-default" style="display:none;">Edit Target</button>
			</div>
		</td>
		<td></td>
	</tr>
</table>
</div>
