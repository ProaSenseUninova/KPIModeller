var delEditBtn = ' <span class="glyphicon glyphicon-plus" title="Add KPI" onclick="addEl();" aria-hidden="true"></span><span class="glyphicon glyphicon-pencil" title="Edit KPI" onclick="editEl();"  aria-hidden="true"></span><span class="glyphicon glyphicon-minus" title="Delete KPI" onclick="delEl();"  aria-hidden="true"></span>';
var toClosePane = true;

$(function() {
	$('html').block({
		message: null
	});
})

function elementInfo() {
	this.elements = [];
	this.loadedElement = "";
}

function getChildren(kpis) {
	var kpiParents = [];
	var kpiChildren = [];
	for (var i = 0; i < kpis.length; i++) {
//		window.alert("AJAX:(getChildren) - kpis[i].children :"+JSON.stringify(kpis[i].children));
		kpis[i].children = [];
//		window.alert("AJAX:(getChildren) - kpis[i].name :"+JSON.stringify(kpis[i].name));
//		window.alert("AJAX:(getChildren) - kpis["+i+"].name :"+JSON.stringify(kpis[i].NAME));
		kpis[i].text = kpis[i].name + delEditBtn;
		if (kpis[i].parent_id === null) {
			kpiParents.push(kpis[i]);
		} else {
			kpiChildren.push(kpis[i]);
		}
	}
	var kpiTemp = [];
	var kpiTemp = kpiParents.slice();

	do {
		var tempVect = [];
		for (var i = 0; i < kpiTemp.length; i++) {
			var childrenLength = kpiChildren.length;
			for (var j = 0; j < childrenLength; j++) {
				if (kpiTemp[i].id == kpiChildren[j].parent_id) {
					kpiTemp[i].children.push(kpiChildren[j]);
					tempVect.push(kpiChildren[j]);
					kpiChildren.splice(j, 1);
					childrenLength--;
					j--;
				}
			}
		}
		kpiTemp = tempVect;
	} while (kpiChildren.length > 0);
	return kpis;
}

var kpiInfo = [];
var kpiFormulas = [];
var kpiTargets = [];
var sensorEvents = [];
var sensors = [];
var aggTypes = [];
var sampInt = [];
var products = [];
var shifts = [];
var moulds = [];
var machines = [];
var loadedKpi = "";
var loadedKpiNumberFormat = "";
var newParentId = null;
var loadedTargetToEditId = null;

function cloneKpis(kpis) {
	var tmpKpis = [];
	for (var i = 0; i < kpis.length; i++) {
		var obj = jQuery.extend({}, kpis[i]);
		delete obj.children;
		tmpKpis.push(obj);
	}
	return getChildren(tmpKpis);
}

function getProduct(id) {
	for (var i = 0; i < products.length; i++) {
		if (products[i].id == id) {
			return products[i];
		}
	}
	return {};
}

function getShift(id) {
	for (var i = 0; i < shifts.length; i++) {
		if (shifts[i].id == id) {
			return shifts[i];
		}
	}
	return {};
}

function getMould(id) {
	for (var i = 0; i < moulds.length; i++) {
		if (moulds[i].id == id) {
			return moulds[i];
		}
	}
	return {};
}

function getMachine(id) {
	for (var i = 0; i < machines.length; i++) {
		if (machines[i].id == id) {
			return machines[i];
		}
	}
	return {};
}

function getKpi(id) {
	for (var i = 0; i < kpiInfo.length; i++) {
		if (kpiInfo[i].id == id) {
			return kpiInfo[i];
		}
	}
	return {};
}

//window.onload = function(){
//	
//}

//var sessioncustom=false;
//var mainpagewrapperhtml;
//var loginpagewrapperhtml;

//var Session = {    id : '${pageContext.session.id}',
//			     user : '${pageContext.request.remoteUser}'
//			  };
//
//function setCookie(name,value,expires,path,domain,secure) {
//    var cookieString = name + "=" +escape(value) +
//       ( (expires) ? ";expires=" + expires.toGMTString() : "") +
//       ( (path) ? ";path=" + path : "") +
//       ( (domain) ? ";domain=" + domain : "") +
//       ( (secure) ? ";secure" : "");
//    document.cookie = cookieString;
//}

window.onload = function() {
//	setCookie('JSESSIONID',Session.id);

//	window.alert("Initial onload method --------------- ");
	if (!restAddress.endsWith('/')) {
		restAddress = restAddress + '/';
	}
	$.ajax({
		url: restAddress + 'proasense_hella/sensor/hella',
		type: 'GET',
		success: function(data) {
			$("#companyContext").prop( "disabled", false);
			sensors = data;
			screen1.loadSensors();
		}
	});
	
	$.ajax({
		url: restAddress + 'proasense_hella/kpi_agg_type',
		type: 'GET',
		success: function(data) {
			aggTypes = data;
		}
	});
	$.ajax({
		url: restAddress + 'proasense_hella/granularity',
		type: 'GET',
		success: function(data) {
			sampInt = data;
		}
	});
	
	$.ajax({
		url: restAddress + 'proasense_hella/mould',
		type: 'GET',
//		xhrFields: {
//		      withCredentials: true
//		   },		
		success: function(data) {
			moulds = data;
		}
	});
	$.ajax({
		url: restAddress + 'proasense_hella/shift',
		type: 'GET',
		success: function(data) {
			shifts = data;
		}
	});
	$.ajax({
		url: restAddress + 'proasense_hella/product',
		type: 'GET',
		success: function(data) {
			products = data;
		}
	});
	$.ajax({
		url: restAddress + 'proasense_hella/machine',
		type: 'GET',
		success: function(data) {
			machines = data;
		}
	});
	$.ajax({
		url: restAddress + 'proasense_hella/kpi_formula',
		type: 'GET',
		success: function(data) {
			kpiFormulas = data;
		}
	});
	$.ajax({
		url: restAddress + 'proasense_hella/sensorevent',
		type: 'GET',
		success: function(data) {
			sensorEvents = data;
		}
	});
	$.ajax({
		url: restAddress + 'proasense_hella/kpi_target',
		type: 'GET',
		success: function(data) {
			kpiTargets = data;
		}
	});
	$.ajax({
		url: restAddress + 'proasense_hella/kpi',
		type: 'GET',
		success: function(data) {
//			window.alert("sdsdsssds");
			$('html').unblock();

			kpiInfo = data;
//			window.alert("AJAX:(proasense_hella/kpi) - data:"+JSON.stringify(data));
//			window.alert("AJAX:(proasense_hella/kpi) - kpiInfo:"+JSON.stringify(kpiInfo));
			screen1.kpiInfo = kpiInfo;
//			window.alert("AJAX:(proasense_hella/kpi) - screen1 kpiInfo :"+JSON.stringify(screen1.kpiInfo));
			screen2.kpiInfo = kpiInfo;
//			window.alert("AJAX:(proasense_hella/kpi) - screen2 kpiInfo :"+JSON.stringify(screen2.kpiInfo));
			scrGraph.kpiInfo = kpiInfo;
//			window.alert("AJAX:(proasense_hella/kpi) - scrGraph kpiInfo :"+JSON.stringify(scrGraph.kpiInfo));
			kpiInfo = getChildren(kpiInfo);
//			window.alert("AJAX:(proasense_hella/kpi) - getChildren(kpiInfo) :"+JSON.stringify(kpiInfo));
			var tmpKpiInfo = cloneKpis(kpiInfo);
//			window.alert("AJAX:(proasense_hella/kpi) - kpiInfo:"+JSON.stringify(screen1.kpiInfo));
//			window.alert("AJAX:(proasense_hella/kpi) - kpiInfo[0].parent_id:"+kpiInfo[0].parent_id);
			for (var i = 0; i < kpiInfo.length; i++) {
//				window.alert("AJAX:(proasense_hella/kpi) - kpiInfo ["+i+"]:"+JSON.stringify(kpiInfo[i].parent_id));
				if (kpiInfo[i].parent_id === null) {
//					window.alert(kpiInfo[i].parent_id);
					$('#KPITree').jstree().create_node(null, tmpKpiInfo[i]);
				}
			}
		}
	});
	
//	window.alert("After requests --------------- ");
	
	elInfo = new elementInfo();
	screen1 = new Screen1();
	screen2 = new Screen2();
	activeScreen = screen1;
	scrGraph = new ScreenGraph();
	scrQuery = new ScreenQuery();
//	window.alert("initializations  --------------- ");
	
	$('#KPITree').on('close_node.jstree', function(e, data) {
			if (data.node.id == 'OEEId') {
				var tree = $("#KPITree").jstree(true);
				var children = data.node.children;
				var node = {};
				for (var i = 0; i < children.length; i++) {
					node = tree.get_node(children[i]);
					if (!node.text.endsWith('</span>')) {
						$('#name').val(node.text);
						tree.rename_node(node, node.text + delEditBtn);
						screen1.saveLoadedElement();
						break;
					}
				}
			}
		})
		.on('select_node.jstree', function(e, data) {
			var isInArea = data.event.offsetX < ($('#' + data.node.id).find('a').width() - 47);
			if (data.event.offsetX < ($('#' + data.node.id).find('a').width() - 47) && data.event.target.classList[0] != "glyphicon") {
				loadedKpi = data.node.id;
				loadedKpiNumberFormat = getKpiNumberSupportFormat(loadedKpi);
				
				var selectedElement = -1;
				var vectorSize = $('.headerSelector a').length;
				
				for (var index=0; index<vectorSize;index++){
					if (!$('.headerSelector a').eq(index).hasClass("notSelected")) {
						selectedElement = index;
						break;
					}
				}
				
				switch (selectedElement) {
				case 0: // means KPI separator is selected
						scrGraph.openScreen(data.node.id);
						break;
				case 1: // means Target separator is selected
						screen2.openScreen(data.node.id);
						break;
				default: // means no separator is selected
						break;
				}
			}
		})
		.on('create_node.jstree', function(e, data) {
			if (data.parent == "OEEId") {
//				window.alert("creating node:"+data.parent);
				activeScreen.closeScreen();
				elInfo.loadedElement = data.node.id;
				scrGraph.disconnect();
				activeScreen.openScreen();
				//screen1.saveLoadedElement();
			}
		})
		.on('rename_node.jstree', function(e, data) {
			if (data.node.parent == 'OEEId' && !data.text.endsWith('span>') && !data.old.endsWith('span>')) {
				var tree = $("#KPITree").jstree(true);
				tree.rename_node($('#' + data.node.id), data.text + delEditBtn);
				data.node.name = data.text;
				$('#name').val(data.text);
				screen1.saveLoadedElement();
			}
		})
		.jstree({
			'core': {
				'color': 'white',
				'bold': true,
				'width': '300px',
				'noBorder': true,
				'check_callback': true,
				"themes": {
					"icons": false
				},
			},

		});
	
//	mainpagewrapperhtml = document.getElementById('main-page-wrapper').innerHTML;
//	loginpagewrapperhtml = document.getElementById('login-page').innerHTML;
//	this.login();
//	window.alert("end  --------------- ");
};


function login(){
	if (sessioncustom) {
		document.getElementById('main-page-wrapper').innerHTML = mainpagewrapperhtml;
		document.getElementById('login-page').innerHTML = "";
		document.body.style.backgroundColor = "white";
	}
	else {
		document.getElementById('main-page-wrapper').innerHTML = "";
		document.getElementById('login-page').innerHTML = loginpagewrapperhtml;
		document.body.style.backgroundColor = "#d9534f";
	} 
};

function authorize(username, password){
	if ((username=="admin") && (password == "123456"))
		sessioncustom = true;
	else
		sessioncustom = false;
	this.login();
}

function addEl(root) {
	if (root) {
		newParentId = null;
	} else {
		$('#KPITree').on('select_node.jstree', function(e, data) {
			var tree = $("#KPITree").jstree(true);
			newParentId = tree.get_selected()[0];

			$('#KPITree').unbind(e);
		});
	}
	screen1.closeScreen();
	screen1.openScreen();

}

function delEl() {
	$('#KPITree').on('select_node.jstree', function(e, data) {
		var tree = $("#KPITree").jstree(true);
		$('#delDialog').modal('show');
		$('#KPITree').unbind(e);
	});
}

function delConfirm() {
	var tree = $("#KPITree").jstree(true);
	//Will only work if the dialog is open
	if ($('#delDialog').is(':visible')) {
		var selectedId = tree.get_selected()[0];
		if (selectedId == elInfo.loadedElement) {
			activeScreen.closeScreen();
		}
		removeElement(selectedId);
		$('#delDialog').modal('hide');
	}
}

function editEl() {
	$('#KPITree').on('select_node.jstree', function(e, data) {
		var tree = $("#KPITree").jstree(true);
		var elName = data.node.text;
		activeScreen.changeLoadedKpi(data.node.id);
		scrGraph.disconnect();
		activeScreen.openScreen();
		//tree.edit(data.node,elName.substring(0,elName.indexOf(delEditBtn)));
		$('#KPITree').unbind(e);
	});
}

function getKpiNumberSupportFormat(kpiInfoId){
	for (var i = 0; i<kpiInfo.length;i++){
		if (kpiInfoId == kpiInfo[i].id)
			return kpiInfo[i].number_support_format;
	}
	return "PERCENTAGE";
		
//	return kpiInfo[kpiInfoId-1].number_support_format;
}