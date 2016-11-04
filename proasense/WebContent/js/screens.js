function openKPI() {
	scrQuery.closeScreen();
	$('.headerSelector').find('a').eq(0).attr('class', 'selected');
	$('.headerSelector').find('a').eq(1).attr('class', 'notSelected');
	var isScrHidden = $('.screen').css('visibility') == "hidden";
	activeScreen = screen1;
	if (!isScrHidden) {
		activeScreen.openScreen();
	}
}

function openTarget() {
	scrQuery.closeScreen();
	$('.headerSelector').find('a').eq(0).attr('class', 'notSelected');
	$('.headerSelector').find('a').eq(1).attr('class', 'selected');
	var isScrHidden = $('.screen').css('visibility') == "hidden";
	activeScreen = screen2;
	activeScreen.openScreen();
}

function openQuery() {
	$('.headerSelector').find('a').eq(0).attr('class', 'notSelected');
	$('.headerSelector').find('a').eq(1).attr('class', 'notSelected');
	$('.headerSelector').find('a').eq(2).attr('class', 'selected');
	scrQuery.openScreen();

}

function Screen1(elInfo) {
	// window.alert("screen 1 initialization");
	this.elInfo = elInfo
	var scr = this;

	$.get("inc/screen1.inc", function(content) {
		scr.content = content;
	});

	this.saveBtn = function() {
		// window.alert("screen 1 - this.kpiSensor1");
		this.saveLoadedElement();
	}
	// window.alert("screen 1 - OK");

	this.cancelBtn = function() {
		// window.alert("screen 1 - this.kpiSensor1");
		this.closeScreen();
	}
	// window.alert("screen 1 - OK");
	this.selectBoxes = function(e) {
		// window.alert("screen 1 - this.kpiSensor1");
		$('.elRow').css('display', 'none');
		$('.elAggRow').css('display', 'none');
		if ($('#calculationType').val() == 'aggregate' && $('#kpiSensor1').val() != null) {
			$('.elAggRow').css('display', 'table-row');
		} else if ($('#calculationType').val() == 'composed' && ($('#kpiSensor2').val() != null || $('#kpiSensor3').val() != null || $('#kpiSensor4').val() != null)) {
			$('.elRow').css('display', 'table-row');
		}
		$('.kpi').css('display', 'none');
		$('.simple').css('display', 'none');
		$('.aggregate').css('display', 'none');
		$('.composed').css('display', 'none')
		$('.' + e.currentTarget.value).css('display', 'table-row');
				
		$("#selectSensor1 option:eq(0)").prop('selected',true);
		$("#selectSensor2 option:eq(0)").prop('selected',true);
		$(".eventBox").hide();
		//reset all fields
		//simple		
			//reset event type
			$('#eventType1').hide();
			$('#eventType1').html("Type: ");	
			//reset textbox
			//$('#eventTypeValue1').hide();
			//$('#eventTypeValue1').attr('value',"Event value");
		//aggregate
			$('#eventType2').hide();
			$('#eventType2').html("Type: ");	
			//reset textbox
			//$('#eventTypeValue2').hide();
			//$('#eventTypeValue2').attr('value',"Event value");
		//Composed
			$('#eventType3').hide();
			$('#eventType3').html("Type: ");
			$('#eventType4').hide();
			$('#eventType4').html("Type: ");
			$('#eventType5').hide();
			$('#eventType5').html("Type: ");	
			//reset textbox
			//$('#eventTypeValue3').hide();
			//$('#eventTypeValue3').attr('value',"Event value");
			//$('#eventTypeValue4').hide();
			//$('#eventTypeValue4').attr('value',"Event value");
			//$('#eventTypeValue5').hide();
			//$('#eventTypeValue5').attr('value',"Event value");
			
		//hide partition when calculation type changes
		$('.partitionSelection').hide();
		$('#NonePartition').prop("checked",true);
		$('#partitionOptions').css('display', 'none');
		$('#partitionOptions').find('option:gt(0)').remove();
		$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
	}
	// window.alert("screen 1 - OK");
	this.kpiSensor1 = function() {
		// window.alert("screen 1 - this.kpiSensor1"); //caso do agregated
		// measure
		$('.elAggRow').css('display', 'table-row'); 
		if ($('#kpiSensor1').val() == 'sensor') {
			$('#selectSensor2').css('display', 'inline-block');
			$('#selectKpi1').css('display', 'none'); 
		} else {
			$('#selectSensor2').css('display', 'none'); 
			$('#selectKpi1').css('display', 'inline-block');
			
			$('#selectSensorEvent2').hide();
			$("#selectSensorEvent2 option:eq(0)").prop('selected',true);
			$('#eventType2').hide();
			$('#eventType2').html("Type: ");	
			//reset textbox
			//$('#eventTypeValue2').hide();
			//$('#eventTypeValue2').attr('value',"Event value");
		}

		//hide and reset partition section
		$('.partitionSelection').hide();
		$('#NonePartition').prop("checked",true);
		$('#partitionOptions').css('display', 'none');
		$('#partitionOptions').find('option:gt(0)').remove();
		$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
	}
	// window.alert("screen 1 - OK");
	this.kpiSensor = function() { // caso do composed measure
		$('.elRow').css('display', 'table-row'); // mostra a linha
		var kpiSensors = $('.kpiSensor'); //
		for (var i = 0; i < kpiSensors.length; i++) {
			if (kpiSensors.eq(i).val() == 'sensor') {				
				$('.sensorChoice').eq(i).css('display', 'inline-block');
				$('.kpiChoice').eq(i).css('display', 'none');
				
			} else if (kpiSensors.eq(i).val() == 'kpi') {
				$('.kpiChoice').eq(i).css('display', 'inline-block');
				$('.sensorChoice').eq(i).css('display', 'none');
				
				//selector have a diferent id (-1) (slice(-1)->get last element)
				var id = parseInt(event.target.id.slice(-1))+1;
								
				$('#selectSensorEvent'+id).hide();
				$("#selectSensorEvent"+id+" option:eq(0)").prop('selected',true);
				$('#eventType'+id).hide();
				$('#eventType'+id).html("Type: ");	
				//reset textbox
				$('#eventTypeValue'+id).hide();
				//$('#eventTypeValue'+id).attr('value',"Event value");
			}
		}
	}
	
	this.loadEventProperties = function(asynchronous) {
	

		var context = $('#companyContext').val();
		
		switch ($('#calculationType').val()) {
		case 'simple':
			
			var sensorId = $('#selectSensor1').val();
			// get sensor events
			$.ajax({
				url : restAddress + 'proasense_hella/sensorProperties/'
						+ sensorId+"_"+context,
				type : 'GET',
				async: asynchronous ,
				success : function(events) {

					$('#selectSensorEvent1').find('option:gt(0)').remove();
					$('#selectSensorEvent1').append('<option value="" disabled selected hidden>Select Event</option>');					
					for (var i = 0; i < events.length; i++) {
						$('#selectSensorEvent1').append(
								'<option type=' + events[i].type
										+ ' partition=' + events[i].partition
										+ '>' + events[i].name + '</option>');
					}
				}
			});
			$('#selectSensorEvent1').css('display', 'block');
			
			//reset event type
			$('#eventType1').hide();
			$('#eventType1').html("Type: ");	
			//reset textbox
			//$('#eventTypeValue1').hide();
			//$('#eventTypeValue1').attr('value',"Event value");	

			//reset partition option
			$('.partitionSelection').hide();
			$('#NonePartition').prop("checked",true);
			$('#partitionOptions').css('display', 'none');
			$('#partitionOptions').find('option:gt(0)').remove();
			$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
			break;
		case 'aggregate':

			var sensorId = $('#selectSensor2').val();
			// get sensor events
			$.ajax({
				url : restAddress + 'proasense_hella/sensorProperties/'
						+ sensorId+"_"+context,
				type : 'GET',
				async: asynchronous ,
				success : function(events) {

					$('#selectSensorEvent2').find('option:gt(0)').remove();
					$('#selectSensorEvent2').append('<option value="" disabled selected hidden>Select Event</option>');					
					for (var i = 0; i < events.length; i++) {
						$('#selectSensorEvent2').append(
								'<option type=' + events[i].type
										+ ' partition=' + events[i].partition
										+ '>' + events[i].name + '</option>');
					}
				}
			});
			$('#selectSensorEvent2').css('display', 'block');
			
			//reset event type
			$('#eventType2').hide();
			$('#eventType2').html("Type: ");	
			//reset textbox
			//$('#eventTypeValue2').hide();
			//$('#eventTypeValue2').attr('value',"Event value");

			//reset partition option
			$('.partitionSelection').hide();
			$('#NonePartition').prop("checked",true);
			$('#partitionOptions').css('display', 'none');
			$('#partitionOptions').find('option:gt(0)').remove();
			$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
			break;
		case 'composed':
			
			var id = event.target.id.slice(-1);
			
			var sensorId = $('#selectSensor'+id).val();
			// get sensor events
			$.ajax({
				url : restAddress + 'proasense_hella/sensorProperties/'
						+ sensorId+"_"+context,
				type : 'GET',
				async: asynchronous ,
				success : function(events) {

					$('#selectSensorEvent'+id).find('option:gt(0)').remove();
					$('#selectSensorEvent'+id).append('<option value="" disabled selected hidden>Select Event</option>');					
					for (var i = 0; i < events.length; i++) {
						$('#selectSensorEvent'+id).append(
								'<option type=' + events[i].type
										+ ' partition=' + events[i].partition
										+ '>' + events[i].name + '</option>');
					}
				}
			});
			$('#selectSensorEvent'+id).css('display', 'block');
			
			//reset event type
			$('#eventType'+id).hide();
			$('#eventType'+id).html("Type: ");	
			//reset textbox
			//$('#eventTypeValue'+id).hide();
			//$('#eventTypeValue'+id).attr('value',"Event value");
			break;
		default:
			window.alert('default load sensor');
		}
	}

	
	this.loadEventPropertiesSync = function(id) {	
		
		var sensorId = $('#selectSensor'+id).val();
		var context = $('#companyContext').val();
		
		// get sensor events
		$.ajax({
			url : restAddress + 'proasense_hella/sensorProperties/'
					+ sensorId+"_"+context,
			type : 'GET',
			async: false ,
			success : function(events) {

				$('#selectSensorEvent'+id).find('option:gt(0)').remove();
				$('#selectSensorEvent'+id).append('<option value="" disabled selected hidden>Select Event</option>');					
				for (var i = 0; i < events.length; i++) {
					$('#selectSensorEvent'+id).append(
							'<option type=' + events[i].type
									+ ' partition=' + events[i].partition
									+ '>' + events[i].name + '</option>');
				}
			}
		});
		$('#selectSensorEvent'+id).css('display', 'block');
		
		//reset event type
		$('#eventType'+id).hide();
		$('#eventType'+id).html("Type: ");	
		//reset textbox
		//$('#eventTypeValue'+id).hide();
		//$('#eventTypeValue'+id).attr('value',"Event value");
	
	}
	this.changeTypeAndPartition = function() {
		var sensorEventPartitionable;
		switch ($('#calculationType').val()) {
		case 'simple':

			var sensorEventType = $('#selectSensorEvent1').find(":selected").attr("type");
			if(sensorEventType!=null)
				sensorEventPartitionable = $('#selectSensorEvent1').find(":selected").attr("partition").toUpperCase();

			$('#eventType1').css('display', 'block')
			$('#eventType1').html('Type: '+sensorEventType);
			//enable textBox
			//$('#eventTypeValue1').css('display', 'block');
			//$('#eventTypeValue1').attr('value',"Event value");
			
			if (sensorEventPartitionable == "TRUE") {
				$('.partitionSelection').show();
			} else {
				$('.partitionSelection').hide();
				$('#NonePartition').prop("checked",true);
				$('#partitionOptions').css('display', 'none');
				$('#partitionOptions').find('option:gt(0)').remove();
				$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
			}
			break;
		case 'aggregate':

			var sensorEventType = $('#selectSensorEvent2').find(":selected").attr("type");
			sensorEventPartitionable = $('#selectSensorEvent2').find(":selected").attr("partition").toUpperCase();

			$('#eventType2').css('display', 'block')
			$('#eventType2').html('Type: '+sensorEventType);
			//enable textBox
			//$('#eventTypeValue2').css('display', 'block');
			//$('#eventTypeValue2').attr('value',"Event value");
			
			if (sensorEventPartitionable == "TRUE") {
				$('.partitionSelection').show();
			} else {
				$('.partitionSelection').hide();
				$('#NonePartition').prop("checked",true);
				$('#partitionOptions').css('display', 'none');
				$('#partitionOptions').find('option:gt(0)').remove();
				$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
			}
			break;
		case 'composed':

			var id = event.target.id.slice(-1);
			
			var sensorEventType = $('#selectSensorEvent'+id).find(":selected").attr("type");
			
			if($('.partitionSelection').is(":visible")){
				if($('#selectSensorEvent3').find(":selected").attr("partition").toUpperCase()== "FALSE"
						&& $('#selectSensorEvent4').find(":selected").attr("partition").toUpperCase()== "FALSE"
							&& $('#selectSensorEvent5').find(":selected").attr("partition").toUpperCase()== "FALSE"){
							$('.partitionSelection').hide();
							$('#NonePartition').prop("checked",true);
							$('#partitionOptions').css('display', 'none');
							$('#partitionOptions').find('option:gt(0)').remove();
							$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
						}
			}else
				if($('#selectSensorEvent'+id).find(":selected").attr("partition").toUpperCase()== "TRUE")
					$('.partitionSelection').show();
			
			$('#eventType'+id).css('display', 'block')
			$('#eventType'+id).html('Type: '+sensorEventType);
			//enable textBox
			//$('#eventTypeValue'+id).css('display', 'block');
			//$('#eventTypeValue'+id).attr('value',"Event value");
			break;
		default:
			window.alert('default partition');
		}
		
	}
	
this.changeTypeAndPartitionAsync = function(id) {	
		
	var sensorEventType = $('#selectSensorEvent'+id).find(":selected").attr("type");
	
	if($('.partitionSelection').is(":visible")){
		if($('#selectSensorEvent3').find(":selected").attr("partition").toUpperCase()== "FALSE"
				&& $('#selectSensorEvent4').find(":selected").attr("partition").toUpperCase()== "FALSE"
					&& $('#selectSensorEvent5').find(":selected").attr("partition").toUpperCase()== "FALSE"){
					$('.partitionSelection').hide();
					$('#NonePartition').prop("checked",true);
					$('#partitionOptions').css('display', 'none');
					$('#partitionOptions').find('option:gt(0)').remove();
					$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
				}
	}else
		if($('#selectSensorEvent'+id).find(":selected").attr("partition").toUpperCase()== "TRUE")
			$('.partitionSelection').show();
	
	$('#eventType'+id).css('display', 'block');
	$('#eventType'+id).html('Type: '+sensorEventType);
	//enable textBox
	//$('#eventTypeValue'+id).css('display', 'block');
	//$('#eventTypeValue'+id).attr('value',"Event value");
	
	}

	this.changePartitionIDs = function(asynchronous) {

		var partitionType = $('input[name=partition]:checked', '#contextualInformation').val()
		if(partitionType == "none"){
			$('#partitionOptions').css('display', 'none');
			$('#partitionOptions').find('option:gt(0)').remove();
			$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
		}
		else{
			// get sensor events
			$.ajax({
				url : restAddress + 'proasense_hella/partitionType/'
						+ partitionType,
				async: asynchronous ,
				type : 'GET',
				success : function(events) {

					$('#partitionOptions').find('option:gt(0)').remove();
					$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition Id</option>');					
					for (var i = 0; i < events.length; i++) {
						$('#partitionOptions').append(
								'<option value=' + events[i].id
										+ '>' + events[i].id + '</option>');
					}
				}
			});
			$('#partitionOptions').css('display', 'block');
		}
	}
	
	// window.alert("screen 1 - OK");
	this.loadSensors = function() {
		
		// load dos sensores
		var tmpVal = [];
		for (var i = 0; i < $('.sensorBox').length; i++) {
			tmpVal.push($('.sensorBox').eq(i).val());
		}
		$('.sensorBox').find('option:gt(0)').remove();
		if(sensors!=null){
			for (var i = 0; i < sensors.length; i++) {
				$('.sensorBox').append('<option value=' + sensors[i].id + '>' + sensors[i].name + '</option>');
			}
			for (var i = 0; i < $('.sensorBox').length; i++) {
				$('.sensorBox').eq(i).val(tmpVal[i]);
			}
		}

		$('.sensorBox').prop( "disabled", false );
		$('#companyContext').prop( "disabled", false );
	}
	this.loadAggregationTypes = function() {
		// load dos tipos de aggregation
		var tmpVal = [];
		for (var i = 0; i < $('#selectAggType').length; i++) {
			tmpVal.push($('#selectAggType').eq(i).val());
		}
		$('#selectAggType').find('option:gt(0)').remove();
		//starts on 1 to ignore de "none" value from the DB
		for (var i = 1; i < aggTypes.length; i++) {
			$('#selectAggType').append(
					'<option id=' + aggTypes[i].id + '>' + aggTypes[i].aggregation
							+ '</option>');
		}
		for (var i = 0; i < $('#selectAggType').length; i++) {
			$('#selectAggType').eq(i).val(tmpVal[i]);
		}
	}	
	this.loadSamplingIntervals = function() {
		// load dos tipos de aggregation
		var tmpVal = [];
		for (var i = 0; i < $('#samplingInterval').length; i++) {
			tmpVal.push($('#samplingInterval').eq(i).val());
		}
		$('#samplingInterval').find('option:gt(0)').remove();
		for (var i = 0; i < sampInt.length; i++) {
			$('#samplingInterval').append(
					'<option id=' + sampInt[i].id + ' value=' + sampInt[i].name + '>' + sampInt[i].name
							+ '</option>');
		}
		for (var i = 0; i < $('#samplingInterval').length; i++) {
			$('#samplingInterval').eq(i).val(tmpVal[i]);
		}
	}
	// window.alert("screen 1 - OK also");
	this.loadKpis = function() {
		var tmpVal = [];
		for (var i = 0; i < $('.kpiBox').length; i++) {
			tmpVal.push($('.kpiBox').eq(i).val());
		}
		$('.kpiBox').find('option:gt(0)').remove();
		for (var i = 0; i < this.kpiInfo.length; i++) {
			$('.kpiBox').append('<option value=' + this.kpiInfo[i].id + '>' + this.kpiInfo[i].name + '</option>');
		}
		for (var i = 0; i < $('.kpiBox').length; i++) {
			$('.kpiBox').eq(i).val(tmpVal[i]);
		}
	}

	// window.alert("screen 1 - OK");
	this.checkConstraints = function(id) {
		for (var i = 0; i < kpiFormulas.length; i++) {
			if (kpiFormulas[i].kpi_id == id) {
				continue;
			}
			if (kpiFormulas[i].term1_kpi_id == id
					|| kpiFormulas[i].term2_kpi_id == id
					|| kpiFormulas[i].term3_kpi_id == id) {
				return true;
			}
		}
		return false;
	}
	
	this.checkParentConstraints = function(id) {
		for (var i = 0; i < kpiInfo.length; i++) {
			if (kpiInfo[i].kpi_id == id) {
				continue;
			}
			if (kpiInfo[i].parent_id == id) {
				return true;
			}
		}
		return false;
	}	
	
	// window.alert("screen 1 - OK");	
	this.changeContextEnt = function(){
		
		var myContext = $('#companyContext').val();
		$('.sensorBox').prop( "disabled", true );
		$('#companyContext').prop( "disabled", true );
					
		$('.elRow').css('display', 'none');
		$('.elAggRow').css('display', 'none');
		if ($('#calculationType').val() == 'aggregate' && $('#kpiSensor1').val() != null) {
			$('.elAggRow').css('display', 'table-row');
		} else if ($('#calculationType').val() == 'composed' && ($('#kpiSensor2').val() != null || $('#kpiSensor3').val() != null || $('#kpiSensor4').val() != null)) {
			$('.elRow').css('display', 'table-row');
		}
		$('.kpi').css('display', 'none');
		$('.simple').css('display', 'none');
		$('.aggregate').css('display', 'none');
		$('.composed').css('display', 'none')
		$('.' + ($('#calculationType').val())).css('display', 'table-row');
				
		$("#selectSensor1 option:eq(0)").prop('selected',true);
		$("#selectSensor2 option:eq(0)").prop('selected',true);
		$(".eventBox").hide();
		//reset all fields
		//simple		
			//reset event type
			$('#eventType1').hide();
			$('#eventType1').html("Type: ");	
			//reset textbox
			//$('#eventTypeValue1').hide();
			//$('#eventTypeValue1').attr('value',"Event value");
		//aggregate
			$('#eventType2').hide();
			$('#eventType2').html("Type: ");	
			//reset textbox
			//$('#eventTypeValue2').hide();
			//$('#eventTypeValue2').attr('value',"Event value");
		//Composed
			$('#eventType3').hide();
			$('#eventType3').html("Type: ");
			$('#eventType4').hide();
			$('#eventType4').html("Type: ");
			$('#eventType5').hide();
			$('#eventType5').html("Type: ");	
			//reset textbox
			//$('#eventTypeValue3').hide();
			//$('#eventTypeValue3').attr('value',"Event value");
			//$('#eventTypeValue4').hide();
			//$('#eventTypeValue4').attr('value',"Event value");
			//$('#eventTypeValue5').hide();
			//$('#eventTypeValue5').attr('value',"Event value");
			
		//hide partition when calculation type changes
		$('.partitionSelection').hide();
		$('#NonePartition').prop("checked",true);
		$('#partitionOptions').css('display', 'none');
		$('#partitionOptions').find('option:gt(0)').remove();
		$('#partitionOptions').append('<option value="" disabled selected hidden>Select Partition ID</option>');
		
		$.ajax({
			url : restAddress + 'proasense_hella/sensor/'
					+ myContext,
			type : 'GET',
			success : function(sensors) {
								
				var tmpVal = [];
				for (var i = 0; i < $('.sensorBox').length; i++) {
					tmpVal.push($('.sensorBox').eq(i).val());
				}
				
				$('.sensorBox').find('option:gt(0)').remove();
				if(sensors!=null){
					for (var i = 0; i < sensors.length; i++) {
						$('.sensorBox').append('<option value=' + sensors[i].id + '>' + sensors[i].name + '</option>');
					}
					for (var i = 0; i < $('.sensorBox').length; i++) {
						$('.sensorBox').eq(i).val(tmpVal[i]);
					}
				}
				

				$('.sensorBox').prop( "disabled", false );
				$('#companyContext').prop( "disabled", false );
			}
		});
	}
	
	this.openScreen = function() {

		$('.content').html(this.content);
		showScreen(true);
		$('#cancelBtn').on('click', function(event) {
			scr.cancelBtn();
		});
		$('#saveBtn').on('click', function(event) {
			scr.saveBtn();
		});
		$('#calculationType').change(this.selectBoxes);
		$('.kpiSensor').change(this.kpiSensor);
		$('#kpiSensor1').change(this.kpiSensor1);
		$('.sensorBox').change(this.loadEventProperties);
		$('.eventBox').change(this.changeTypeAndPartition); 
		$('#companyContext').change(this.changeContextEnt);
		$('#contextualInformation').change(this.changePartitionIDs);
		$('#op2').change(this.thirdElement);
		this.loadSensors();
		this.loadAggregationTypes();
		this.loadSamplingIntervals();
		this.loadKpis();

		$('.box').change(function(e) {
			$(e.currentTarget).css('color', 'black');
		});
		if (loadedKpi != "") {
			this.loadElData(loadedKpi)
		} else {
			//add new kpi
		
		}		
		initializeTooltips();
	}
	// window.alert("screen 1 - OK 2");
	this.thirdElement = function() {
		var els = $('.thEl');
		if ($('#op2').val() == 'none') {
			els.attr('disabled', true);
			els.css('color', '#808080');
		} else {

			els.attr('disabled', false);
			for (var i = 0; i < els.length; i++) {
				if (els.eq(i).val() != null) {
					els.eq(i).css('color', 'black');
				}
			}
		}
	}
	// window.alert("screen 1 - OK");

	this.closeScreen = function() {
		this.changeLoadedKpi();
		showScreen(false);
		$('.content').html('');
	}

	// window.alert("screen 1 - OK 3");
	this.updateField = function(id, value) {
		$('#' + id).val(value);
		if (value !== null) {
			$('#' + id).css('color', 'black');
		}
	}
	
	//window.alert("screen 1 - OK 4");
	this.loadElData = function(elId) {
		for (var i = 0; i < this.kpiInfo.length; i++) {
			if (this.kpiInfo[i].id == elId) {
				//this.changeLoadedKpi(elId);
				
				el = this.kpiInfo[i];
				this.updateField('name', el.name);
				this.updateField('description', el.description);
				this.updateField('samplingRate', el.sampling_rate);
				this.updateField('samplingInterval', el.sampling_interval);
				
				this.updateField('calculationType', el.calculation_type);
						
				$('#numberSupport').prop("disabled",false);
				$('#numberSupport option[value="'+ el.number_support.toLowerCase() +'"]').prop('selected',true);
				
				$('#companyContext option[value="'+ el.company_context +'"]').prop('selected',true);
				$.ajax({
					url: restAddress + 'proasense_hella/sensor/'+el.company_context,
					type: 'GET',
					async: false,
					success: function(data) {
						$("#companyContext").prop( "disabled", false);
						sensors = data;
						screen1.loadSensors();
					}
				});
				
				var kpiFormula = {};
				for (var j = 0; j < kpiFormulas.length; j++) {
					if (kpiFormulas[j].kpi_id == el.id) {
						kpiFormula = kpiFormulas[j];
						break;
					}
				}
				
				//show partition control variable
				var showpartition = false;
				
				//show correct calculation type
				$('.' + el.calculation_type).css('display', 'table-row');
				
				switch(el.calculation_type){
				
				case 'simple':
					
					//get sensor configurations
					var sEnv = {};
					for(var idx = 0 ; idx < sensorEvents.length ; idx++)
						if(sensorEvents[idx].id == kpiFormula.term1_sensor_id){
							sEnv = sensorEvents[idx];
							break;
						}
														
					//this.updateField('selectSensor1',sEnv.sensorname);
					$('#selectSensor1 option[value="'+ sEnv.sensorid +'"]').prop('selected',true);
					//get sensor properties
					this.loadEventProperties(false);
					//set event
					$('#selectSensorEvent1').val(sEnv.eventname).prop('selected',true);
					this.changeTypeAndPartition();					
					//this.updateField('eventTypeValue1', sEnv.eventtypevalue);
					
					if(sEnv.eventpartition != null)
						showpartition = true;
					
					break;
				case 'aggregate':
				
					$('#selectAggType option[id="'+ el.aggregation +'"]').prop('selected',true);
					
					if(kpiFormula.term1_sensor_id != null){
						
						//sensor based
						$('#kpiSensor1 option[value="sensor"]').prop('selected',true);
						this.kpiSensor1();
						//get sensor configurations
						var sEnv = {};
						for(var idx = 0 ; idx < sensorEvents.length ; idx++)
							if(sensorEvents[idx].id == kpiFormula.term1_sensor_id){
								sEnv = sensorEvents[idx];
								break;
						}
						
						//this.updateField('selectSensor1',sEnv.sensorname);
						$('#selectSensor2 option[value="'+ sEnv.sensorid +'"]').prop('selected',true);
						//get sensor properties
						this.loadEventProperties(false);
						//set event
						$('#selectSensorEvent2').val(sEnv.eventname).prop('selected',true);
						this.changeTypeAndPartition();					
						//this.updateField('eventTypeValue2', sEnv.eventtypevalue);
					}else{
						//kpi based
						$('#kpiSensor1 option[value="kpi"]').prop('selected',true);
						this.kpiSensor1();
						
						//choose the correspondent kpi 
						$('#selectKpi1 option[value="'+ kpiFormula.term1_kpi_id +'"]').prop('selected',true);
						
					}
					if(sEnv != null)				
						if(sEnv.eventpartition != null)
							showpartition = true;
					
					break;
				case 'composed':
												
					if(kpiFormula.term1_sensor_id != null){
						
						//sensor based
						$('#kpiSensor2 option[value="sensor"]').prop('selected',true);
						this.kpiSensor();
						//get sensor configurations
						var sEnv = {};
						for(var idx = 0 ; idx < sensorEvents.length ; idx++)
							if(sensorEvents[idx].id == kpiFormula.term1_sensor_id){
								sEnv = sensorEvents[idx];
								break;
						}						
						//this.updateField('selectSensor1',sEnv.sensorname);
						$('#selectSensor3 option[value="'+ sEnv.sensorid +'"]').prop('selected',true);
						//get sensor properties
						this.loadEventPropertiesSync(3);
						//set event
						$('#selectSensorEvent3').val(sEnv.eventname).prop('selected',true);
						this.changeTypeAndPartitionAsync(3);					
						//this.updateField('eventTypeValue2', sEnv.eventtypevalue);
					}else{
						//kpi based
						$('#kpiSensor2 option[value="kpi"]').prop('selected',true);
						this.kpiSensor();
						
						//choose the correspondent kpi 
						$('#selectKpi2 option[value="'+ kpiFormula.term1_kpi_id +'"]').prop('selected',true);
					}
					
					if(kpiFormula.operator_1.length == 1)
						$('#op1 option:contains("'+ kpiFormula.operator_1 +'")').prop('selected',true);
					else
						$('#op1 option[value="'+ kpiFormula.operator_1 +'"]').prop('selected',true);
					
					if(kpiFormula.term2_sensor_id != null){
						
						//sensor based
						$('#kpiSensor3 option[value="sensor"]').prop('selected',true);
						this.kpiSensor();
						//get sensor configurations
						var sEnv = {};
						for(var idx = 0 ; idx < sensorEvents.length ; idx++)
							if(sensorEvents[idx].id == kpiFormula.term2_sensor_id){
								sEnv = sensorEvents[idx];
								break;
						}

						//this.updateField('selectSensor1',sEnv.sensorname);
						$('#selectSensor4 option[value="'+ sEnv.sensorid +'"]').prop('selected',true);
						//get sensor properties
						this.loadEventPropertiesSync(4);
						//set event
						$('#selectSensorEvent4').val(sEnv.eventname).prop('selected',true);
						this.changeTypeAndPartitionAsync(4);					
						//this.updateField('eventTypeValue2', sEnv.eventtypevalue);
					}else{
						//kpi based
						$('#kpiSensor3 option[value="kpi"]').prop('selected',true);
						this.kpiSensor();
						
						//choose the correspondent kpi
						$('#selectKpi3 option[value="'+ kpiFormula.term2_kpi_id +'"]').prop('selected',true);
						
					}
					
					if(sEnv != null)
						if(sEnv.eventpartition != null)
							showpartition = true;
					
					break;
				default:
					alert("error in calculation type!!");
					break;
				
				}
				
				if(showpartition){
					var chk = $('#contextualInformation input');
					if(el.context_product){
						chk[0].checked = true;
						
					}else if(el.context_machine){
						chk[1].checked = true;
					
					}else if(el.context_shift){
						chk[2].checked = true;
					
					}else if(el.context_mould){
						chk[3].checked = true;
						
					}else{
						chk[4].checked = true;
						return true;
					}
					     
					this.changePartitionIDs(false);
					$('#partitionOptions').val(sEnv.partitionid).prop('selected',true);
				}
				
				return true;
			}
		}
		return false;
	}

	//window.alert("screen 1 - OK");

	this.changeLoadedKpi = function(elId) /***/
	{
		var oldId = loadedKpi;
		loadedKpi = arguments.length > 0 ? elId : ""; //arguments is 1 unit lenght and it's the kpi ID
		var tree = $("#KPITree").jstree(true);
		var toDelete = true;
		for (var i = 0; i < this.kpiInfo.length; i++) {
			if (oldId == this.kpiInfo[i].id) {
				toDelete = false;
				break;
			}
		}
		if (toDelete) {
			tree.delete_node(oldId);
			if (arguments.length > 0) {
				if (!tree.get_text(elId).endsWith('</span>')) {
					tree.edit(elId);
				}
			}
		}
	}
	// window.alert("screen 1 - OK");
	this.getKpiFormula = function(kpi, kpiFormula) {
		if (kpi.calculation_type == 'simple') {
			//alert("pedido de sensor 1");
			//kpiFormula.term1_sensor_id = parseInt($('#selectSensor1').val());
		} else if (kpi.calculation_type == 'aggregate') {
			if ($('#kpiSensor1').val() == 'kpi') {
				//kpiFormula.term1_kpi_id = parseInt($('#selectKpi1').val());
			} else {
				alert("pedido de sensor 2");
				//kpiFormula.term1_sensor_id = parseInt($('#selectSensor2').val());
			}
			//kpiFormula.operator_1 = $('#selectAggType').val();

		} else if (kpi.calculation_type == 'composed') {
			if ($('#kpiSensor2').val() == 'kpi') {
				kpiFormula.term1_kpi_id = parseInt($('#selectKpi2').val());
			} else {
				kpiFormula.term1_sensor_id = parseInt($('#selectSensor3').val());
			}
			if ($('#kpiSensor3').val() == 'kpi') {
				kpiFormula.term2_kpi_id = parseInt($('#selectKpi3').val());
			} else {
				kpiFormula.term2_sensor_id = parseInt($('#selectSensor4').val());
			}
			kpiFormula.operator_1 = $('#op1').val();
			if ($('#op2').val() != 'none') {
				kpiFormula.operator_2 = $('#op2').val();
				if ($('#kpiSensor4').val() == 'kpi') {
					kpiFormula.term3_kpi_id = parseInt($('#selectKpi4').val());
				} else {
					kpiFormula.term3_sensor_id = parseInt($('#selectSensor5')
							.val());
				}
			}
		}
		return kpiFormula;
	}
	// window.alert("screen 1 - OK lsdjs");
	this.saveLoadedElement = function() {
		
		var kpi = {};
		var kpiFormula = {};
		var kpiIndex = "";
		var kpiFormulaIndex = "";
		var kpiFormulaId = {};
		var sensorKpi = {};
		var sensorKpi2 = {};
		var kpiInformation = {};
		
		if (loadedKpi != "") {
			
			$('html').block({
				'message' : null
			});
			
			for (var i = 0; i < kpiInfo.length; i++) {
				if (kpiInfo[i].id == loadedKpi) {
					kpi = $.extend( {}, kpiInfo[i]);
					kpiIndex = i;
					break;
				}
			}
			
			for (var i = 0; i < kpiFormulas.length; i++) {
				if (kpiFormulas[i].kpi_id == loadedKpi) {
					kpiFormula = $.extend( {}, kpiFormulas[i]);
					kpiFormulaIndex = i;
					break;
				}
			}
			
			kpi.name = $('#name').val();
			kpi.text = $('#name').val() + delEditBtn;
			kpi.description = $('#description').val();
			kpi.calculation_type = $('#calculationType').val();
			kpi.sampling_rate = parseInt($('#samplingRate').val());
			kpi.sampling_interval = $('#samplingInterval').val();
			
			var samplingRate = parseInt($('#samplingRate').val());
			
			var chk = $('#contextualInformation input');
			kpi.context_product = chk[0].checked;
			kpi.context_machine = chk[1].checked;
			kpi.context_shift = chk[2].checked;
			kpi.context_mould = chk[3].checked;
			
			if(kpi.calculation_type != "aggregate"){
				kpi.aggregation = 1;
				kpiInformation.aggregationName = "NONE";
			}
			else{
				if($('#selectAggType').val()==null){
					$.notify('Please choose the aggregation type', 'info');
					return;
				}else{
					kpi.aggregation = $('#selectAggType').find(":selected").attr("id");
					kpiInformation.aggregationName = $('#selectAggType').find(":selected").text();		
				}
			}
			
			kpi.number_support = $('#numberSupport').val().toUpperCase();

			kpi.company_context = $('#companyContext').val();
			
			var senEnvIds2Delup = [];
			var senEnvErrorUp = [];
			
			switch(kpi.calculation_type){
			case "simple":
				
				kpiFormula.term1_kpi_id = null;
				kpiFormula.operator_1 = null;
				kpiFormula.term2_kpi_id = null;
				
				if(kpiFormula.term2_sensor_id != null)
					senEnvIds2Delup.push(kpiFormula.term2_sensor_id);
				kpiFormula.term2_sensor_id = null;
				
				sensorIDvalue = $('#selectSensor1').find(":selected").attr("value");
				eventNAMEvalue = $('#selectSensorEvent1').find(":selected").attr("value");
				
				if(sensorIDvalue == null){
					$.notify('Choose a sensor');
					return;
				}
				if(eventNAMEvalue == null){
					$.notify('Choose an event');
					return;
				}
				
				var SensorID = null;
				var EventName = null;
				for(var idx = 0 ; idx < sensorEvents.length ; idx++)
					if(sensorEvents[idx].id == kpiFormula.term1_sensor_id){
						SensorID = sensorEvents[idx].sensorid;
						EventName = sensorEvents[idx].eventname;
						break;
					}
				
				if(SensorID != sensorIDvalue || (SensorID == sensorIDvalue && EventName != eventNAMEvalue)){	

					if(kpiFormula.term1_sensor_id != null)	
						senEnvIds2Delup.push(kpiFormula.term1_sensor_id);

					sensorKpi.sensorid = $('#selectSensor1').find(":selected").attr("value");
					sensorKpi.sensorname = $('#selectSensor1').find(":selected").text();
					sensorKpi.eventname = $('#selectSensorEvent1').find(":selected").text();
					sensorKpi.eventtype = $('#selectSensorEvent1').find(":selected").attr("type");
					//sensorKpi.eventtypevalue = $('#eventTypeValue1').val();
					sensorKpi.eventpartition = $('#selectSensorEvent1').find(":selected").attr("partition");
					if(sensorKpi.eventpartition == "true")
						sensorKpi.partitionid = $('#partitionOptions').find(":selected").attr("value");
					else
						sensorKpi.partitionid = "none";
					sensorKpi.sampling_rate = isNaN(samplingRate) ? 0 : samplingRate;
					sensorKpi.sampling_interval = $('#samplingInterval').val();
					
					
					$.ajax({
						url : restAddress
								+ 'proasense_hella/sensorevent',
						type : 'POST',
						async: false ,
						data : '{"type":"INSERT","data":['
								+ JSON
										.stringify(sensorKpi)
								+ ']}',
						success : function(result) {
							$('html').unblock();
							if (result.succeeded) {
								
								kpiFormula.term1_sensor_id = result.insertId[0];
								sensorKpi.id = result.insertId[0];
								
								senEnvErrorUp.push(sensorKpi);
							}
							else{
								$.notify('Error adding sensor 1');
								return
							}
						}
					});
				}
				break;
			case "aggregate":
				
				kpiFormula.operator_1 = null;
				kpiFormula.term2_kpi_id = null;
				
				if(kpiFormula.term2_sensor_id != null)
					senEnvIds2Delup.push(kpiFormula.term2_sensor_id);
				kpiFormula.term2_sensor_id = null;

				if($('#kpiSensor1').val() == 'sensor'){
					
					kpiFormula.term1_kpi_id = null;
					
					sensorIDvalue = $('#selectSensor2').find(":selected").attr("value");
					eventNAMEvalue = $('#selectSensorEvent2').find(":selected").attr("value");
										
					if(sensorIDvalue == null){
						$.notify('Choose a sensor');
						return;
					}
					if(eventNAMEvalue == null){
						$.notify('Choose an event');
						return;
					}
					
//					var SensorID = null;
//					var EventName = null;
//					for(var idx = 0 ; idx < sensorEvents.length ; idx++)
//						if(sensorEvents[idx].id == kpiFormula.term1_sensor_id ){
//							SensorID = sensorEvents[idx].sensorid;
//							EventName = sensorEvents[idx].eventname;
//							break;
//						}
//
//					if(SensorID != sensorIDvalue || (SensorID == sensorIDvalue && EventName != eventNAMEvalue)){	

						if(kpiFormula.term1_sensor_id != null)		
							senEnvIds2Delup.push(kpiFormula.term1_sensor_id);

						sensorKpi.sensorid = $('#selectSensor2').find(":selected").attr("value");
						sensorKpi.sensorname = $('#selectSensor2').find(":selected").text();
						sensorKpi.eventname = $('#selectSensorEvent2').find(":selected").text();
						sensorKpi.eventtype = $('#selectSensorEvent2').find(":selected").attr("type");
						//sensorKpi.eventtypevalue = $('#eventTypeValue2').val();
						sensorKpi.eventpartition = $('#selectSensorEvent2').find(":selected").attr("partition");
						if(sensorKpi.eventpartition == "true")
							sensorKpi.partitionid = $('#partitionOptions').find(":selected").attr("value");
						else
							sensorKpi.partitionid = "none";
						sensorKpi.sampling_rate = isNaN(samplingRate) ? 0 : samplingRate;
						sensorKpi.sampling_interval = $('#samplingInterval').val();
						
						
						$.ajax({
							url : restAddress
									+ 'proasense_hella/sensorevent',
							type : 'POST',
							async: false ,
							data : '{"type":"INSERT","data":['
									+ JSON
											.stringify(sensorKpi)
									+ ']}',
							success : function(result) {
								$('html').unblock();
								if (result.succeeded) {
									
									kpiFormula.term1_sensor_id = result.insertId[0];
									sensorKpi.id = result.insertId[0];

									senEnvErrorUp.push(sensorKpi);
								}
								else{
									$.notify('Error adding sensor 1');
									return
								}
							}
						});
					//}
					
				}
				else{
					
					//case of kpi usage
					alert("Not supported yet with kpis");
					return;
					
					if(kpiFormula.term1_sensor_id != null)
						senEnvIds2Delup.push(kpiFormula.term1_sensor_id);
					
					
				}
				
				
				break;
			case "composed":
	
				kpiFormula.operator_1 = $('#op1').val();
				kpiInformation.operator1 = kpiFormula.operator_1;
				
				if($('#kpiSensor2').val() == 'sensor'){
										
					kpiFormula.term1_kpi_id = null;
					
					var sensorIDvalue = $('#selectSensor3').find(":selected").attr("value");
					var eventNAMEvalue = $('#selectSensorEvent3').find(":selected").attr("value");
					
					if($('#selectSensorEvent3').find(":selected").attr("partition") == "true")
						partitionIDvalue = $('#partitionOptions').find(":selected").attr("value");
					
					if(sensorIDvalue == null){
						$.notify('Choose a sensor');
						return;
					}
					if(eventNAMEvalue == null){
						$.notify('Choose an event');
						return;
					}
					
//					var sensorEventOLD = {};	
//					
//					for(var idx = 0 ; idx < sensorEvents.length ; idx++)
//						if(sensorEvents[idx].id == kpiFormula.term1_sensor_id ){
//							sensorEventOLD = $.extend( {}, sensorEvents[idx]);
//							break;
//						}
//					
//					if(sensorEventOLD.sensorid != sensorIDvalue || (sensorEventOLD.sensorid == sensorIDvalue && sensorEventOLD.eventname != eventNAMEvalue)){	
						
						if(kpiFormula.term1_sensor_id != null)
							senEnvIds2Delup.push(kpiFormula.term1_sensor_id);

						sensorKpi.sensorid = $('#selectSensor3').find(":selected").attr("value");
						sensorKpi.sensorname = $('#selectSensor3').find(":selected").text();
						sensorKpi.eventname = $('#selectSensorEvent3').find(":selected").text();
						sensorKpi.eventtype = $('#selectSensorEvent3').find(":selected").attr("type");
						//sensorKpi.eventtypevalue = $('#eventTypeValue3').val();
						sensorKpi.eventpartition = $('#selectSensorEvent3').find(":selected").attr("partition");
						if(sensorKpi.eventpartition == "true")
							sensorKpi.partitionid = $('#partitionOptions').find(":selected").attr("value");
						else
							sensorKpi.partitionid = "none";
						sensorKpi.sampling_rate = isNaN(samplingRate) ? 0 : samplingRate;
						sensorKpi.sampling_interval = $('#samplingInterval').val();
						
						kpiInformation.sensorid1 = sensorKpi.sensorid;
						kpiInformation.sensorname1 = sensorKpi.sensorname;
						kpiInformation.eventname1 = sensorKpi.eventname;
						kpiInformation.eventtype1 = sensorKpi.eventtype;
						kpiInformation.eventpartition1 = sensorKpi.eventpartition;
						kpiInformation.partitionid1 = sensorKpi.partitionid;
						
						
						$.ajax({
							url : restAddress
									+ 'proasense_hella/sensorevent',
							type : 'POST',
							async: false ,
							data : '{"type":"INSERT","data":['
									+ JSON
											.stringify(sensorKpi)
									+ ']}',
							success : function(result) {
								if (result.succeeded) {
									
									kpiFormula.term1_sensor_id = result.insertId[0];
									sensorKpi.id = result.insertId[0];

									senEnvErrorUp.push(sensorKpi);
								}
								else{
									$.notify('Error adding sensor 1');
									return
								}
							}
						});
//					}else{
//						
//						kpiInformation.sensorid1 = sensorEventOLD.sensorid;
//						kpiInformation.sensorname1 = sensorEventOLD.sensorname;
//						kpiInformation.eventname1 = sensorEventOLD.eventname;
//						kpiInformation.eventtype1 = sensorEventOLD.eventtype;
//						kpiInformation.eventpartition1 = sensorEventOLD.eventpartition;
//						kpiInformation.partitionid1 = sensorEventOLD.partitionid;						
//					}
										
				}
				else{
					
					//case of kpi usage
					alert("Not supported yet with kpis");
					return;
					
					if(kpiFormula.term1_sensor_id != null)
						senEnvIds2Delup.push(kpiFormula.term1_sensor_id);
	
				}
				
				
				if($('#kpiSensor3').val() == 'sensor'){
					
					kpiFormula.term2_kpi_id = null;
					
					var sensorIDvalue1 = $('#selectSensor4').attr("value");
					var eventNAMEvalue1 = $('#selectSensorEvent4').attr("value");
					if(sensorIDvalue1 == null){
						$.notify('Choose a sensor');
						return;
					}
					if(eventNAMEvalue1 == null){
						$.notify('Choose an event');
						return;
					}
					
//					var sensorEventOLD1 = {};
//					
//					for(var idx2 = 0 ; idx2 < sensorEvents.length ; idx2++)
//						if(sensorEvents[idx2].id == kpiFormula.term2_sensor_id ){
//							sensorEventOLD1 = $.extend( {}, sensorEvents[idx2]);
//							break;
//						}
//					
//					if(sensorEventOLD1.sensorid != sensorIDvalue1 || (sensorEventOLD1.sensorid == sensorIDvalue1 && sensorEventOLD1.eventname != eventNAMEvalue1)){	
						
						if(kpiFormula.term2_sensor_id != null)
							senEnvIds2Delup.push(kpiFormula.term2_sensor_id);
						
						sensorKpi2.sensorid = $('#selectSensor4').find(":selected").attr("value");
						sensorKpi2.sensorname = $('#selectSensor4').find(":selected").text();
						sensorKpi2.eventname = $('#selectSensorEvent4').find(":selected").text();
						sensorKpi2.eventtype = $('#selectSensorEvent4').find(":selected").attr("type");
						//sensorKpi2.eventtypevalue = $('#eventTypeValue4').val();
						sensorKpi2.eventpartition = $('#selectSensorEvent4').find(":selected").attr("partition");
						if(sensorKpi2.eventpartition == "true")
							sensorKpi2.partitionid = $('#partitionOptions').find(":selected").attr("value");
						else
							sensorKpi2.partitionid = "none";
												
						sensorKpi2.sampling_rate = isNaN(samplingRate) ? 0 : samplingRate;
						sensorKpi2.sampling_interval = $('#samplingInterval').val();

						kpiInformation.sensorid2 = sensorKpi2.sensorid;
						kpiInformation.sensorname2 = sensorKpi2.sensorname;
						kpiInformation.eventname2 = sensorKpi2.eventname;
						kpiInformation.eventtype2 = sensorKpi2.eventtype;
						kpiInformation.eventpartition2 = sensorKpi2.eventpartition;
						kpiInformation.partitionid2 = sensorKpi2.partitionid;
						
						$.ajax({
							url : restAddress
									+ 'proasense_hella/sensorevent',
							type : 'POST',
							async: false ,
							data : '{"type":"INSERT","data":['
									+ JSON
											.stringify(sensorKpi2)
									+ ']}',
							success : function(result) {
								if (result.succeeded) {
									
									kpiFormula.term2_sensor_id = result.insertId[0];
									sensorKpi2.id = result.insertId[0];

									senEnvErrorUp.push(sensorKpi2);
								}
								else{
									$.notify('Error adding sensor 2');
									return
								}
							}
						});
//					}else{
//						kpiInformation.sensorid2 = sensorEventOLD1.sensorid;
//						kpiInformation.sensorname2 = sensorEventOLD1.sensorname;
//						kpiInformation.eventname2 = sensorEventOLD1.eventname;
//						kpiInformation.eventtype2 = sensorEventOLD1.eventtype;
//						kpiInformation.eventpartition2 = sensorEventOLD1.eventpartition;
//						kpiInformation.partitionid2 = sensorEventOLD1.partitionid;	
//						
//					}
					
				}
				else{
					
					//case of kpi usage
					alert("Not supported yet with kpis");
					return;
					
					if(kpiFormula.term2_sensor_id != null)
						senEnvIds2Delup.push(kpiFormula.term2_sensor_id);
	
				}
				break;
				
				default:
					alert("Enter in default update!!");
					break;
			
			}
			
			//merge kpi and sensor information
			$.extend(kpiInformation, kpiInformation , kpi);
			
			//inform the storage of the new kpi
			$.ajax({
				url : restAddress
						+ 'proasense_hella/update',
				type : 'POST',
				data : '{"type":"INFORM","data":['
						+ JSON
								.stringify(kpiInformation)
						+ ']}',
				success : function(result){
					if(result.succeeded){
						
						for(var i = 0; i < senEnvErrorUp.length; i++){
							sensorEvents.push(senEnvErrorUp[i]);
						}			
						
						$.ajax({
							url : restAddress + 'proasense_hella/kpi_formula',
							type : 'POST',
							async: false,
							data : '{"type":"UPDATE","data":' + JSON.stringify(kpiFormula)
									+ '}',
							success : function(result) {

								if (result.succeeded) {
									
									var tmpObj = jQuery.extend({}, kpi);
									delete tmpObj.parent_id;
									delete tmpObj.text;
									delete tmpObj.children;
									$.ajax({
										url : restAddress + 'proasense_hella/kpi',
										type : 'POST',
										data : '{"type":"UPDATE","data":'
												+ JSON.stringify(tmpObj) + '}',
										success : function(result) {
											$('html').unblock();

											if (result.succeeded) {
																				
												$.notify('KPI updated', 'success');
												kpiInfo[kpiIndex] = kpi;
												kpiFormulas[kpiFormulaIndex] = kpiFormula;
												$('#KPITree').jstree().rename_node(kpi.id,
														kpi.text);
												activeScreen.closeScreen();
												
												for(var i = 0; i < senEnvIds2Delup.length; i++){
													
													for(var idx = 0 ; idx < sensorEvents.length ; idx++)
														if(sensorEvents[idx].id == senEnvIds2Delup[i]){
															
															sensorEvents.splice(idx,1);
															break;
														}
																						
													$.ajax({
														url: restAddress + 'proasense_hella/sensorevent',
														type: 'POST',
														async: false,
														data: '{"type":"DELETE","data":[{"id":' + senEnvIds2Delup[i] + '}]}',
														success: function(result) {

															if (result.succeeded) {
																
																
															}else{
																$('html').unblock();
																$.notify('Error deleting sensor events');
																return;
															}
														}
															
													});
												}
												
											} else {
												$.notify('KPI update failed');
											}
										}
									});
								} else {
									$('html').unblock();
									$.notify('Formula update failed');
								}		
							}
						});		
					}
					else{
						
						for(var i = 0; i < senEnvErrorUp.length; i++){
						
							$.ajax({
								url: restAddress + 'proasense_hella/sensorevent',
								type: 'POST',
								data: '{"type":"DELETE","data":[{"id":' + senEnvErrorUp[i].id + '}]}',
								success: function(result) {

									if (result.succeeded) {
										
											
									}else{
										$('html').unblock();
										$.notify('Error deleting sensor events');
										return;
									}
								}
									
							});
						}
						
						$('html').unblock();
						$.notify('KPI update failed due to storage');
						return;
					}
				}
			});
		} else {
			if (($('#calculationType').val() != null)
					&& ($('#numberSupport').val() != null)
					&& ($('#samplingInterval').val() != null)
					&& ($('#samplingRate').val() != null)
					&& ($('#name').val() != "")
					&& ($('#description').val() != "")) {
				
				var newKpi = {};
				var newKpiFormula = {};
				var newsensorKpi = {};
				var newsensorKpi2 = {};
				var kpiusage = {};
				var newkpiInformation = {};
				var sensor1 = false, sensor2 = false, sensor3 = false;
				newKpiFormula.term1_sensor_id = null;
				newKpiFormula.term1_kpi_id = null;
				newKpiFormula.operator_1 = null;
				newKpiFormula.term2_kpi_id = null;
				newKpiFormula.term2_sensor_id = null;
				newKpiFormula.operator_2 = null;
				newKpiFormula.term3_kpi_id = null;
				newKpiFormula.term3_sensor_id = null;
				newKpiFormula.criteria = null;

				newKpi.parent_id = newParentId;
				newKpi.name = $('#name').val();
				newKpi.description = $('#description').val();
				var samplingRate = parseInt($('#samplingRate').val());
				newKpi.sampling_rate = isNaN(samplingRate) ? 0 : samplingRate;
				newKpi.sampling_interval = $('#samplingInterval').val();
				var chk = $('#contextualInformation input');
				newKpi.context_product = chk[0].checked;
				newKpi.context_machine = chk[1].checked;
				newKpi.context_shift = chk[2].checked;
				newKpi.context_mould = chk[3].checked;
				newKpi.calculation_type = $('#calculationType').val();
				
				
				if(newKpi.calculation_type != "aggregate"){
					newKpi.aggregation = 1;
					newkpiInformation.aggregationName = "NONE";
				}
				else{
					if($('#selectAggType').val()==null){
						$.notify('Please choose the aggregation type', 'info');
						return;
					}else{
						newKpi.aggregation = $('#selectAggType').find(":selected").attr("id");
						newkpiInformation.aggregationName = $('#selectAggType').find(":selected").text();		
					}
				}

				newKpi.number_support = $('#numberSupport').val().toUpperCase();
				//integrating context in kpi
				newKpi.company_context = $('#companyContext').val();
				//newKpi.number_support_format = $('#numberSupportFormat').val().toUpperCase();

				//get the formula
				//newKpiFormula = this.getKpiFormula(newKpi, newKpiFormula);
								
				$('html').block({
					'message' : null
				});
				$.ajax({
							url : restAddress + 'proasense_hella/kpi',
							type : 'POST',
							data : '{"type":"INSERT","data":['
									+ JSON.stringify(newKpi) + ']}',
							success : function(result) {
								
								if (result.succeeded) {
									
									//insert new kpi ID
									newKpiFormula.kpi_id = result.insertId[0];
									newKpi.id = result.insertId[0];
									
									switch(newKpi.calculation_type){
									case "simple":
										//info to integrate with dominik model
										newsensorKpi.sensorid = $('#selectSensor1').find(":selected").attr("value");
										newsensorKpi.sensorname = $('#selectSensor1').find(":selected").text();
										newsensorKpi.eventname = $('#selectSensorEvent1').find(":selected").text();
										newsensorKpi.eventtype = $('#selectSensorEvent1').find(":selected").attr("type");
										newsensorKpi.eventtypevalue = $('#eventTypeValue1').val();
										newsensorKpi.eventpartition = $('#selectSensorEvent1').find(":selected").attr("partition");
										if(newsensorKpi.eventpartition == "true")
											newsensorKpi.partitionid = $('#partitionOptions').find(":selected").attr("value");
										else
											newsensorKpi.partitionid = "none";
										newsensorKpi.sampling_rate = isNaN(samplingRate) ? 0 : samplingRate;
										newsensorKpi.sampling_interval = $('#samplingInterval').val();
																				
										$.ajax({
											url : restAddress
													+ 'proasense_hella/sensorevent',
											type : 'POST',
											data : '{"type":"INSERT","data":['
													+ JSON
															.stringify(newsensorKpi)
													+ ']}',
											success : function(result) {
												if (result.succeeded) {
													
													newKpiFormula.term1_sensor_id = result.insertId[0];
													newsensorKpi.id = result.insertId[0];
													
													$.ajax({
																url : restAddress
																		+ 'proasense_hella/kpi_formula',
																type : 'POST',
																data : '{"type":"INSERT","data":['
																		+ JSON
																				.stringify(newKpiFormula)
																		+ ']}',
																success : function(result) {
																	
																	if (result.succeeded) {
																		
																		//merge kpi and sensor information
																		$.extend(newkpiInformation, newsensorKpi, newKpi);
																		
																		newKpiFormula.id = result.insertId[0];
																		
																		//inform the storage of the new kpi
																		$.ajax({
																			url : restAddress
																					+ 'proasense_hella/insert',
																			type : 'POST',
																			data : '{"type":"INFORM","data":['
																					+ JSON
																							.stringify(newkpiInformation)
																					+ ']}',
																			success : function(result2) {
																				$('html').unblock();
																				if (result2.succeeded) {
																					
																					$.notify('KPI added',
																							'success');
																					newKpi.children = [];
																					for (var i = 0; i < kpiInfo.length; i++) {
																						if (kpiInfo[i].id == newParentId) {
																							kpiInfo[i].children
																									.push(newKpi);
																							break;
																						}
																					}
																					
																					kpiInfo.push(newKpi);
																					kpiFormulas.push(newKpiFormula);
																					sensorEvents.push(newsensorKpi);
																					newKpi.text = newKpi.name
																							+ delEditBtn;
																					$('#KPITree')
																							.jstree()
																							.create_node(
																									newParentId,
																									jQuery
																											.extend(
																													{},
																													newKpi));
																					
																				}
																				else{
																					//erase db corrupt data
																					$.ajax({
																						url: restAddress + 'proasense_hella/kpi_formula',
																						type: 'POST',
																						async: false,
																						data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.id + '}]}',
																						});
																					$.ajax({
																						url: restAddress + 'proasense_hella/kpi',
																						type: 'POST',
																						data: '{"type":"DELETE","data":[{"id":' + newKpi.id + '}]}',
																						});
																					$.ajax({
																						url: restAddress + 'proasense_hella/sensorevent',
																						type: 'POST',
																						data: '{"type":"DELETE","data":[{"id":' + newsensorKpi.id + '}]}',
																						});

																					$('html').unblock();
																					$.notify('Error adding kpi in storage');
																				}
																				
																				screen1.closeScreen();
																			}
																		});

																	} else {
																		$.ajax({
																			url: restAddress + 'proasense_hella/kpi',
																			type: 'POST',
																			data: '{"type":"DELETE","data":[{"id":' + newKpi.id + '}]}',
																			});
																		$.ajax({
																			url: restAddress + 'proasense_hella/sensorevent',
																			type: 'POST',
																			data: '{"type":"DELETE","data":[{"id":' + newsensorKpi.term1_sensor_id + '}]}',
																			});

																		$('html').unblock();
																		$.notify('Error adding formula');
																	}
																}
															});
												
												} else {
													$.ajax({
														url: restAddress + 'proasense_hella/kpi',
														type: 'POST',
														data: '{"type":"DELETE","data":[{"id":' + newKpi.id + '}]}',
														});

													$('html').unblock();
													$.notify('Error adding sensor event');
												}
											}
										});
										
										break;
									case "aggregate":
										
										sensor1 = $('#kpiSensor1').val() == 'sensor';
										
										if(sensor1){
											//info to integrate with dominik model
											newsensorKpi.sensorid = $('#selectSensor2').find(":selected").attr("value");
											newsensorKpi.sensorname = $('#selectSensor2').find(":selected").text();
											newsensorKpi.eventname = $('#selectSensorEvent2').find(":selected").text();
											newsensorKpi.eventtype = $('#selectSensorEvent2').find(":selected").attr("type");
											newsensorKpi.eventtypevalue = $('#eventTypeValue2').val();
											newsensorKpi.eventpartition = $('#selectSensorEvent2').find(":selected").attr("partition");
											if(newsensorKpi.eventpartition == "true")
												newsensorKpi.partitionid = $('#partitionOptions').find(":selected").attr("value");
											else
												newsensorKpi.partitionid = "none";
											newsensorKpi.sampling_rate = isNaN(samplingRate) ? 0 : samplingRate;
											newsensorKpi.sampling_interval = $('#samplingInterval').val();
											
											$.ajax({
												url : restAddress
														+ 'proasense_hella/sensorevent',
												type : 'POST',
												async: false,
												data : '{"type":"INSERT","data":['
														+ JSON
																.stringify(newsensorKpi)
														+ ']}',
												success : function(result) {
													if (result.succeeded) {
														
														newKpiFormula.term1_sensor_id = result.insertId[0];
														newsensorKpi.id = result.insertId[0];
													
													} else {
														$.ajax({
															url: restAddress + 'proasense_hella/kpi',
															type: 'POST',
															data: '{"type":"DELETE","data":[{"id":' + newKpi.id + '}]}',
															});

														$('html').unblock();
														$.notify('Error adding sensor');
													}
												}
											});
										}
										else{			
											
											//kpi made with another kpi
											
											//alert("NOT SUPPORTED YET");
											//break
											newKpiFormula.term1_kpi_id = $('#selectKpi1').find(":selected").attr("value");
											kpiusage.term1_kpi_id = newKpiFormula.term1_kpi_id;
										}
										
										$.ajax({
												url : restAddress
														+ 'proasense_hella/kpi_formula',
												type : 'POST',
												data : '{"type":"INSERT","data":['
														+ JSON
																.stringify(newKpiFormula)
														+ ']}',
												success : function(result) {
													if (result.succeeded) {
														

														newKpiFormula.id = result.insertId[0];
														
														//merge kpi and sensor information
														if(sensor1)
															$.extend(newkpiInformation, newsensorKpi , newKpi);
														else
															$.extend(newkpiInformation, kpiusage , newKpi);
														
														//inform the storage of the new kpi
														$.ajax({
															url : restAddress
																	+ 'proasense_hella/insert',
															type : 'POST',
															data : '{"type":"INFORM","data":['
																	+ JSON
																			.stringify(newkpiInformation)
																	+ ']}',
																	success : function(result2) {
																		
																		$('html').unblock();
																		
																		if (result2.succeeded) {
																			
																			$.notify('KPI added',
																			'success');
																			newKpi.children = [];
																			for (var i = 0; i < kpiInfo.length; i++) {
																				if (kpiInfo[i].id == newParentId) {
																					kpiInfo[i].children
																							.push(newKpi);
																					break;
																				}
																			}
																			
																			kpiInfo.push(newKpi);
																			kpiFormulas.push(newKpiFormula);
																			if(sensor1)
																				sensorEvents.push(newsensorKpi);
																			newKpi.text = newKpi.name
																					+ delEditBtn;
																			$('#KPITree')
																					.jstree()
																					.create_node(
																							newParentId,
																							jQuery
																									.extend(
																											{},
																											newKpi));
																			
																		}else{
																			//erase db corrupt data
																			$.ajax({
																				url: restAddress + 'proasense_hella/kpi_formula',
																				type: 'POST',
																				async: false,
																				data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.id + '}]}',
																				});
																			$.ajax({
																				url: restAddress + 'proasense_hella/kpi',
																				type: 'POST',
																				data: '{"type":"DELETE","data":[{"id":' + newKpi.id + '}]}',
																				});
																			if(sensor1)
																				$.ajax({
																					url: restAddress + 'proasense_hella/sensorevent',
																					type: 'POST',
																					data: '{"type":"DELETE","data":[{"id":' + newsensorKpi.id + '}]}',
																					});

																			$('html').unblock();
																			$.notify('Error adding kpi in storage');
																			
																		}
																		
																		screen1.closeScreen();
																	}
														});
														
													} else {
														$.ajax({
															url: restAddress + 'proasense_hella/kpi',
															type: 'POST',
															data: '{"type":"DELETE","data":[{"id":' + newKpi.id + '}]}',
															});
														if(sensor1)
															$.ajax({
																url: restAddress + 'proasense_hella/sensorevent',
																type: 'POST',
																data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.term1_sensor_id + '}]}',
																});

														$('html').unblock();
														$.notify('Error adding formula');
													}
												}
											});
								
												
										break;
									case "composed":
																				
										sensor1 = $('#kpiSensor2').val() == 'sensor';
										sensor2 = $('#kpiSensor3').val() == 'sensor';
										//sensor3 = $('#kpiSensor4').val() == 'sensor';

										newsensorKpi.sampling_rate = isNaN(samplingRate) ? 0 : samplingRate;
										newsensorKpi.sampling_interval = $('#samplingInterval').val();
										newsensorKpi2.sampling_rate = isNaN(samplingRate) ? 0 : samplingRate;
										newsensorKpi2.sampling_interval = $('#samplingInterval').val();
										
										newKpiFormula.operator_1 = $('#op1').val();
										newkpiInformation.operator1 = newKpiFormula.operator_1;
										
										var sensorRegSuccessfull = true;
										
										if(sensor1){
											//info to integrate with dominik model
											newsensorKpi.sensorid = $('#selectSensor3').find(":selected").attr("value");
											newsensorKpi.sensorname = $('#selectSensor3').find(":selected").text();
											newsensorKpi.eventname = $('#selectSensorEvent3').find(":selected").text();
											newsensorKpi.eventtype = $('#selectSensorEvent3').find(":selected").attr("type");
											newsensorKpi.eventtypevalue = $('#eventTypeValue3').val();
											newsensorKpi.eventpartition = $('#selectSensorEvent3').find(":selected").attr("partition");
											if(newsensorKpi.eventpartition == "true")
												newsensorKpi.partitionid = $('#partitionOptions').find(":selected").attr("value");
											else
												newsensorKpi.partitionid = "none";

											newkpiInformation.sensorid1 = newsensorKpi.sensorid;
											newkpiInformation.sensorname1 = newsensorKpi.sensorname;
											newkpiInformation.eventname1 = newsensorKpi.eventname;
											newkpiInformation.eventtype1 = newsensorKpi.eventtype;
											newkpiInformation.eventpartition1 = newsensorKpi.eventpartition;
											newkpiInformation.partitionid1 = newsensorKpi.partitionid;
																						
										}
										else{
											alert("Not supported yet, the usage of kpis");
											break;
										}
										
										$.ajax({
											url : restAddress
													+ 'proasense_hella/sensorevent',
											type : 'POST',
											async: false ,
											data : '{"type":"INSERT","data":['
													+ JSON
															.stringify(newsensorKpi)
													+ ']}',
											success : function(result) {
												if (result.succeeded) {
													
													if(sensor1){
														newKpiFormula.term1_sensor_id = result.insertId[0];
														newsensorKpi.id = result.insertId[0];
														//add to local	
														sensorEvents.push(newsensorKpi);
													}else
														newKpiFormula.term1_kpi_id = result.insertId[0];
												}
												else{
													sensorRegSuccessfull = sensorRegSuccessfull && false;
													$.notify('Error adding sensor 1');
												}
											}
										});
										
										if(sensor2){
											
											//info to integrate with dominik model
											newsensorKpi2.sensorid = $('#selectSensor4').find(":selected").attr("value");
											newsensorKpi2.sensorname = $('#selectSensor4').find(":selected").text();
											newsensorKpi2.eventname = $('#selectSensorEvent4').find(":selected").text();
											newsensorKpi2.eventtype = $('#selectSensorEvent4').find(":selected").attr("type");
											newsensorKpi2.eventtypevalue = $('#eventTypeValue4').val();
											newsensorKpi2.eventpartition = $('#selectSensorEvent4').find(":selected").attr("partition");
											if(newsensorKpi2.eventpartition == "true")
												newsensorKpi2.partitionid = $('#partitionOptions').find(":selected").attr("value");
											else
												newsensorKpi2.partitionid = "none";
											
											newkpiInformation.sensorid2 = newsensorKpi2.sensorid;
											newkpiInformation.sensorname2 = newsensorKpi2.sensorname;
											newkpiInformation.eventname2 = newsensorKpi2.eventname;
											newkpiInformation.eventtype2 = newsensorKpi2.eventtype;
											newkpiInformation.eventpartition2 = newsensorKpi2.eventpartition;
											newkpiInformation.partitionid2 = newsensorKpi2.partitionid;
																						
										}
										else{
											alert("Not supported yet, the usage of kpis");
											break;
										}
										
										$.ajax({
											url : restAddress
													+ 'proasense_hella/sensorevent',
											type : 'POST',
											async: false ,
											data : '{"type":"INSERT","data":['
													+ JSON
															.stringify(newsensorKpi2)
													+ ']}',
											success : function(result) {
												if (result.succeeded) {
													if(sensor2){
														newKpiFormula.term2_sensor_id = result.insertId[0];
														newsensorKpi2.id = result.insertId[0];
														//add to local	
														sensorEvents.push(newsensorKpi2);
													}else
														newKpiFormula.term2_kpi_id = result.insertId[0];
												}
												else{
													sensorRegSuccessfull = sensorRegSuccessfull && false;
													$.notify('Error adding sensor 2');
												}
											}
										});
										
										if(sensorRegSuccessfull){
											$.ajax({
												url : restAddress
														+ 'proasense_hella/kpi_formula',
												type : 'POST',
												data : '{"type":"INSERT","data":['
														+ JSON
																.stringify(newKpiFormula)
														+ ']}',
												success : function(result) {													
													
													if (result.succeeded) {
														
														//merge kpi and sensor information
														$.extend(newkpiInformation, newkpiInformation , newKpi);
														
														newKpiFormula.id = result.insertId[0];
														
														//inform the storage of the new kpi
														$.ajax({
															url : restAddress
																	+ 'proasense_hella/insert',
															type : 'POST',
															data : '{"type":"INFORM","data":['
																	+ JSON
																			.stringify(newkpiInformation)
																	+ ']}',
																	success : function(result2) {
																		
																		$('html').unblock();
																		
																		if (result2.succeeded) {
																			
																			$.notify('KPI added',
																			'success');
																			newKpi.children = [];
																			for (var i = 0; i < kpiInfo.length; i++) {
																				if (kpiInfo[i].id == newParentId) {
																					kpiInfo[i].children
																							.push(newKpi);
																					break;
																				}
																			}
																			kpiInfo.push(newKpi);
																			kpiFormulas.push(newKpiFormula);
																			
																			newKpi.text = newKpi.name
																					+ delEditBtn;
																			$('#KPITree')
																					.jstree()
																					.create_node(
																							newParentId,
																							jQuery
																									.extend(
																											{},
																											newKpi));
																		}
																		else{
																			//erase db corrupt data
																			$.ajax({
																				url: restAddress + 'proasense_hella/kpi_formula',
																				type: 'POST',
																				async: false,
																				data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.id + '}]}',
																				});
																			$.ajax({
																				url: restAddress + 'proasense_hella/kpi',
																				type: 'POST',
																				data: '{"type":"DELETE","data":[{"id":' + newKpi.id + '}]}',
																				});
																			if(sensor1)
																				$.ajax({
																					url: restAddress + 'proasense_hella/sensorevent',
																					type: 'POST',
																					data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.term1_sensor_id + '}]}',
																					});
																			if(sensor2)
																				$.ajax({
																					url: restAddress + 'proasense_hella/sensorevent',
																					type: 'POST',
																					data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.term2_sensor_id + '}]}',
																					});
																			
																			$.notify('Error adding kpi in storage');
																			
																		}
																		
																		screen1.closeScreen();
																	}
														});
														

														$('html').unblock();
														screen1.closeScreen();
													} else {
														//delete corrupt data
														$.ajax({
															url: restAddress + 'proasense_hella/kpi',
															type: 'POST',
															data: '{"type":"DELETE","data":[{"id":' + newKpi.id + '}]}',
															});
														if(sensor1)
															$.ajax({
																url: restAddress + 'proasense_hella/sensorevent',
																type: 'POST',
																data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.term1_sensor_id + '}]}',
																});
														if(sensor2)
															$.ajax({
																url: restAddress + 'proasense_hella/sensorevent',
																type: 'POST',
																data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.term2_sensor_id + '}]}',
																});

														$('html').unblock();
														$.notify('Error adding formula');
													}
												}
											});
										}
										else{
											//delete corrupt data
											$.ajax({
												url: restAddress + 'proasense_hella/kpi',
												type: 'POST',
												data: '{"type":"DELETE","data":[{"id":' + newKpi.id + '}]}',
												});
											if(newKpiFormula.term1_sensor_id !=null)
												$.ajax({
													url: restAddress + 'proasense_hella/sensorevent',
													type: 'POST',
													data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.term1_sensor_id + '}]}',
													});
											if(newKpiFormula.term2_sensor_id !=null)
												$.ajax({
													url: restAddress + 'proasense_hella/sensorevent',
													type: 'POST',
													data: '{"type":"DELETE","data":[{"id":' + newKpiFormula.term2_sensor_id + '}]}',
													});
										}
										break;
									default:
										alert("default new sensor kpi");	
										break;
									}
								} else {
									$('html').unblock();
									$.notify('Error adding kpi');
								}
							}
						});

			} else {
				$.notify('Please fill all the boxes', 'info');
			}
		}
	}
}

function Screen2(kpiInfo) {
//	window.alert("screen 2 initialization");
	this.kpiInfo = kpiInfo;

	var scr = this;

	$.get('inc/screen2.inc', function(content) {
		scr.content = content;
	});

	this.openScreen = function() {
		if (loadedKpi != "") {
			$('.content').html(this.content);
			$('#cancelBtn').on('click', function(event) {
				scr.cancelBtn();
			});
			$('#addTargetBtn').on('click', function(event) {
				scr.addTargetBtn();
			});
			$('#editTargetBtn').on('click', function(event) {
				scr.editTargetBtn(loadedTargetToEditId);
			});
			this.loadElData(loadedKpi)
			showScreen(true);
		}

	}

	this.loadElData = function(elId) {
		for (var i = 0; i < this.kpiInfo.length; i++) {
			if (this.kpiInfo[i].id == elId) {
				this.changeLoadedKpi(elId);
				el = this.kpiInfo[i];
				var titleRow = '<tr bgcolor="#cccccc">'
				var firstRow = '<tr bgcolor="#cccccc">'
				var listRow = '';
				var listCol1 = '';
				var listCol2 = '';
					
				var contexts = ['context_product', 'context_machine', 'context_shift', 'context_mould'];

				var options = '';
				
				var kpiInfoTmp = getKpiInfoId(elId);
				for (var j = 0; j < $('#contextualInformation input').length; j++) {
					var chk = $('#contextualInformation input')[j];
					options = '<option value=null>All '+chk.name+'s</option>';
					chk.checked = el[contexts[j]];
					if (chk.checked) {
						firstRow = firstRow + '<td>' + chk.name + '</td>';
						var tmpVect = eval(chk.value.split('_')[0] + 's');
						for (var k = 0; k < tmpVect.length; k++) {
							options = options + '<option value=' + tmpVect[k].id + '>' + tmpVect[k].name + '</option>';
						}
						listRow = listRow + '<tr><td width="200px">' + chk.name + '</td><td width="200px"><select data-value="' + chk.value + '" class="form-control select-90">' + options + '</select></td></tr>';
					}
				}
				options = '';
				
				$('#targetList').append(listRow);
				titleRow=titleRow+'<td colspan=8 style="text-align:center"><b>'+el.name+'</b></td>'
				firstRow = firstRow + '<td>Lower bound</td><td colspan=3>Upper bound</td></tr>';
				$('#targetTable').append(titleRow);
				$('#targetTable').append(firstRow);
				var toAppend = '';

				for (var j = 0; j < kpiTargets.length; j++) {
					if (kpiTargets[j].kpi_id != el.id) {
						continue;
					}
					toAppend = '<tr id=' + kpiTargets[j].id + '>';
					var chk = $('#contextualInformation input:checked');
					for (var k = 0; k < chk.length; k++) 
					{
						if(kpiTargets[j][chk[k].value]==null)
						{
							toAppend = toAppend + '<td>All '+ chk[k].name.split(' ')[0]+'s</td>';
						}
						else
						{
							toAppend = toAppend + '<td>' + eval('get' + chk[k].name.split(' ')[0] + '(' + kpiTargets[j][chk[k].value] + ').name'); + '</td>';
						}
					}
					var lower_bound_to_append; 
					if ( (kpiTargets[j].lower_bound == null) || (kpiTargets[j].lower_bound == '') ){
						lower_bound_to_append = '-'; 
					} else {
						lower_bound_to_append = kpiTargets[j].lower_bound;
						if (kpiInfoTmp.number_support_format.toUpperCase()  == 'PERCENTAGE') {
							lower_bound_to_append = parseFloat((lower_bound_to_append*100).toFixed(2));
						} else if (kpiInfoTmp.number_support_format.toUpperCase()  == 'DECIMAL'){
							lower_bound_to_append = parseFloat((lower_bound_to_append*1).toFixed(kpiInfoTmp.nsf_decimal_places));
						}
					}
					
					var upper_bound_to_append; 
					if ( (kpiTargets[j].upper_bound == null) || (kpiTargets[j].upper_bound == '')){
						upper_bound_to_append = '-'; 
					} else {
						upper_bound_to_append = kpiTargets[j].upper_bound;
						if (kpiInfoTmp.number_support_format.toUpperCase()  == 'PERCENTAGE') {
							upper_bound_to_append = parseFloat((upper_bound_to_append*100).toFixed(2));
						} else if (kpiInfoTmp.number_support_format.toUpperCase()  == 'DECIMAL'){
							upper_bound_to_append = parseFloat((upper_bound_to_append*1).toFixed(kpiInfoTmp.nsf_decimal_places));
						}
					}
					toAppend = toAppend + '<td>' + lower_bound_to_append + '</td><td>' + upper_bound_to_append + '</td>';

					toAppend = toAppend + '<td width="25px" data-id=' + kpiTargets[j].id + ' style="cursor:pointer" align="center" title="Edit target" onclick="screen2.editTargetInfo('+kpiTargets[j].id+')" width="25px"><span class="glyphicon glyphicon-pencil" style="color:#333333" aria-hidden="true"></span></td>';
					toAppend = toAppend + '<td width="25px" data-id=' + kpiTargets[j].id + ' title="Delete target" style="cursor:pointer" align="center" ><span class="glyphicon glyphicon-minus" style="color:#333333" aria-hidden="true"></span></td></td></tr>';
					$('#targetTable').append(toAppend);
					var scr = this;
					$('#targetTable').find('tr:last').find('td:last').click(function(e) {
						scr.delTargetInfo(e.currentTarget);
					});
				}
				
				// Define number support format
				//showNumberSupportFormat(el.number_support_format);
//				window.alert(JSON.stringify(el));
//				showNSFDecimalPlaces(el.nsf_decimal_places);
				return true;
			}
		}
		return false;
	}

	this.saveLoadedElement = function() {
		var id = this.loadedKpi;
		if (id != "") {
			var kpiInfoTmp = getKpiInfoId(loadedKpi);
			var query = '[{';
			var selectBoxes = $('select');
			for (var j = 0; j < selectBoxes.length; j++) {
				query = query + '"' + selectBoxes.eq(j).attr('data-value') + '":' + selectBoxes.eq(j).find('option:selected').val() + ',';
				var dataValueName = selectBoxes.eq(j).attr('data-value');
				switch(dataValueName) {
					case "product_id": kpiInfoTmp.product_id = (selectBoxes.eq(j).find('option:selected').val() == "null" ? null : selectBoxes.eq(j).find('option:selected').val()  );
						break;
					case "machine_id": kpiInfoTmp.machine_id = (selectBoxes.eq(j).find('option:selected').val() == "null" ? null : selectBoxes.eq(j).find('option:selected').val()  );
						break;
					case "shift_id": kpiInfoTmp.shift_id = (selectBoxes.eq(j).find('option:selected').val() == "null" ? null : selectBoxes.eq(j).find('option:selected').val()  );
						break;
					case "mould_id": kpiInfoTmp.mould_id = (selectBoxes.eq(j).find('option:selected').val() == "null" ? null : selectBoxes.eq(j).find('option:selected').val()  );
						break;
					default:break;
				}
			}

			var upperValue = "";
			var lowerValue = "";
			var upValValidateNShow = "";
			var lwValValidateNShow = "";
			
			var nZeros = 4;//numberOfZeros(kpiInfoTmp.nsf_decimal_places);
			
//			var x2 = $('#upperBoundBoxDecimalPlaces').css('visibility');
//			var x3  = $('#upperBoundBoxDecimalPlaces').css('display');
				
			if ( ($('#upperBoundBox').val() == null) || ($('#upperBoundBox').val() == "") ){
				upperValue = "";
			} else {
				upperValue = $('#upperBoundBox').val();
				
//				if ( (kpiInfoTmp.nsf_decimal_places > 0) && (upperValue.indexOf(".") == -1) )
//					upperValue = $('#upperBoundBox').val() + "." + nZeros;
				
				
				if (kpiInfoTmp.number_support_format.toUpperCase()  == 'PERCENTAGE') {
					upperValue = parseFloat((upperValue/100).toFixed(4));
				} else if (kpiInfoTmp.number_support_format.toUpperCase()  == 'DECIMAL'){
					upperValue = parseFloat(upperValue).toFixed(4);
				}
				upValValidateNShow = upperValue;
			}
				
			if (($('#lowerBoundBox').val() == null) || ($('#lowerBoundBox').val() == "")) {
				lowerValue = "";
			} else {
				lowerValue = $('#lowerBoundBox').val();

//				if ( (kpiInfoTmp.nsf_decimal_places > 0) && (lowerValue.indexOf(".") == -1) )
//					lowerValue = $('#lowerBoundBox').val() + "." + nZeros;

				if (kpiInfoTmp.number_support_format.toUpperCase()  == 'PERCENTAGE') {
					lowerValue=parseFloat((lowerValue/100).toFixed(4));
				} else if (kpiInfoTmp.number_support_format.toUpperCase()  == 'DECIMAL'){
					lowerValue = parseFloat(lowerValue).toFixed(4);
				}
				
				lwValValidateNShow = lowerValue;
			}
			
//			var upperValue=parseFloat((upperValue/100).toFixed(2));

			
			query = query + '"kpi_id":' + loadedKpi + ',"upper_bound":"' + upperValue + '","lower_bound":"' + lowerValue + '"}]';
			
//			console.log("loadedKPI: "+JSON.stringify(this.loadedKpi));

			var validateInfo = validateNewTargetInputs(upValValidateNShow, lwValValidateNShow, loadedKpiNumberFormat, nZeros, kpiInfoTmp.id, kpiInfoTmp);
			if (validateInfo.isValid) {
				$('html').block({
					'message': null
				});
				$.ajax({
					url: restAddress + 'proasense_hella/kpi_target',
					type: 'POST',
					data: '{"type":"INSERT","data":' + query + '}',
					success: function(response) {
						$('html').unblock();
						if (response.succeeded) {
							var newTgId = response.insertId[0];
							var newTgObj = JSON.parse(query)[0];
							newTgObj.id = newTgId;

							kpiTargets.push(newTgObj);
							var rows = $('#targetList').find('tr');
							var toAppend = '<tr id="' +response.insertId[0]+'">';
							var targetInfoEl = {}
							var kpiTargetBoxVal = $('#kpiTargetBox').val();
							
							var upperBoundBox = upValValidateNShow;
//							var upperBoundBox = $('#upperBoundBox').val();

							var lowerBoundBox = lwValValidateNShow;
//							var lowerBoundBox = $('#lowerBoundBox').val();
	
							for (var j = 0; j < rows.length ; j++) {
								toAppend = toAppend + '<td>' + rows.eq(j).find('select option:selected').text() + '</td>';
							}
	//						toAppend = toAppend + '<td width="25px" data-id=' + kpiTargets[j].id + ' style="cursor:pointer" align="center" title="Edit target" width="25px"><span class="glyphicon glyphicon-pencil" style="color:#333333" aria-hidden="true"></span></td>';
							
							toAppend = toAppend + '<td>'
									 + (lowerBoundBox == '' ? '-' : lowerBoundBox) 
									 + '</td><td>' 
									 + (upperBoundBox == '' ? '-' : upperBoundBox) 
									 + '<td width="25px" data-id=' + newTgId + ' style="cursor:pointer" align="center" title="Edit target" onclick="screen2.editTargetInfo('+newTgId+')" width="25px"><span class="glyphicon glyphicon-pencil" style="color:#333333" aria-hidden="true"></span></td>' 
									 + '</td><td width="25px" data-id=' + newTgId + ' style="cursor:pointer" align="center" title="Delete element" ><span class="glyphicon glyphicon-minus" style="color:#333333" aria-hidden="true"></span></td></tr>';
	
							$('#targetTable').append(toAppend);
	
	
	
							$('#targetTable').find('tr:last').find('td:last').click(function(e) {
								scr.delTargetInfo(e.currentTarget);
							})
							$.notify('New target added', 'success');
						} else {
							$.notify("Violation of primary key constraint.\n Hint:Check bounds");
						}
	
					}
				});
			} else {
//				message: message, elementNameId: elementNameId
				$.notify(validateInfo.message);
				$(validateInfo.elementNameId).select();
//				$(validateInfo.elementNameId+"DecimalPlaces").select();
				
			}

		}
	}
	this.delTargetInfo = function(element) {
		var id = element.dataset.id
		$('html').block({
			'message': null
		});
		$.ajax({
			url: restAddress + 'proasense_hella/kpi_target',
			type: 'POST',
			data: '{"type":"DELETE","data":[{"id":' + id + '}]}',
			success: function(response) {
				$('html').unblock();
				if (response.succeeded) {
					$.notify('Target deleted', 'success');
					element.parentElement.remove();
					for (i = 0; i < kpiTargets.length; i++) {
						if (kpiTargets[i].id == id) {
							kpiTargets.splice(i, 1);
							break;
						}
					}
				} else {
					$.notify('Error deleting target');
				}
			}
		});
	}
	
	this.editTargetInfo = function(element) {
		
//		document.getElementById('addTargetBtn').css('display') = "none";
		document.getElementById('addTargetBtn').style.display = "none";
		document.getElementById('editTargetBtn').style.display = "inline";
		
		
		loadedTargetToEditId = element;
		// 0 - discover kpi target to edit 
		
		var targetToEdit;
		
		for (var k=0; k<kpiTargets.length;k++) {
			if (kpiTargets[k].id == element)
				targetToEdit = kpiTargets[k]; 
				JSON.stringify(targetToEdit);
		}
		
		// 1 - load values from kpiTargets array for this kpi id and target id into html inputs&selects
		
		var rows = $('#targetList').find('tr').find('select');
		
//		var selectRows = $('#targetList').find('tr').find('select option:selected');
		
//		var toAppend = "";
		for (var j = 0; j < rows.length ; j++) {
//			window.alert(rows.find('select').eq(j).attr("data-value"));
			var data_value = rows.eq(j).attr("data-value");
//			var valueSlct = rows.eq(j).value;
//			var valueSlctOpt = selectRows.eq(j).attr('value');
			switch (data_value) {
				case "product_id": document.getElementById('targetList').getElementsByTagName('select')[j].selectedIndex = targetToEdit.product_id;
								break;
				case "machine_id": document.getElementById('targetList').getElementsByTagName('select')[j].selectedIndex = targetToEdit.machine_id;
								break;
				case "shift_id": document.getElementById('targetList').getElementsByTagName('select')[j].selectedIndex = targetToEdit.shift_id;
								 break;
				case "mould_id": document.getElementById('targetList').getElementsByTagName('select')[j].selectedIndex = targetToEdit.mould_id;
								 break;
				default: window.alert("NO CONTEXT");
					break;
			}
		}
		
		
		// 2 - change contexts or values for bounds
		
		document.getElementById("upperBoundBox").value = targetToEdit.upper_bound;
		document.getElementById("lowerBoundBox").value = targetToEdit.lower_bound;
		

		// 3 - check if bounds already exist in others kpi
		// 		3.1 - if so, do not edit
		//		3.2 - if not edit targets by sending an UPDATE request to server and updating the line in the table
		 
		//			hint: var rows = $('#targetList').find('tr');
		
//		for (var k=0; k<kpiTargets.length;k++) {
//			if (kpiTargets[k].id == element)
//				targetToEdit = kpiTargets[k]; 
//				JSON.stringify(targetToEdit);
//		}
//		
//		hasTargets(upperBound, lowerBound, kpiElId, numSupFormat, contextIds, targetId, editStatus)
//		
//		targetToEdit.upper_bound = 100;
//		
//		document.getElementById("upperBoundBox").value = targetToEdit.upper_bound;
//		$.ajax({
//			url: restAddress + 'proasense_hella/kpi_target',
//			type: 'POST',
//			data: '{"type":"UPDATE","data":' + JSON.stringify(targetToEdit) + '}',
//			success: function(result) {
//				if (result.succeeded) {
//					if (debugMode) {
//						console.log("Sucess from UPDATE - /kpi_formula : result = "+JSON.stringify(result));
//					}
//					$.notify('TARGET OK', 'success');
//				} else {
////					$('html').unblock();
//					$.notify('TARGET DID FAILED');
//				}
//			}
//		});
		
		// 4- also edit in KpiTargets array
		

	}

	
	this.closeScreen = function() {
		this.changeLoadedKpi();
		showScreen(false);
		$('.content').html('');
	}
	
	this.cancelBtn = function() {
		this.closeScreen();
	}
	this.addTargetBtn = function() {
		this.saveLoadedElement();
	}

	this.editTargetBtn = function(targetToEditId) {
		var targetToEdit = "";
		var newTargetToEdit = {};
		
		newTargetToEdit.id = null;
		newTargetToEdit.kpi_id = null;
		newTargetToEdit.product_id = null;
		newTargetToEdit.machine_id = null;
		newTargetToEdit.mould_id = null;
		newTargetToEdit.shift_id = null;
		newTargetToEdit.upper_bound = "";
		newTargetToEdit.lower_bound = "";
		
		for (var k=0; k<kpiTargets.length;k++) {
			if (kpiTargets[k].id == targetToEditId)
				targetToEdit = kpiTargets[k]; 
				JSON.stringify(targetToEdit);
		}
		
		var id = loadedKpi;
		if (id != "") {
			var kpiInfoTmp = getKpiInfoId(loadedKpi);
//			var query = '[{"id":' + targetToEdit.id + ',';
			var selectBoxes = $('select');
			for (var j = 0; j < selectBoxes.length; j++) {
//				query = query + '"' + selectBoxes.eq(j).attr('data-value') + '":' + selectBoxes.eq(j).find('option:selected').val() + ',';
				var dataValueName = selectBoxes.eq(j).attr('data-value');
				switch(dataValueName) {
					case "product_id": kpiInfoTmp.product_id = (selectBoxes.eq(j).find('option:selected').val() == "null" ? null : selectBoxes.eq(j).find('option:selected').val()  );
						break;
					case "machine_id": kpiInfoTmp.machine_id = (selectBoxes.eq(j).find('option:selected').val() == "null" ? null : selectBoxes.eq(j).find('option:selected').val()  );
						break;
					case "shift_id": kpiInfoTmp.shift_id = (selectBoxes.eq(j).find('option:selected').val() == "null" ? null : selectBoxes.eq(j).find('option:selected').val()  );
						break;
					case "mould_id": kpiInfoTmp.mould_id = (selectBoxes.eq(j).find('option:selected').val() == "null" ? null : selectBoxes.eq(j).find('option:selected').val()  );
						break;
					default:break;
				}
			}

			var upperValue = "";
			var lowerValue = "";
			var upValValidateNShow = "";
			var lwValValidateNShow = "";
			
			var nZeros = numberOfZeros(kpiInfoTmp.nsf_decimal_places);
			
			if ( ($('#upperBoundBox').val() == null) || ($('#upperBoundBox').val() == "") ){
				upperValue = "";
			} else {
				upperValue = $('#upperBoundBox').val();
				
				if ( (kpiInfoTmp.nsf_decimal_places > 0) && (upperValue.indexOf(".") == -1) )
					upperValue = $('#upperBoundBox').val() + "." + nZeros;

				upValValidateNShow = upperValue;
				
				if (kpiInfoTmp.number_support_format.toUpperCase()  == 'PERCENTAGE') {
					upperValue = parseFloat((upperValue/100).toFixed(4));
				}
			}
				
			if (($('#lowerBoundBox').val() == null) || ($('#lowerBoundBox').val() == "")) {
				lowerValue = "";
			} else {
				// value is only one box
				lowerValue = $('#lowerBoundBox').val();
				
				if ( (kpiInfoTmp.nsf_decimal_places > 0) && (lowerValue.indexOf(".") == -1) )
					lowerValue = $('#upperBoundBox').val() + "." + nZeros;

				lwValValidateNShow = lowerValue;

				if (kpiInfoTmp.number_support_format.toUpperCase()  == 'PERCENTAGE') {
					lowerValue=parseFloat((lowerValue/100).toFixed(4));
				}
				
			}
			
			newTargetToEdit.id = targetToEditId;
			newTargetToEdit.kpi_id = loadedKpi;
			newTargetToEdit.product_id = kpiInfoTmp.product_id;
			newTargetToEdit.machine_id = kpiInfoTmp.machine_id;
			newTargetToEdit.mould_id = kpiInfoTmp.mould_id;
			newTargetToEdit.shift_id = kpiInfoTmp.shift_id;
			newTargetToEdit.upper_bound = upperValue;
			newTargetToEdit.lower_bound = lowerValue;
			

//			query = query + '"kpi_id":' + loadedKpi + ',"upper_bound":"' + upperValue + '","lower_bound":"' + lowerValue + '"}]';

			var validateInfo = validateNewTargetInputs(upValValidateNShow, lwValValidateNShow, loadedKpiNumberFormat, kpiInfoTmp.nsf_decimal_places, kpiInfoTmp.id, kpiInfoTmp, targetToEditId, true);
			if (validateInfo.isValid) {
				$('html').block({
					'message': null
				});
				$.ajax({
					url: restAddress + 'proasense_hella/kpi_target',
					type: 'POST',

					data: '{"type":"UPDATE","data":' + JSON.stringify(newTargetToEdit) + '}',
					success: function(response) {
						$('html').unblock();
						if (response.succeeded) {
							var tmpKpiTargets = [];
							
							for (var index=0;index<kpiTargets.length;index++) {
								if (kpiTargets[index].id == targetToEditId){
									tmpKpiTargets.push(newTargetToEdit);
								} else {
									tmpKpiTargets.push(kpiTargets[index]);
								}
							}
							kpiTargets = tmpKpiTargets;
							

							var rows = $('#targetTable').find('tr');
							
							
							var toAppend = "";
							for (var j = 0; j < rows.length ; j++) {
								var data_valueId = rows.eq(j).attr('id');
								if (data_valueId == targetToEditId) {

									toAppend = "";

									var chk = $('#contextualInformation input:checked');
									for (var k = 0; k < chk.length; k++) {
										if(newTargetToEdit[chk[k].value]==null) {
											toAppend = toAppend + '<td>All '+ chk[k].name.split(' ')[0]+'s</td>';
										} else {
											toAppend = toAppend + '<td>' + eval('get' + chk[k].name.split(' ')[0] + '(' + newTargetToEdit[chk[k].value] + ').name') + '</td>';
										}
									}

									toAppend += "<td>" + lowerValue + "</td>";
									toAppend += "<td>" + upperValue + "</td>";
									toAppend += '<td width="25px" data-id=' + targetToEditId + ' style="cursor:pointer" align="center" title="Edit target" onclick="screen2.editTargetInfo('+targetToEditId+')" width="25px"><span class="glyphicon glyphicon-pencil" style="color:#333333" aria-hidden="true"></span></td>' 
									toAppend += '<td width="25px" data-id=' + targetToEditId + ' style="cursor:pointer" align="center" title="Delete element" ><span class="glyphicon glyphicon-minus" style="color:#333333" aria-hidden="true"></span></td>';

									document.getElementById('targetTable').getElementsByTagName('tr')[j].innerHTML = toAppend;
									
									$('#targetTable').find('tr').eq(j).find('td:last').click(function(e) {
										scr.delTargetInfo(e.currentTarget);
									})

									break;
								}
							}


							$.notify('Target updated', 'success');
							document.getElementById('addTargetBtn').style.display = "inline";
							document.getElementById('editTargetBtn').style.display = "none";
							document.getElementById('addTargetBtn').style.display = "inline";
							
							document.getElementById("upperBoundBox").value = "";
							document.getElementById("lowerBoundBox").value = "";							
							var rows = $('#targetList').find('tr').find('select');
							
							for (var j = 0; j < rows.length ; j++) {
								document.getElementById('targetList').getElementsByTagName('select')[j].selectedIndex = 0;
							}

							
						} else {
							$.notify("Violation of primary key constraint.\n Hint:Check bounds");
						}
	
					}
				});
			} else {
//					message: message, elementNameId: elementNameId
				$.notify(validateInfo.message);
				$(validateInfo.elementNameId).select();
//					$(validateInfo.elementNameId+"DecimalPlaces").select();
				
			}

		}
	}

	this.changeLoadedKpi = function(elId) {
		var oldId = loadedKpi;
		loadedKpi = arguments.length > 0 ? elId : "";
		var tree = $("#KPITree").jstree(true);
		var toDelete = true;
		for (var i = 0; i < this.kpiInfo.length; i++) {
			if (oldId == this.kpiInfo[i].id) {
				toDelete = false;
				break;
			}
		}
		if (toDelete) {
			tree.delete_node(oldId);
			if (arguments.length > 0) {
				if (!tree.get_text(elId).endsWith('</span>')) {
					tree.edit(elId);
				}
			}
		}
	}


}

var originalVerticalSet;
var originalHorizontalSet;

function ScreenGraph(kpiInfo) {
//	window.alert("ScreenGraph initialization");
	this.testGraphData = JSON.parse('{"data":[' + '[3,4,1,6,4,8,null,8,6,3],' + '[7,3,9,2,4,5,9,3,4,5],' + '[2,5,6,2,14,6,7,6,3,9]],' + '"subTitle":"Source: use case data",' + '"legend":["A","B","C"],' + '"title":"Availability",' + '"labels":["December","January","February","March","April","May"]}');
	this.kpiInfo = kpiInfo;
	var scr = this;
	$.get('inc/screengraph.inc', function(content) {
		scr.content = content;
	});

	this.getRandomColor = function() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.seededRandom(16, 0))];
		}
		return color;
	}
	this.adjustGraph = function() {
		var chart = $('#chart')
		if (chart.length > 0) {
			chart.find('svg').attr('width', 0);
			if (chart.chart('config') !== false) {
				chart.chart();
				chart.find('svg').attr('width', 400);
				chart.chart('config').features.legend.x = chart.width() - 100;
				chart.chart();
				var series = $.elycharts.templates['line_basic_1'].series;
				var len = this.graphData.data.length;
				var objs = chart.find('[fill="none"]');
				for (var i = 0; i < len; i++) {
					var color = series['serie' + (i + 1)].color;
					objs.eq(i + objs.length - len).attr('fill', color);
				}
			}
		}
	}
	this.adjustHeatMap = function() {
		var heatMap = $('#heatMap');
		if (heatMap.length > 0) {
			this.initializeHeatMap(this.heatMapData);
		}
	}

	$(window).resize(function() {
		scrGraph.adjustGraph();
		scrGraph.adjustHeatMap();

	});

	this.startYear=null;

	this.graphContextualInformation="Global";

	this.graphGranularity = "monthly";

	this.updateGraph = function() {
		this.graphContextualInformation = $('#graphTable').find('input:checked').val();
		this.graphGranularity=$('#granularityChart').val();
		var graphStartTime = $('#fromDateChart').handleDtpicker('getDate').getTime();
		this.startYear=(new Date(graphStartTime)).getFullYear();
		var graphEndTime = $('#toDateChart').handleDtpicker('getDate').getTime();
		var graphGranularity = $('#granularityChart').val();
		var granularityID = $('#granularityChart').find(":selected").attr("id");
		var enablePred = $('#predictionSwitch').is(":checked");
		
		var contextValueId = $('#context_select_list').val();
		var contextValueIdStr = "";
		if (contextValueId != null) 
			contextValueIdStr = "&contextValueId="+contextValueId;
				
		var secondContextValue = $('#second_context_select_listID').val();
		var secondContextValueStr = "";
		if (secondContextValue != null)
			secondContextValueStr = "&secondContext="+secondContextValue;
		
		var includeGlobal = $('#GlobalIncludeId').is(":checked");
		var includeGlobalStr = "&includeGlobal="+includeGlobal;
				
		//scr.initializeGraph(this.testGraphData);
		var evaluation = isDatetimeOk(graphGranularity, graphStartTime, graphEndTime);
		if(!evaluation.isDateTimeOk){
			$.notify(evaluation.message, {
				'autoHideDelay': 10000
				});
		} else {
			var checked = $('input:checked').slice(0,5).first().val();
			$('#graphTable').block({
				'message': "Updating graph. Please wait...",
				css: { 
		            border: 'none', 
		            padding: '15px', 
		            backgroundColor: '#000', 
		            '-webkit-border-radius': '10px', 
		            '-moz-border-radius': '10px', 
		            opacity: .5, 
		            color: '#fff' 
		        } 
				
			});
			$.ajax({
				url: restAddress + "func/getGraphData?kpiId=" + loadedKpi + 
									"&contextualInformation=" + this.graphContextualInformation + 
									"&startTime=" + graphStartTime + 
									"&endTime=" + graphEndTime + 
	 								"&granularity=" + graphGranularity + 
	 								"&granularityID=" + granularityID + 
	 							    "&withPrediction="+ enablePred+
									contextValueIdStr +
									secondContextValueStr +
									includeGlobalStr,
				type: "GET",
				success: function(graphData) {
					scr.initializeGraph(graphData,checked);
					$('#graphTable').unblock();
					$.notify('Graph updated.', 'success');
				},
			});
		}

	}
	this.updateHeatMap = function(startDate,endDate,legend) {
		var graphRadioValue = $('#heatMapTable').find('input:checked').val();
		var horizontalSet = $('#horizontalSet').val();
		var verticalSet = $('#verticalSet').val();
		var heatMapStartTime = startDate!==undefined?startDate:$('#fromDateHeatMap').handleDtpicker('getDate').getTime();
		var heatMapEndTime = endDate!==undefined?endDate:$('#toDateHeatMap').handleDtpicker('getDate').getTime()+1;
		var contextName = legend!==undefined?legend:'Global';
		var heatMapGranularity = legend!==undefined?$('#granularityChart').val():$('#granularityHeatMap').val()
		var evaluation = isDatetimeOk(heatMapGranularity, heatMapStartTime, heatMapEndTime);
		if(!evaluation.isDateTimeOk){
			$.notify(evaluation.message, {
				'autoHideDelay': 10000
				});
		} else {
			$('#heatMapTable').block({
				'message': "Updating heatmap. Please wait...",
				css : { 
		            border: 'none', 
		            padding: '15px', 
		            backgroundColor: '#000', 
		            '-webkit-border-radius': '10px', 
		            '-moz-border-radius': '10px', 
		            opacity: .5, 
		            color: '#fff' 
		        } 
			});
			$.ajax({
				url: restAddress + "func/getHeatMapData?kpiId=" + loadedKpi +
									"&contextualInformation="+scr.graphContextualInformation+ 
									"&varX="+horizontalSet+
									"&varY="+verticalSet+ 
									"&startTime=" + heatMapStartTime + 
									"&endTime=" + heatMapEndTime + 
									"&granularity=" + /*heatMapGranularity+*/ "NONE" +
									"&contextName="+contextName,
				type: "GET",
				success: function(heatMapData) {
					scr.initializeHeatMap(heatMapData);
					$('#heatMapTable').unblock();
					$.notify('Heatmap updated.', 'success');
					
				}
			});
			$('#fromDateHeatMap').handleDtpicker('setDate',heatMapStartTime);
			$('#toDateHeatMap').handleDtpicker('setDate',heatMapEndTime);
//			$('#granularityHeatMap').val(heatMapGranularity);
		}
		
	}
	this.connect = function() {
		if (this.socket !== undefined) {
			this.socket.disconnect();
		}
		this.socket = io(socketIOAddress, {
			'force new connection': true,
			'transports': ['polling']
		});
		this.socket.on('message', function(data) {
			var KPIName = "";
			var KPIRecName = data.kpi === undefined ? "" : data.kpi;
			for (var i = 0; i < scr.kpiInfo.length; i++) {
				if (scr.kpiInfo[i].id == loadedKpi) {
					KPIName = scr.kpiInfo[i].name;
					break;
				}
			}
			if (KPIName == KPIRecName) {
				scr.totalUnits(data.totalUnits);
				scr.scrapRate(data.scrapRate);
				scr.oee(data.oee);
			}

		});
	}

	this.disconnect = function() {
		if (this.socket !== undefined) {
			this.socket.disconnect();
		}
	}

	this.liveSample = function() {

		setInterval(function() {
			scr.scrapRate(parseInt(Math.random() * 100 + 0.5))
			scr.oee(parseInt(Math.random() * 100 + 0.5))
			scr.totalUnits(parseInt(Math.random() * 20 + 0.5))
		}, 1000);
	}

	this.totalUnits = function(val) {
		if (arguments.length == 0) {
			return parseFloat($('#totalUnits').text());
		} else if (val !== '' && !isNaN(val) && $('#totalUnits').length > 0) {
			$('#totalUnits').text(eval(val));
		}
	}

	this.scrapRate = function(val) {
		if (arguments.length == 0) {
			return parseFloat(this.gage.txtValue[0].textContent)
		} else if (val !== '' && !isNaN(val) && this.gage !== undefined) {
			this.gage.refresh(eval(val));
		}
	}

	this.oee = function(val) {
		if (arguments.length == 0) {
			return parseFloat($('.progress-bar').text());
		} else if (val !== '' && !isNaN(val) && $('.progress-bar').length > 0) {
			$('.progress-bar').text(eval(val) + "%")
			$('.progress-bar').css('width', eval(val) + '%').attr('aria-valuenow', eval(val));
		}
	}



	this.openScreen = function(id) {
		$('.content').html(this.content);
		$('#predictionSwitch').bootstrapSwitch();
		this.graphContextualInformation="Global";
		this.graphGranularity = "monthly";
		var radiosGraph = $('#graphTable').find('td').slice(1, 5);
		var verticalSet = $('#verticalSet');
		var horizontalSet = $('#horizontalSet');
		if (arguments.length > 0) {
			for (var i = 0; i < this.kpiInfo.length; i++) {
				if (this.kpiInfo[i].id == id) {
					var element = this.kpiInfo[i];
					for (var j = 0; j < 4; j++) {
						var contains = element[radiosGraph.eq(j).attr('data-cInfo')];
						radiosGraph.eq(j).attr('hidden', !contains);
						verticalSet.find('option').eq(j).attr('hidden', !contains);
						horizontalSet.find('option').eq(j).attr('hidden', !contains);
					}
					if(verticalSet.find('option').eq(2).attr('hidden'))
					{
						var tmpObj=verticalSet.find('option[hidden!=hidden]');
						if(tmpObj.length>0)
						{
							tmpObj.eq(0).attr('selected',true);
						}
						else
						{
							verticalSet.val(null);
						}
					}
					if(horizontalSet.find('option').eq(1).attr('hidden'))
					{
						var tmpObj=horizontalSet.find('option[hidden!=hidden]');
						if(tmpObj.length>0)
						{
							tmpObj.eq(0).attr('selected',true);
						}
						else
						{
							horizontalSet.val(null);
						}
					}
					break;
				}
			}
		}
		

		
		var graphContextualInformation = $('#graphTable').find('input:checked').val();
		var firstGraphDate = new Date(2014, 11, 1, 6, 0, 0, 0);
		var secondGraphDate = new Date(2015, 5, 1, 5, 59, 59, 9);
		var graphStartTime = firstGraphDate.getTime();
		this.startYear=(new Date(graphStartTime)).getFullYear();
		var graphEndTime = secondGraphDate.getTime();
		var graphGranularity = $('#granularityChart').val();
		var granularityID = $('#granularityChart').find(":selected").attr("id");
		var enablePred = $('#predictionSwitch').is(":checked");
		$('#graphButton').on('click', function(event) {
			scr.updateGraph();
			var startDate = ($('#fromDateChart').handleDtpicker('getDate').getTime())!==undefined?$('#fromDateChart').handleDtpicker('getDate').getTime():graphStartTime;
			var endDate = ($('#toDateChart').handleDtpicker('getDate').getTime())!==undefined?$('#toDateChart').handleDtpicker('getDate').getTime():graphEndTime;
			scr.updateHeatMap(startDate,endDate);
		});
		$('#heatMapButton').on('click', function(event) {
			scr.updateHeatMap();
		});
		
		//this.initializeGraph(this.testGraphData,true);
		var checked = $('input:checked').slice(0,5).first().val();
		$.ajax({
			url: restAddress + "func/getGraphData?kpiId=" + loadedKpi + 
							   "&contextualInformation=" + graphContextualInformation + 
							   "&granularity=" + graphGranularity +
							   "&granularityID=" + granularityID +
							   "&withPrediction="+ enablePred+
							   "&startTime=" + graphStartTime + 
							   "&endTime=" + graphEndTime,
			type: "GET",
			success: function(graphData) {
				scr.initializeGraph(graphData,checked);
			},
		});
		var graphRadioValue = $('#heatMapTable').find('input:checked').val();
		var horizontalSet = $('#horizontalSet').val();
		var verticalSet = $('#verticalSet').val();
		var firstHeatDate = new Date(2015, 4, 1, 6, 0, 0, 0); 
		var secondHeatDate = new Date(2015, 5, 1, 5, 59, 59, 9);
//		var secondHeatDate = new Date(2015, 4, 31, 23, 59, 59, 9);
		var heatMapStartTime = firstHeatDate.getTime();
		var heatMapEndTime = secondHeatDate.getTime();
		var heatMapGranularity = $('#granularityHeatMap').val();
		
		// request for HeatMap data when opening the page
		$.ajax({
			url: restAddress + "func/getHeatMapData?kpiId=" + loadedKpi + 
							   "&contextualInformation=" + graphContextualInformation + 
							   "&varX="+horizontalSet + 
							   "&varY="+verticalSet +
							   "&startTime=" + heatMapStartTime + 
							   "&endTime=" + heatMapEndTime + 
							   "&granularity=" + /*heatMapGranularity+*/ "NONE" + 
							   /* ContextName when page is opening is Global */
							   "&contextName=Global",
			type: "GET",
			success: function(heatMapData) {
				scr.initializeHeatMap(heatMapData)
			}
		});

		$('#fromDateChart').appendDtpicker({
				"dateOnly": false,
				"closeOnSelected": true,
				"todayButton": false,
				"onShow": function(handler){},
				"onHide": function(handler){}
				}, firstGraphDate); /*
			.keyup(closeDtPickerOnEnter)
			.blur(function(handler) {
				window.alert($(this).handleDtpicker('getDate'));
				window.alert($(this).val());
				$('.datepicker').hide();
			  });*/
		
		$('#toDateChart').appendDtpicker({
				"dateOnly": false,
				"closeOnSelected": true,
				"todayButton": false,
				"onShow": function(handler) {},
				"onHide": function(handler) {}
			},
			secondGraphDate);/*
			.keyup(closeDtPickerOnEnter)
			.blur(function() {
				$('.datepicker').hide();
			  });*/
		
		$('#fromDateHeatMap').appendDtpicker({
				"dateOnly": false,
				"closeOnSelected": true,
				"todayButton": false,
				"onShow": function(handler) {},
				"onHide": function(handler) {}
			},
			firstHeatDate);/*
			.keyup(closeDtPickerOnEnter)
			.blur(function() {
				$('.datepicker').hide();
			  });*/

		$('#toDateHeatMap').appendDtpicker({
				"dateOnly": false,
				"closeOnSelected": true,
				"todayButton": false,
				"onShow": function(handler) {},
				"onHide": function(handler) {}
			},
			secondHeatDate);/*
			.keyup(closeDtPickerOnEnter)
			.blur(function() {
				$('.datepicker').hide();
			  });*/
		

		this.gage = new JustGage({
			id: "gauge",
			value: 0,
			min: 0,
			max: 100,
			titleFontColor: "#000",
			titleFontSize: 20,
			title: "Scrap rate",
		});
		
		$.ajax({
			url: restAddress + "func/getRealTimeKpis?kpiId=" + loadedKpi,
			type: "GET",
			success: function(realTimeKpisData) {
				scr.totalUnits(realTimeKpisData.totalUnits);
				scr.scrapRate(realTimeKpisData.scrapRate);
				scr.oee(realTimeKpisData.oee);
			},
		});
		showScreen(true);

		//this.connect();

	}

	/**
	 * numSeries: Number of series in the graph;
	 * numValuesPerSerie: Number of points in each serie in the graph (only relevant when values are passed as Input A;
	 * Input A: Receives individual numbers in following format: 1,2,34,12.2,...
	 * Input B: Receives sets of values in the following format: [1,2,34,12.2,...]
	 *
	 * Output: Formatted series for the graph as an object as: serieN:[1,2,34,12.2,...]
	 **/
	this.graphSeriesValues = function(seriesData) {
		var graphSeries = {};

		if (typeof(seriesData) == "object") {
			for (var i = 0; i < seriesData.length; i++) {
				graphSeries["serie" + (i + 1)] = seriesData[i];
			}
		}
		return graphSeries;
	}

	this.closeScreen = function() {
		showScreen(false);
		$('.content').html('');
		this.disconnect();
	}

	this.initializeHeatMap = function(heatMapData) {
		this.heatMapData = heatMapData;
		var xLabelLength =  heatMapData.xLabels.length 
		var factor =xLabelLength/ 6 < 0.2 ? 0.2:xLabelLength/6 ;
		var data=[];
		var maxValue = -1;

		for(var i=0;i<heatMapData.data.length;i++)
		{
			var varX = heatMapData.data[i].varX;
			var varY = heatMapData.data[i].varY;
			var value = 0;
			
			if((loadedKpiNumberFormat=='PERCENTAGE') && (heatMapData.data[i].value != null) ) {
				value=parseFloat((heatMapData.data[i].value*100).toFixed(2));
			}
			else {
				value=heatMapData.data[i].value;
			}
			if (value != null)
				if (value > maxValue)
					maxValue = value;
			
			data.push({value:value,varX:heatMapData.data[i].varX,varY:heatMapData.data[i].varY})
		}
		var factorTemp = maxValue/6;		
		
		$('#heatMap').empty();
		$('#heatMap').width(0);
		var containerWidth = $('#heatMapTable').find('td').eq(4).width();
		var width = containerWidth < 550 * factor ? 550 * factor : containerWidth > 800 * factor ? 800 * factor : containerWidth+200;
		var minWidth = width<485?485:width;
		var deltaX=xLabelLength!=1?xLabelLength!=2?0:40:80
		$('#heatMap').width(minWidth);
		var margin = {
				top: 30,
				right: 0,
				bottom: 80,
				left: 140
			},
			height = (60) * heatMapData.yLabels.length,
			gridSize = Math.floor(width / (heatMapData.xLabels.length + 1)),
			gridHeight = 60/*118*/,
			legendElementWidth = gridSize*minWidth/width,
			buckets = 9,
			colors = generateColor("#FFFFFF", "#F7A35C", 18); // alternatively colorbrewer.YlGnBu[9]
		
		var svg = d3.select("#heatMap").append("svg")
			.attr("width", minWidth+150)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var yLabels = svg.selectAll(".dayLabel")
			.data(heatMapData.yLabels)
			.enter().append("text")
			.text(function(d) {
				return d;
			})
			.attr("x", deltaX)
			.attr("y", function(d, i) {
				return i * gridHeight - (gridHeight/2);
			})
			.style("text-anchor", "end")
			.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
			.attr("class", function(d, i) {
				return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
			});

		var xLabels = svg.selectAll(".timeLabel")
			.data(heatMapData.xLabels)
			.enter().append("text")
			.text(function(d) {
				return d;
			})
			.attr("x", function(d, i) {
				return i * gridSize+deltaX;
			})
			.attr("y", 0)
			.style("text-anchor", "middle")
			.attr("transform", "translate(" + gridSize / 2 + ", -6)")
			.attr("class", function(d, i) {
				return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
			});

		var colorScale = d3.scale.quantile()
			.domain([0, buckets - 1, d3.max(data, function(d) {
				return d.value;
			})])
			.range(colors);

		var cards = svg.selectAll(".hour")
			.data(data, function(d) {
				return d.varY + ':' + d.varX;
			});

		cards.append("title");
		
		cards.enter().append("rect")
			.attr("varX", function(d) {
				return d.varX
			})
			.attr("varY", function(d) {
				return d.varY
			})
			.attr("x", function(d) {
				return (d.varX - 1) * gridSize+deltaX;
			})
			.attr("y", function(d) {
				return (d.varY - 1) * gridHeight;
			})
			.attr("title", function(d) {
				return kpiFormatValueString(loadedKpiNumberFormat, d.value, true, false);
			})
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("class", "hour bordered")
			.attr("width", gridSize)
			.attr("height", gridHeight)
			.style("fill", colors[0]);

		cards.transition().duration(1000)
			.style("fill", function(d) {
				return colorScale(d.value);
			});

		cards.select("title").text(function(d) {
			return d.value;
		});

		cards.exit().remove();
		var colorScales = [];
		var colorsLegend = [];
		for (var j = 0; j < colorScale.quantiles().length; j++) {
			if (j % 4 == 0) {
				colorScales.push(colorScale.quantiles()[j]);
				colorsLegend.push(colors[j]);
			}
		}
		colorsLegend.push(colors[colors.length - 1]);

		var legend = svg.selectAll(".legend")
			.data([0].concat(colorScales), function(d) {
				return d;
			});

		legend.enter().append("g")
			.attr("class", "legend");
		legend.append("rect")
			.attr("x", function(d, i) {
				return legendElementWidth * factor * i;
			})
			.attr("y", height + margin.top)
			.attr("width", legendElementWidth * factor)
			.attr("height", gridHeight / 6)
			.style("fill", function(d, i) {
				return colorsLegend[i];
			});

		legend.append("text")
			.attr("class", "mono")
			.text(function(d) {
					return "≥ " + Math.round(d)  ;
			})
			.attr("x", function(d, i) {
				return legendElementWidth * factor * i;
			})
			.attr("y", height + gridHeight - 40);
		var fillColor = "";
		legend.exit().remove();
		$('rect').hover(function() {
				fillColor = $(this).css('fill');
				$(this).css('fill', '#AFE8FF');
				//var position = $(this).position();
				//alert( "left: " + position.left + ", top: " + position.top );
			},
			function() {
				$(this).css('fill', fillColor);
			});


		var KPIName = "";
		for (var i = 0; i < scr.kpiInfo.length; i++) {
			if (scr.kpiInfo[i].id == loadedKpi) {
				KPIName = scr.kpiInfo[i].name;
				break;
			}
		}
		
		initializeTooltips();
		
		$('#heatMapTitle').html('<h4>' + heatMapData.title + '</h4>' + (heatMapData.subTitle !== undefined ? '<h5>' + heatMapData.subTitle + '</h5>' : ''));
	}

	this.initializeGraph = function(graphData,checked) {
		this.graphData = graphData;
		if (graphData.data != null) {
			// KPI Chart
			var len = graphData.data.length;
			$.elycharts.templates['line_basic_1'] = {
				type: "line",
				margins: [10, 110, 20, 50],
				defaultSeries: {
					plotProps: {
						"stroke-width": 5
					},
					dot: true,
					dotProps: {
						stroke: "white",
						"stroke-width": 2
					}
				},
				series: {
					serie1: {
						fill: $('#GlobalIncludeId').is(":checked"),
						color: "#7CB5EC"
					},
				},
				defaultAxis: {
					labels: true
				},
				features: {
					mousearea: {
						onMouseClick: function(a, b, c, d) {
							/* 
							 * 
							 * b = serie name. ex: serie1; 
							 * c = serie index: if serie2 then c=2;
							 * 
							 * */
							if(b.startsWith('serie'))
							{
								var serieIndex = b.substring(5, b.length) - 1;
								var labelIndex = scr.graphData.labels.length  >1?Math.round((c / (scr.graphData.data[serieIndex].length - 1) * (scr.graphData.labels.length - 1))):0;
								var legend=scr.graphData.legend[serieIndex];
								var label = scr.graphData.labels[labelIndex]
								var startDate=new Date(parseInt(scr.graphData.labelsTimeStamp[labelIndex]));
								var n = 0;
								
								var endDate;
								switch(scr.graphGranularity)
								{
									case 'monthly':
										startDate.setHours(6,00);
										endDate=new Date(startDate.getTime());
										endDate.setMonth(endDate.getMonth()+1);
										endDate = new Date(endDate-1);
										break;
									case 'weekly':
										endDate = new Date(startDate.getTime()+(1000*3600*24*7-60));
										
										break;
									case 'daily':
										endDate = new Date(startDate.getTime()+(1000*3600*24-60));
										break;
									case 'hourly':
										endDate = new Date(startDate.getTime()+(1000*3600-60));
										break;
									default:
										endDate=new Date(startDate.getTime());
										endDate.setMonth(endDate.getMonth()+1);
								}
								scr.updateHeatMap(startDate.getTime(),endDate.getTime(),legend);
							}
						},
					},
					grid: {
						draw: [true, false],
						props: {
							"stroke-dasharray": "-"
						}
					},
					legend: {
						horizontal: false,
						width: 190,
						height: 13 * len,
						x: 700,
						y: 325 - 13 * len,
						dotProps: {
							stroke: "black",
							"stroke-width": 0
						},
						borderProps: {
							opacity: 0.0,
							"stroke-width": 0
						}
					}
				}
			};
			$(function() {
				Math.seed = 50;
				var initialPos= Object.keys($.elycharts.templates["line_basic_1"].series).length+1;
				for (i = initialPos; i <= len; i++) {
					$.elycharts.templates["line_basic_1"].series['serie' + i] = {
						'color': scr.getRandomColor()
					};
				}

				//add predictions to the char
				var result = (graphData.data).concat(graphData.predictions);
				for(var i = 0; i < graphData.predictions.length; i++){
				
					$.elycharts.templates["line_basic_1"].series['serie' + (len+1+i)] = {
							'color': $.elycharts.templates["line_basic_1"].series['serie' + (i+1)].color,
							'plotProps' : { "stroke-dasharray" : "-"}
						};					
				}

				
				$.elycharts.templates["line_basic_1"].features.legend.x = $('#chart').width() - 100;
				var limits=[];
				for(var i=0;i<kpiTargets.length;i++)
				{
					if(loadedKpi==kpiTargets[i].kpi_id)
					{
						var contextObj = [];
						var color =  null;
						var id = null;
						if(checked!="Global")
						{
							id = kpiTargets[i][checked+'_id'];
							contextObj = eval(checked+"s");
							var name = null;
							if(id!=null)
							{							
								for(var j=0;j<contextObj.length;j++)
								{
									if(contextObj[j].id==id)
									{
										name = contextObj[j].name;
										break;
									}									
								}
							}
							if(name!=null)
							{
								for(var j=0;j<graphData.legend.length;j++)
								{
									if(name==graphData.legend[j])
									{
										color = $.elycharts.templates["line_basic_1"].series["serie"+(j+1)].color;
										break;
									}
								}
							}
						}
						if((id==null && checked!="Global" )|| (id!=null && color!=null) || (checked=="Global" && kpiTargets[i].product_id== null &&kpiTargets[i].shift_id== null && kpiTargets[i].mould== null && kpiTargets[i].machine_id== null)){
							if(kpiTargets[i].lower_bound!=null && kpiTargets[i].lower_bound!="")
							{
								var obj={};
								var plotProps={};
								plotProps = {"stroke-dasharray" : "-"};
								obj.plotProps = plotProps;
								obj.color = color==null?$.elycharts.templates["line_basic_1"].series.serie1.color:color;
								obj.value = kpiTargets[i].lower_bound
								if ((i==0 && $('#GlobalIncludeId').is(":checked")) || i>0) {
									limits.push(obj);
								} 
							}
							
							if(kpiTargets[i].upper_bound!=null && kpiTargets[i].upper_bound!="")
							{
								var obj={};
								var plotProps={};
								plotProps = {"stroke-dasharray" : "-"};
								obj.plotProps = plotProps;
								obj.color = color==null?$.elycharts.templates["line_basic_1"].series.serie1.color:color;
								obj.value = kpiTargets[i].upper_bound
								if ((i==0 && $('#GlobalIncludeId').is(":checked")) || i>0) {
									limits.push(obj);
								} 
							}
						}
					}
				}
				$("#chart").chart("clear");
				$("#chart").chart({
					template: "line_basic_1",
					tooltips: function(serieId, lineIndex, valueIndex, singleValue) {
						var legend="";
						if(lineIndex.startsWith("serie")) {
							var index = lineIndex.substring(5,lineIndex.length)-1;
							if(index >= len)
								index-=len;
							legend=this.legend[index]+"<br>";
						}
						else {
							legend="Target<br>";
						}
						legend+="Date: "+graphData.labels[valueIndex]+"<br>";
						var value = legend+  /*(loadedKpi >= "4" ? 
								'Value: ' + parseFloat((singleValue * 100).toFixed(2)) + "%" : 
								'Value: ' + parseFloat(singleValue.toFixed(3)));*/
								kpiFormatValueString(loadedKpiNumberFormat, singleValue, true, true);
						return value;
					},
					percentage:isPercentage(loadedKpiNumberFormat)/*loadedKpi>=4?true:false,false*/,
					legend: graphData.legend,
					labels: graphData.labels,
					values: scr.graphSeriesValues(result),
					limits: limits,
					defaultSeries: {
						tooltip: {
							width: 100,
							height: 60,
							contentStyle: {
								"text-align": "center"
							}
						},
						fill: false,
						stacked: false,
						highlight: {
							scale: 2
						},
						startAnimation: {
							active: true,
							type: "grow",
							easing: "bounce"
						}
					}
				});
				var series = $.elycharts.templates['line_basic_1'].series;
				var objs = $('#chart').find('[fill="none"]');
				for (var i = 0; i < len; i++) {
					var color = series['serie' + (i + 1)].color;
					objs.eq(i + objs.length - len).attr('fill', color);
				}

				var KPIName = "";
				for (var i = 0; i < scr.kpiInfo.length; i++) {
					if (scr.kpiInfo[i].id == loadedKpi) {
						KPIName = scr.kpiInfo[i].name;
						break;
					}
				}

				$('#chartTitle').html('<h4>' + graphData.title + '</h4>' + (graphData.subTitle !== undefined ? '<h5>' + graphData.subTitle + '</h5>' : ''));


			});
			if ($('#graphTable').width() != $('#page-content-wrapper').width()) {
				this.adjustGraph();
			}
		}
	};

	/*
	$.elycharts.templates['line_basic_1'] = {
		type: "line",
		margins: [10, 110, 20, 50],
		defaultSeries: {
			plotProps: {
				"stroke-width": 4
			},
			dot: true,
			dotProps: {
				stroke: "white",
				"stroke-width": 2
			}
		},
		series: {
			serie1: {
				color: "#7CB5EC"
			},
			serie2: {
				color: "#FF2020"
			},
			serie3: {
				color: "#90ED7D"
			},
			serie4: {
				color: "#F7A35C"
			},
			serie5: {
				color: "#C0C0C0"
			},


		},
		defaultAxis: {
			labels: true
		},
		features: {
			grid: {
				draw: [true, false],
				props: {
					"stroke-dasharray": "-"
				}
			},
			legend: {
				horizontal: false,
				width: 190,
				height: 80,
				x: 700,
				y: 240,
				dotProps: {
					stroke: "black",
					"stroke-width": 0
				},
				borderProps: {
					opacity: 0.0,
					"stroke-width": 0
				}
			}
		}
	};*/
}

function ScreenQuery() {
	// window.alert("ScreenGraph initialization");
	var scr = this;

	this.baseUrl = '/storage-reader/query';
	$.get("inc/screenquery.inc", function(content) {
		scr.content = content;
	});

	this.openScreen = function() {
		$('.content').html(this.content);
		showScreen(true);
		$('#sendBtn').on('click', function(event) {
			scr.send();
		});
		this.selectBoxes();
		$('.queryBox').change(this.queryBoxes);
		$('.editBox').change(this.updateUrl);

	}

	this.closeScreen = function() {
		showScreen(false);
		$('.content').html('');
	}
	this.queryBoxes = function(e) {
		scr.selectBoxes();
	}
	this.selectBoxes = function() {
		$('#attributesTable').find('tr').css('display', 'none');
		$('#startTime').css('display', 'table-row');
		$('#endTime').css('display', 'table-row');
		if ($('#eventType').val() == 'anomaly' || $('#eventType').val() == 'feedback') {
			$('#queryType').val('default');
			$('.amm').css('display', 'none');
		} else {
			$('.amm').css('display', 'block');
		}
		$('#url').val(this.baseUrl + '/' + $('#eventType').val() + '/' + $('#queryType').val())
		if ($('#queryType').val() != 'default') {
			$('#propertyKey').css('display', 'table-row');
		}
		if ($('#eventType').val() == 'simple') {
			$('#sensorId').css('display', 'table-row');

		}
		if ($('#eventType').val() == 'derived') {
			$('#componentId').css('display', 'table-row');
		}
		if ($('#eventType').val() == 'predicted') {
			$('#eventName').css('display', 'table-row');
		}
		if ($('#eventType').val() == 'anomaly') {
			$('#anomalyType').css('display', 'table-row');
		}
		if ($('#eventType').val() == 'recommendation') {
			if ($('#queryType').val() == 'default') {
				$('#actor').css('display', 'table-row');
				$('#eventName').css('display', 'table-row');
				$('#recommendationId').css('display', 'table-row');
			}
		}
		if ($('#eventType').val() == 'feedback') {
			$('#actor').css('display', 'table-row')
			$('#recommendationId').css('display', 'table-row')
		}
		if ($('#eventType').val() == 'default') {
			$('#actor').css('display', 'table-row');
			$('#recommendationId').css('display', 'table-row');
		}
		this.updateUrl();
	}
	this.updateUrl = function() {
		var attributes = $('#attributesTable').find('tr:visible');
		var url = $('#url').val().split('?')[0] + '?';
		for (var i = 0; i < attributes.length; i++) {
			var attr = scr.getAttribute(attributes.eq(i));
			if (attr != "") {
				url = url + attributes.eq(i).attr('id') + '=' + attr;
				url = url + '&';
			}
		}
		url = url.slice(0, url.length - 1);
		$('#url').val(url);
	}

	this.getAttribute = function(el) {
		var selector = (el.attr('id') == "sensorId" || el.attr('id') == "propertyKey") ? 'select' : 'input';
		if (el.attr('id').indexOf('Time') > -1) {
			var els = el.find(selector);
			return (new Date(els.eq(0).val(), els.eq(1).val() - 1, els.eq(2).val(), els.eq(3).val(), els.eq(4).val(), els.eq(5).val())).getTime();
		} else {
			return el.find(selector).val();
		}
	}
	this.send = function() {
		var response = $.get($('#url').val());
		this.postResponse(response);

	}
	this.postResponse = function(res) {
		if (res.responseText === undefined) {
			setTimeout(function() {
				scr.postResponse(res)
			}, 100);
		} else {
			$('#textBox').val(res.responseText);
		}
	}
}

var dropdownclass = "class=\"btn btn-primary form-control form-control-custom\"";

var originalVerticalSetLoaded = true;
var originalHorizontalSetLoaded = true;
var originalVerticalSet;
var originalHorizontalSet;

function loadOriginalContextSets(){
	if (originalHorizontalSetLoaded && originalVerticalSetLoaded){
		originalVerticalSet = document.getElementById("verticalSet").cloneNode(true);
		originalVerticalSetLoaded = false;
		
		originalHorizontalSet = document.getElementById("horizontalSet").cloneNode(true);
		originalHorizontalSetLoaded = false;
	}
}

function insertContextSelectList() {
	clearContextLists();	
	clearSecContextsLists();
	loadOriginalContextSets();

	// btn btn-primary form-control form-control-custom 
	var openHTML =  "<select id=\"context_select_list\" "+dropdownclass+" size=\"1\" onchange=\"addMoreContext("+arguments[0]+")\">" +
					"<option value=\"0\">All</option>";
	var closeHTML = "</select>";
	var elementId = "";
	var content = "";
	var contextArr;	
	
	switch (arguments[0]) {
		case 1: elementId =  "contextProductSelectList";
				contextArr = products;
				document.getElementById("verticalSet").outerHTML = removeOneContext("product", originalVerticalSet.cloneNode(true)).outerHTML;
				document.getElementById("verticalSet").selected
				document.getElementById("horizontalSet").outerHTML = removeOneContext("product", originalHorizontalSet.cloneNode(true)).outerHTML;
				document.getElementById("GlobalIncludeId").disabled = false;
				document.getElementById("GlobalIncludeIdDiv").setAttribute('class','checkbox');
		break;
		case 2: elementId = "contextMachineSelectList";
				contextArr = machines;
				document.getElementById("verticalSet").outerHTML = removeOneContext("machine", originalVerticalSet.cloneNode(true)).outerHTML;
				document.getElementById("horizontalSet").outerHTML = removeOneContext("machine", originalHorizontalSet.cloneNode(true)).outerHTML;
				document.getElementById("GlobalIncludeId").disabled = false;
				document.getElementById("GlobalIncludeIdDiv").setAttribute('class','checkbox');
		break;
		case 3: elementId = "contextShiftSelectList";
				contextArr = shifts;
				document.getElementById("verticalSet").outerHTML = removeOneContext("shift", originalVerticalSet.cloneNode(true)).outerHTML;
				document.getElementById("horizontalSet").outerHTML = removeOneContext("shift", originalHorizontalSet.cloneNode(true)).outerHTML;
				document.getElementById("GlobalIncludeId").disabled = false;
				document.getElementById("GlobalIncludeIdDiv").setAttribute('class','checkbox');
		break;
		case 4: elementId = "contextMouldSelectList";
				contextArr = moulds;
				document.getElementById("verticalSet").outerHTML = removeOneContext("mould", originalVerticalSet.cloneNode(true)).outerHTML;
				document.getElementById("horizontalSet").outerHTML = removeOneContext("mould", originalHorizontalSet.cloneNode(true)).outerHTML;
				document.getElementById("GlobalIncludeId").disabled = false;
				document.getElementById("GlobalIncludeIdDiv").setAttribute('class','checkbox');
		break;
		default:
			document.getElementById("verticalSet").outerHTML = originalVerticalSet.outerHTML;
			document.getElementById("horizontalSet").outerHTML = originalHorizontalSet.outerHTML;
			document.getElementById("GlobalIncludeId").disabled = true;
			document.getElementById("GlobalIncludeId").checked = true;
			document.getElementById("GlobalIncludeIdDiv").setAttribute('class','checkbox disabled');
			break;
	}
	
	document.getElementById("verticalSet").selectedIndex  = "1";
	document.getElementById("horizontalSet").selectedIndex  = "0";
	
//	if (elementId != ""){
//		for (var i = 0; i<contextArr.length;i++) {
//			content += "<option value=\""+contextArr[i].id+"\">"+contextArr[i].name+"</option>";
//			
//		}
//		document.getElementById(elementId).innerHTML = openHTML + content + closeHTML;
//	}
	if (elementId != ""){
		document.getElementById(elementId).innerHTML = constructContextSelect(contextArr, arguments[0]);
	}
	
	
}

function constructContextSelect(contextArr){
	var openHTML =  "<select id=\"context_select_list\" "+dropdownclass+" size=\"1\" onchange=\"addMoreContext("+arguments[1]+")\">" +
					"<option value=\"0\">All</option>";
	var closeHTML = "</select>";
	var content="";
	
	for (var i = 0; i<contextArr.length;i++) {
		content += "<option value=\""+contextArr[i].id+"\">"+contextArr[i].name+"</option>";
	}
	
	
	
	return openHTML + content + closeHTML;
}


function addMoreContext(){
	var contextSelectList = document.getElementById("context_select_list").value;
	
	if (contextSelectList == 0){
		clearSecContextsLists();
	}
	else {
		var contextName = "";
		var elementId = "";

		switch (arguments[0]){
		case 1: contextName = "product";
//				elementId = "secContextProductSelectList";
				elementId = "";
				break;
		case 2: contextName = "machine";
				elementId = "secContextMachineSelectList";
				break;
		case 3: contextName = "shift";
//				elementId = "secContextShiftSelectList";
				elementId = "";
				break;
		case 4: contextName = "mould";
//				elementId = "secContextMouldSelectList";
				elementId = "";
				break;
		default:break;
		}
		
		var contextList = originalVerticalSet.cloneNode(true);
		contextList.id = "second_context_select_listID";

		contextList.setAttribute ("class", "btn btn-primary form-control form-control-custom");

		contextList = removeOneContext(contextName, contextList);
		
		if (elementId != ""){
			var noneOp = document.createElement("option");
			noneOp.setAttribute("selected","selected");
			noneOp.setAttribute("value","none");
//			
			noneOp.innerHTML = "None";
			
			contextList.appendChild(noneOp);
//			document.getElementById(elementId).innerHTML = "+"+contextList.outerHTML;
			
			document.getElementById(elementId).innerHTML = "+"+constructContextSelect(products);
		}
	}
}



function removeOneContext(contextName, contextList){
	for (var ct = 0; ct<contextList.childNodes.length; ct++){
		if (contextList.childNodes[ct].value == contextName){
			contextList.childNodes[ct].remove();
			break;
		}
	}
	return contextList;
}

function clearSecContextsLists(){
	document.getElementById("secContextProductSelectList").innerHTML = "";
	document.getElementById("secContextMachineSelectList").innerHTML = "";
	document.getElementById("secContextShiftSelectList").innerHTML = "";
	document.getElementById("secContextMouldSelectList").innerHTML = "";

}

function clearContextLists(){
	document.getElementById("contextProductSelectList").innerHTML = "";
	document.getElementById("contextMachineSelectList").innerHTML = "";	
	document.getElementById("contextShiftSelectList").innerHTML = "";
	document.getElementById("contextMouldSelectList").innerHTML = "";
}

function addKpiNumberSupport(){
	var calculationTypeVal = document.getElementById("calculationType").value;

	if (calculationTypeVal == "simple"){
		document.getElementById("numberSupport").style.color = "#000000";
		document.getElementById("numberSupport").disabled = false;
	} else {
		document.getElementById("numberSupport").value = "numeric";
		document.getElementById("numberSupport").style.color = "#808080";
		document.getElementById("numberSupport").disabled = true;
		document.getElementById("numberSupportFormat").style.visibility = "visible";
		document.getElementById("numberSupportFormatDecimalPlaces").style.visibility = "visible";
	}
}

function addKpiNumberSupportFormat(){
	var kpiNumberSupportVal = document.getElementById("numberSupport").value;
	
	if (kpiNumberSupportVal == "numeric"){
		document.getElementById("numberSupportFormat").style.visibility = "visible";
		document.getElementById("numberSupportFormatDecimalPlaces").style.visibility = "visible";
	} else {
		document.getElementById("numberSupportFormat").style.visibility = "hidden";
		document.getElementById("numberSupportFormatDecimalPlaces").style.visibility = "hidden";
	}
}

function kpiFormatValueString(kpiNumberSupportFormat, value, label, multiply100){
	var result = "";
//	console.log("Before:kpiNumberSupportFormat: "+kpiNumberSupportFormat +
//			";Value: " + value +
//			";With Label: "+label + 
//			";Result: " + result);
	
	if ((kpiNumberSupportFormat == '')||(value == null)){
		result = "No data";
	} else if (kpiNumberSupportFormat == 'PERCENTAGE'){
		//if (value.contains("%"))
			if (multiply100)
				result = ""+(value*100).toFixed(2)+"%";
			else
				result = ""+value.toFixed(2)+"%";
	} else if (kpiNumberSupportFormat == 'DECIMAL'){
		if ( (eval(value)>0) && (eval(value)<1))
			result = ""+value.toFixed(3);
		else
			result = ""+value;
	}
	if ( (label == true) && (value != null) ) {
		result = "Value: "+result;
	}
//	console.log("After: kpiNumberSupportFormat: "+kpiNumberSupportFormat +
//			";Value: " + value +
//			";With Label: "+label + 
//			";Result: " + result);
	return result;
}


function isPercentage(kpiToEval){
	if (kpiToEval == 'PERCENTAGE'){
		return true;
	} else 
		return false;
	
}

function isDatetimeOk(granularity, graphStartTime, graphEndTime) {
	// check 1 - From date & time more recent than to date & time and same day & time
	// check 2 - From date & time more recent than to date & time
	// check 3 - Date & time date interval larger than chosen granularity
	// check 4 - From date & time needs to start at first element of granularity (first day of month, first day of week, etc)
	var message = '';
	var resultDtTmOk = true;
	
	if (graphStartTime >= graphEndTime){
		resultDtTmOk = false;
		if (graphStartTime > graphEndTime){
				message = '"FROM" date cannot be later than "TO" date.\nPlease choose valid dates and press update again.';
			} else {
				message = 'Date & times cannot be equal.\nPlease choose valid dates and press update again.';
			}
	} else {
//		var evaluation = isInGranularity(granularity, graphStartTime, graphEndTime);
//		if (!evaluation.isInGranularity){
//			resultDtTmOk = false;
//			message = evaluation.message;
//		}
	}
	
	return { isDateTimeOk : resultDtTmOk,
			 message: message
	};

}


function isInGranularity(granularity, initialDate, finalDate){
	// if needed, subtract (-60000) to right value in time difference to finish period one minute before
	var response = true;
	var message = '';
	
	switch (granularity){
		// the timestamp numeric value for 1 hour is 1000*60*60=3600000
		case 'hourly':
			var minutes = new Date(initialDate).getMinutes();
			if (timeDifference(initialDate, finalDate) < 3600000){
				message = 'Incorrect value for Date & time. \nPlease choose a time frame larger than 1 hour.';
				response = false;
			} else {
				if (minutes !=0){
					message = 'Please choose the beginning of an hour (ex:03:00 or 22:00).';
					response = false;
				} else {
					response = true;
				}
			}
			break;
		// the timestamp numeric value for 1 day is 1000*60*60*24=86400000
		case 'daily': 
			var hours = new Date(initialDate).getHours();
			var minutes = new Date(initialDate).getMinutes();
			if (timeDifference(initialDate, finalDate) < 86400000){
				message = 'Incorrect value for Date & time. \nPlease choose a time frame larger than 1 day.';
				response = false;
			} else {
				if ((hours != 0) || (minutes !=0)){
					message = 'Please choose the beginning of a day (00:00).';
					response = false;
				} else {
					response = true;
				}
			}
			break;
		// the timestamp numeric value for 1 week is 1000*60*60*24*7=604800000
		case 'weekly':
			var weekday = new Date(initialDate).getDay();
			if (timeDifference(initialDate, finalDate) < 604800000){
				message = 'Incorrect value for Date & time. \nPlease choose a time frame larger than 1 week.';
				response = false;
			} else {
				if (weekday != 1) {
					message = 'Please choose the beginning of a week (monday).';
					response = false;
				} else {
					response = true;
				}
			}
			break;
		// the timestamp numeric value for 1 month is 1000*60*60*24*30=2592000000
			// verify 30 days months, 31 days months and february
		case 'monthly':
			var month = new Date(initialDate).getMonth();
			var day = new Date(initialDate).getDate();
			var monthDays = getMonthDays(month);
			if (timeDifference(initialDate, finalDate) < 86400000*monthDays){
				message = 'Incorrect value for Date & time. \nPlease choose a time frame larger than 1 month.';
				response = false;
			} else {
				if (day != 1) {
					message = 'Please choose the beginning of a month.';
					response = false;
				} else {
					response = true;
				}
			}
			break;
		default: break;
	}
	return {isInGranularity:response,
			message:message};
}

function timeDifference(initialDate,finalDate) {
//  var difference = finalDate.getTime() - initialDate.getTime();
  var difference = finalDate - initialDate;
  var result = difference;
  
  var daysDifference = Math.floor(difference/1000/60/60/24);
  difference -= daysDifference*1000*60*60*24;

  var hoursDifference = Math.floor(difference/1000/60/60);
  difference -= hoursDifference*1000*60*60;

  var minutesDifference = Math.floor(difference/1000/60);
  difference -= minutesDifference*1000*60;

  var secondsDifference = Math.floor(difference/1000);
  
  return result;
}

function getMonthDays(month){
//	var monthDays = (month == 2)? 28: ((month % 2 == 0)&&(month<7))?30:0;
	if (month == 1)
		return 28;
	if ( ((month % 2 == 0)&&(month<7)) || ((month % 2 != 0)&&(month>=7)) )
		return 31;
	return 30;
}

function selectDifferentOption(selectedSet){
	// selectedSet reflects 1 - verticalSet, 2 - horizontalSet
	var verticalSetId = "verticalSet";
	var horizontalSetId = "horizontalSet";
	
	var notSelectedSetStr = "";
	switch (selectedSet){
		case 1: notSelectedSetStr = horizontalSetId;
				break;
		case 2: notSelectedSetStr = verticalSetId;
				break;
	}
	
	var e1 = document.getElementById(verticalSetId);
	var e2 = document.getElementById(horizontalSetId);
	var e1Value = e1.options[e1.selectedIndex].value;
	var e2Value = e2.options[e2.selectedIndex].value;
	
	if (e1.selectedIndex == e2.selectedIndex)
		if (e1.selectedIndex == 0)
			document.getElementById(notSelectedSetStr).selectedIndex = "1";
		else
			document.getElementById(notSelectedSetStr).selectedIndex = "0";
	e1Value = e1.options[e1.selectedIndex].value;
	e2Value = e2.options[e2.selectedIndex].value;
}

function initializeTooltips(){
	$(document).ready(function(){
	    $('[data-toggle="tooltip"]').tooltip();
	    $('rect').tooltip({
    			container: 'body',
	    	    position: {
	    	        //my: "center bottom-60",
	    	        at: "center top"
	    	    },
	    	    show: {
					duration: 0
				}
	    	});
	});		
}

function validateNewKPIInputs(calculationType, numberSupport, samplingInterval, name, description, samplingRate) {
	var result = false;
	var message = "";
	var elementName = "";
	
	if ( (calculationType != null) && (numberSupport != null) && (samplingInterval != null) 
			&& (name != "") && (description != "")  && isAllNumeric(samplingRate)) {
			result = true;
			message = "New KPI added with success!";
		} else {
			if (name == "") {
				message = "Please provide a Name for KPI!";
				result = false;
				elementName = "#name";
			} else if (description == "") {
				message = "Please provide a Description for KPI!";
				result = false;
				elementName = "#description";

			} else if (calculationType == null) {
				result = false;
				message = "Please choose a calculation type for KPI!";
				elementName = "#calculationType";
				
			} else if ( numberSupport == null) {
				message = "Please choose a Number Type for KPI!";
				result = false;
				elementName = "#numberSupport";

			} else if ( samplingRate == "") {
				message = "Please choose a Sampling Interval for KPI!";
				result = false;
				elementName = "#samplingRate";

			} else if (	!isAllNumeric(samplingRate)) {
				message = "Please provide a valid input with only numbers for sampling!";
				result = false;
				elementName = "#samplingRate";

			} else if ( samplingInterval == null) {
				message = "Please choose a Sampling Interval for KPI!";
				result = false;
				elementName = "#samplingInterval";
				
			}
		}
		return {validInputs: result, message: message, element:elementName};
	
}

function isAllNumeric(stringToEval)  
{  
   var result = false;
   var numbers = /^[0-9]+$/;  
   
   if(stringToEval.match(numbers))  
   {  
	   result = true;  
   } else {     
	   result =  false;  
   }
   
   return result;
}   

function validateNewTargetInputs(upperBoundValue, lowerBoundValue, numSupFormat, nsfDecimalPlaces, kpiElId, contextIds, targetId, editStatus) {
	var isValid = false;
	var message = "";
	var elementNameId = "";
	
	var hasTargetInfo = hasTargets(upperBoundValue, lowerBoundValue, kpiElId, numSupFormat, contextIds, targetId, editStatus);
	
	var x1 = (upperBoundValue > 100) && (numSupFormat.toUpperCase() == 'PERCENTAGE');
	var x2 = (upperBoundValue > 100);
	var x3 = (numSupFormat.toUpperCase() == 'PERCENTAGE');
	
	
	
	if ( ( (upperBoundValue == null) || (upperBoundValue == "") ) && ( (lowerBoundValue == null)||(lowerBoundValue == "") ) ) {
		isValid = false;
		message = "Please add at least one bound!";
	} else if (hasTargetInfo.evaluationValue){
		isValid = false;
		message = hasTargetInfo.message;
		elementNameId = hasTargetInfo.element;
	} else if ( (!isValidDecimal(upperBoundValue, numSupFormat, nsfDecimalPlaces)) || ( (upperBoundValue > 100) && (numSupFormat.toUpperCase() == 'PERCENTAGE') ) ) {
		isValid = false;
		message = "Please insert a correct upper bound "+numSupFormat.toLowerCase()+" value";
		elementNameId = "#upperBoundBox";
	} else if ( (!isValidDecimal(lowerBoundValue, numSupFormat, nsfDecimalPlaces)) || ( (lowerBoundValue > 100) && (numSupFormat.toUpperCase() == 'PERCENTAGE') ) ) {
		isValid = false;
		message = "Please insert a correct lower bound "+numSupFormat.toLowerCase()+" value";
		elementNameId = "#lowerBoundBox";
	} else if ( (isValidDecimal(upperBoundValue, numSupFormat, nsfDecimalPlaces)) && (isValidDecimal(lowerBoundValue, numSupFormat, nsfDecimalPlaces)) ) {
		isValid = true;
		message = "Target bounds OK";
	}
	return {isValid: isValid, message: message, elementNameId: elementNameId};
}




function hasTargets(upperBound, lowerBound, kpiElId, numSupFormat, contextIds, targetId, editStatus){
	var result = false;
	var message = "";
	var elementName = "";
	var upperBoundTmp = "";
	var lowerBoundTmp = "";
	
	if ((numSupFormat.toUpperCase() == 'PERCENTAGE')) {
		upperBoundTmp = parseFloat((upperBound/100).toFixed(4));
		lowerBoundTmp = parseFloat((lowerBound/100).toFixed(4));
	} else {
		upperBoundTmp = upperBound;
		lowerBoundTmp = lowerBound;
	}
	
//	"product_id":null,"mould_id":null,"machine_id":null,"shift_id":null,"lower_bound":null,"upper_bound":"21.0"}]
	
	
	for (var k=0; k<kpiTargets.length;k++) {
		
		console.log("kpiTargets[k].upper_bound:"+kpiTargets[k].upper_bound);
		console.log("kpiTargets[k].lower_bound:"+kpiTargets[k].lower_bound);
		
		if (editStatus) {
			if (targetId == kpiTargets[k].id)
				continue;
		}

		if (kpiElId == kpiTargets[k].kpi_id) {
			if ( (contextIds.product_id == kpiTargets[k].product_id) 
			  && (contextIds.mould_id 	== kpiTargets[k].mould_id) 
			  && (contextIds.machine_id == kpiTargets[k].machine_id) 
			  && (contextIds.shift_id 	== kpiTargets[k].shift_id) ) {
				
			
				if (  ((kpiTargets[k].upper_bound != null)&& (kpiTargets[k].upper_bound != "")) 
						&& ((kpiTargets[k].lower_bound != null)&& (kpiTargets[k].lower_bound != "")) )   {
					// both exist
					message = "Target for the SAME CONDITIONS already exist.";
					result = true;
					elementName = "#upperBoundBox";
					break;
				} else if ( ((kpiTargets[k].upper_bound != null) && (kpiTargets[k].upper_bound != "")) 
							&& ((upperBoundTmp != null) && (upperBoundTmp!= "") ) ) {
					// wants to create upper but upper already exist 
//					message = "Target with UPPER BOUND for the SAME CONDITIONS already exist.";
					message = "Target for the SAME CONDITIONS already exist.";
					result = true;
					elementName = "#upperBoundBox";
					break;
				} else if ( ((kpiTargets[k].lower_bound != null) && (kpiTargets[k].lower_bound !="") ) 
						&& ((lowerBoundTmp != null) && (lowerBoundTmp!= "") ) ) {
					// wants to create lower but upper already exist 
//					message = "Target with LOWER BOUND for the SAME CONDITIONS already exist.";
					message = "Target for the SAME CONDITIONS already exist.";
					result = true;
					elementName = "#lowerBoundBox";
					break;
				}
				
			}
		}
		
	}
	
//	message += " with that value already exists."
		
//	message = "Target in the same conditions already exist.";
			
	return {evaluationValue: result, message: message, element:elementName};
}


function isValidDecimal(stringToEval, numSupFormat, nsfDecimalPlaces)  {
//	var nsfDecimalPlaces = 0;
	var result = false;
	// if the decimal includes negative, use the below line instead
	//	var decimal= /^[-+][0-9]+\.[0-9]+[eE][-+]?[0-9]+$/;  
	if (numSupFormat.toUpperCase() == 'PERCENTAGE') {
		if ((nsfDecimalPlaces == 0) || (nsfDecimalPlaces == null) ) {
			var decimal = /^[0-9]*?$/;
		} else {
			switch (nsfDecimalPlaces) {
			case 1: var decimal = /^([0-9]+\.[0-9]{1,1})*$/;
					break;
			case 2: var decimal = /^([0-9]+\.[0-9]{1,2})*$/;
					break;
			case 3: var decimal = /^([0-9]+\.[0-9]{1,3})*$/;
					break;
			case 4: var decimal = /^([0-9]+\.[0-9]{1,4})*$/;
					break;
			default: break;
			}
//			var decimal = /^([0-9]+\.[0-9]{1,4})+$/;
		}
//		var decimal = /^([0-9]+\.[0-9]{1,4})?$/;
	} else {
//		var decimal = /^([0-9]+(\.[0-9])*)?$/;
//		/^([0-9]+(\.[0-9]{1,4}))?$/
		if ((nsfDecimalPlaces == 0) || (nsfDecimalPlaces == null) ) {
			var decimal = /^[0-9]*$/;
		} else {
			switch (nsfDecimalPlaces) {
			case 1: var decimal = /^([0-9]+(\.[0-9]{1,1}))?$/;
					break;
			case 2: var decimal = /^([0-9]+(\.[0-9]{1,2}))?$/;
					break;
			case 3: var decimal = /^([0-9]+(\.[0-9]{1,3}))?$/;
					break;
			case 4: var decimal = /^([0-9]+(\.[0-9]{1,4}))?$/;
					break;
			default: break;
			}
//			var decimal = /^([0-9]+\.[0-9]{1,4})+$/;
		}
	}
		
	var stringToEvalTmp = ""+stringToEval;
	if(stringToEvalTmp.match(decimal)) {  
	    result = true;  
    } else { 
    	result = false;  
	}
	
	return result;
}   


function showNumberSupportFormat(numSupFormat, nsfDecPlaces){
	var decimalcases = "";

	switch (nsfDecPlaces) {
	case 1: decimalcases = "Ex2:22.5";
		break;
	case 2:	decimalcases = "Ex2:22.58";

		break;
	case 3: decimalcases = "Ex2:22.583";
		break;
	case 4: decimalcases = "Ex2:22.5822";
		break;
	default: decimalcases = "";
		break;
	
	}
	if (numSupFormat.toUpperCase() == 'PERCENTAGE') {
	
		// change html
		// change upperbound to upperbond (%)
		document.getElementById("upperBoundBoxLabel").innerHTML = "Upper Bound (%)";

		// change lowerbound to lowerbound (%)
		document.getElementById("lowerBoundBoxLabel").innerHTML = "Lower Bound (%)";
		var titleStr = "Please insert a percentage value between 0-100. Ex1: 20; "+ decimalcases; 
		document.getElementById("upperBoundBox").title = titleStr;
		document.getElementById("upperBoundBox").setAttribute("data-toggle","tooltip");
		document.getElementById("upperBoundBox").setAttribute("data-placement","bottom");
		
		document.getElementById("lowerBoundBox").title = titleStr;
		document.getElementById("lowerBoundBox").setAttribute("data-toggle","tooltip");
		document.getElementById("lowerBoundBox").setAttribute("data-placement","bottom");
		
	} else if (numSupFormat.toUpperCase() == 'DECIMAL') {
	// change html
		// change upperbound to upperbond (DEC)
		document.getElementById("upperBoundBoxLabel").innerHTML = "Upper Bound (Dec)";

		// change lowerbound to lowerbound (DEC)
		document.getElementById("lowerBoundBoxLabel").innerHTML = "Lower Bound (Dec)";

		var titleStr = "Please insert a decimal value. Ex1: 110800; "+ decimalcases; 
		
		document.getElementById("upperBoundBox").title = titleStr;
		document.getElementById("upperBoundBox").setAttribute("data-toggle","tooltip");
		document.getElementById("upperBoundBox").setAttribute("data-placement","bottom");
		
		document.getElementById("lowerBoundBox").title = titleStr;
		document.getElementById("lowerBoundBox").setAttribute("data-toggle","tooltip");
		document.getElementById("lowerBoundBox").setAttribute("data-placement","bottom");
	}
	
	
	initializeTooltips();
}


function showNSFDecimalPlaces(nsfDecimalPlaces){
	if (nsfDecimalPlaces != 0) {
		$("#upperBoundBox").css('width','45%');
		
		$("#upperBoundBoxDecimalSeparator").css('display','inline');
		$("#upperBoundBoxDecimalPlaces").css('width','25%');
		$("#upperBoundBoxDecimalPlaces").css('display','inline');
		
		$("#lowerBoundBox").css('width','45%');
		
		$("#lowerBoundBoxDecimalSeparator").css('display','inline');
		$("#lowerBoundBoxDecimalPlaces").css('width','25%');
		$("#lowerBoundBoxDecimalPlaces").css('display','inline');
	}
	
}

function logout(secUrl, redirUrl) {
//	if ( (secUrl == "") || (secUrl == null) ) {
//		secUrl = "/proasense";
//	}
//	if ( (redirUrl == "") || (redirUrl == null) ) {
//		redirUrl = "http://www.google.com";
//	}
//	console.log("Browser: "+);
//	if (navigator.userAgent.indexOf("Edge") != -1) {
		$.ajax({
			url: restAddress + 'proasense_hella/logout',
			type: 'POST',
			username: 'logout',
			data: '{"type":"LOGOUT","data":{}}',
//			success: function(result) {
//				if (debugMode) {
//					console.log("Trying to logout in IE - EDGE = "+JSON.stringify(result));
//					window.alert("logout in IE - EDGE = "+JSON.stringify(result));
//				}
//				if (result.succeeded) {
//					window.alert("logout in IE - EDGE = "+JSON.stringify(result));
//				} else {
////					$('html').unblock();
//					$.notify('Logout failed');
//				}
//			},
			statusCode: {
			    401: function(result) {
//			      alert( "page not found "+JSON.stringify(result) );
//			      window.location = "/proasense/index.html";
//			      window.open('',_self);
			      document.write(result.responseText);
//			      window.alert(result.responseText);
			      if (navigator.userAgent.indexOf("Edge") != -1) {
			    	  document.execCommand('ClearAuthenticationCache');
			      }
			    }
			  }
		});
		
//	} else if (navigator.userAgent.indexOf("AppleWebKit") != -1) {
//		
//	} else {
//		window.alert("UserAgent not found!");
//	}
	
//    if ($.browser.msie) {
//        document.execCommand('ClearAuthenticationCache', 'false');
////		$.ajax({
////			url: restAddress + 'proasense_hella/kpi_formula',
////			type: 'POST',
////			data: '{"type":"LOGOUT","data":{}}',
////			success: function(result) {
////				if (debugMode) {
////					console.log("Trying to logout in IE - EDGE = "+JSON.stringify(result));
////				}
////				if (result.succeeded) {
////				} else {
//////					$('html').unblock();
////					$.notify('Formula update failed');
////				}
////			}
////		});
//    } else if ( ($.browser.gecko) || ($.browser.mozilla) || ($.browser.webkit) ){
//        $.ajax({
//            async: false,
//            url: secUrl,
//            type: 'GET',
//            username: 'logout'
//        });
//	} else {
//        alert("Logging out automatically is unsupported for " + $.browser.name
//            + "\nYou must close the browser to log out.");
//    }
//    setTimeout(function () {
////    	window.location.assign("<html><head></head><body></body></html>");
//        window.location.href = redirUrl;
//    }, 50);
}


function legendClick(legend){
	var legendTmp = [];
	for (var i=0; i<legend.length; i++) {
		console.log("legend["+i+"]: "+legend[i]);
		legendTmp[i] = "<span>"+legend[i]+"</span>";
	}
	return legendTmp;
}


function deleteHierarchy(){
	
	// recursively is child? then delete, no? go to next child.
	
	
	
}

function getKpiInfoId(kpiIdToGet){
	var result = null;
	for (var index=0; index<this.kpiInfo.length;index++)
		if (this.kpiInfo[index].id == kpiIdToGet) {
			result = kpiInfo[index];
			break;
		} 
	return result;
}

function numberOfZeros(zeroQty){
	var zeros = "";
	for (var k = 0; k<zeroQty; k++) {
		zeros += "0";
	}
	return zeros;
}
