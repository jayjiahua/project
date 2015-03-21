window.onload = initPage();

function errorCode(code) {
	switch (code) {
	    case 1:
	    	alert("Invalid arguments");
	    	break;
	    case 2:
 			alert("Csrf token check failed");
 			break;
		case -2:
			alert("Admin didn't login.");
			break; // 未登录
		case -3:
			alert("Building does not exist.");
			break;
		case -7:
			alert("Admin account does not exist.");
			break;
		case -10:
			alert("Act beyond authority."); // 非一级管理员
			break;
		case -14:
			alert("School does not exist.");
			break;
		case -15:
			alert("School already exists.");
			break;
		case -16:
			alert("Category #1 already exists.");
			break;
		case -17:
			alert("Category #1 does not exist.");
			break;
		case -18:
			alert("Admin already exists.");
			break;
		case -19:
			alert("School already has an admin.");
			break;
		case -20:
		 	alert("Username is already used.");
		 	break;
		case -21:
			alert("Building already has an admin.");
			break;
		case -23:
		 	alert("Category #2 does not exist.");
		 	break;
		 case -24:
		 	alert("Product does not exist.");
		 	break;
	}
}

function logout() {
	var token = window.localStorage.getItem("token");
	document.getElementById("logout").onclick = function() {
		$.ajax({
   			type: "POST",
   			url: "/admin/logout",
   			data: "csrf_token=" + token,
   			success: function(msg){
      	    	code = msg.code;
      			if (code == 0) {
    			} else {
    				errorCode(code);
    			}
   			}
		});
	};
}

function showSales() {
	var school = $("#school_id");
	var building = $("#building_id");
	var year = $("#year");
	var month = $("#month");
	var quarter = $("#quarter");
	var export_ =	$("#export");
	var str = "";

	if (school.value)
		str += "school_id="+school.value;
	if (building.value)
		str += "&building_id="+building.value;
	if (year.value) {
		if (str != "") str += "&";
		str += "year="+year.value;
	}
	if (quarter.value)
		str += "&quarter="+quarter.value;
	if (month.value)
		str += "&month="+month.value;
	if (export_.value == 1) {
		if (str != "") str += "&";
		str += "export="+1;
	}
	var url = "/admin/level1/total_sales?"+str;
	var token = window.localStorage.getItem("token");
	$.ajax({
   		type: "POST",
   		url: url,
   		data: "csrf_token=" +token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
      			if (!isNaN(data)) {
	    			$("#sales").append(document.createTextNode(data));
	    		} else {
	    			$("body").append("<iframe src='" + data + "' style='display: none;'></iframe>");
	    		}
    		} else {
    			errorCode(code);
    		}
   		}
	});
}

function getSchoolList(t) {
  var token = window.localStorage.getItem("token");
	//var responseText = '{"code":0, "data":[{"id":"l", "name":"中大"}, {"id":"ll", "name":"中西夏"}]}';
	$.ajax({
   		type: "POST",
   		url: "/admin/level1/school/get_list",
   		data: "csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	var code = output.code;
      		if (code == 0) {
      			var data = output.data;
      			if (t == null) {
	    			clearTable('schoolTable');
	    			clearList('schoolList');
	    			for (var i = 0; i < data.length; ++i) {
	    				addToSchoolTable(data[i].id, data[i].name);
	    				addToSchoolList(data[i].id, data[i].name);
	    			}
	    		} else {
					for (var i = 0; i < data.length; ++i) {
	    				addToSchoolList(data[i].id, data[i].name, t);
	    			}
	    		}
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function addToSchoolList(id, name, t) {
	if (t == null) {
		schools = $('select[name="schoolList"]');
		for (var i = 0; i < schools.length; ++i) {
			$(schools[i]).append('<option id="' + id + '">' + name + '</option>');  //$ important!!!  因为append是jquery的
		}
	} else {
		$(t).find("select").append('<option id="' + id + '">' + name + '</option>');
	}
}

function addToSchoolTable(id, name) {
	$("#schoolTable").find('tbody').append('<tr><td id="'+ id + '"><div contenteditable="true">' + name
									   +'</div></td><td><input type="button" value="确认" class="btn btn-default" onclick="modifySchool(this)"/> \n'
									   +'<input type="button" value="删除" class="btn btn-default"  onclick="deleteRow(this); deleteSchool(this)"/> \n'
									   +'<input type="button" value="取消" class="btn btn-default" onclick="resetSchool()"/></td></tr>')
}

function createSchool(f) {
	var name = f.word.value;
  var token = window.localStorage.getItem("token");
	$.ajax({
   		type: "POST",
   		url: "/admin//level1/school/create",
   		data: "name=" + name + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
      			getSchoolList();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}


function modifySchool(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var school_id = $(temp[0]).attr("id");
  	var name = $(temp[0]).text();
    var url="/admin/level1/school/modify";
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: "school_id=" + school_id + "&name=" + name +"&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
      			getSchoolList();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function deleteSchool(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var school_id = $(temp[0]).attr("id");
  	var url = "/admin/level1/school/delete";
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: "school_id="+school_id+"&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function getBuildingList(school, t) {
	//var responseText = '{"code":0, "data":[{"id":"zhi", "name":"至善园1号"}, {"id":"ming", "name":"明德园7号"}]}';
  	var token = window.localStorage.getItem("token");
  	var url = "/admin/level1/building/get_list";
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: "school_id="+school+"&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
	    		if (t == null) {
	    			clearList('buildingList');
	    			clearTable('buildingTable');
	    			for (var i = 0; i < data.length; ++i) {
	    				addToBuildingTable(data[i].id, data[i].name);
	    				addToBuildingList(data[i].id, data[i].name);
	    			}
	    		} else {
	    			for (var i = 0; i < data.length; ++i) {
	    				addToBuildingList(data[i].id, data[i].name, t);
	    			}
	    		}
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function addToBuildingList(newId, newName, t) {
	if (t == null) {
		$("select[name='buildingList']").append('<option id="' + newId + '">' + newName + '</option>');
	} else {
		$(t).find("select").append('<option id="' + newId + '">' + newName + '</option>');
	}
}

function addToBuildingTable(newId, newName) {
	$("#buildingTable").find('tbody').append('<tr><td id="'+ newId + '"><div contenteditable="true">' + newName
									+'</div></td><td><input type="button" value="确认" class="btn btn-default" onclick="modifyBuilding(this)"/> \n'
									+'<input type="button" value="删除" class="btn btn-default"  onclick="deleteRow(this); deleteBuilding(this)"/> \n'
									+'<input type="button" value="取消" class="btn btn-default" onclick="resetBuilding(\'' + school + '\'' + ', ' + '\'' + buildingTable + '\')"/></td></tr>');
}

function createBuilding(schoolId, f) {
	var url="/admin/level1/building/create";
 	var token = window.localStorage.getItem("token");
 	$.ajax({
   		type: "POST",
   		url: url,
   		data: "school_id="+school_id+"&name=" + f.word.name + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
	    		getBuildingList();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function modifyBuilding(t) {
    var token = window.localStorage.getItem("token");
    var temp = $(t).parent().siblings();
    var building_id = $(temp[0]).attr("id");
    var name = $(temp[0]).text();
    var url="/admin/level1/building/modify";
    $.ajax({
   	    type: "POST",
   	    url: url,
   	    data: "building_id="+building_id + "&name=" + name + "&csrf_token=" + token,
   	    success: function(msg){
   		    var output = msg;
            var code = output.code;
      		if (code == 0) {
      		var data = output.data;
	    	getBuildingList();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function deleteBuilding(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var building_id = $(temp[0]).attr("id");
  	var url="/admin/level1/building/delete";
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: "building_id="+building_id + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function getAdmin2ndList() {
	//var responseText = '{"code":0, "data":[{"id":"c", "name":"至善", "username":"ooo", "contact_info":"123123", "school_info": {"id":"ppp", "name":"噢噢"}},]}';
  	var token = window.localStorage.getItem("token");
  	$.ajax({
   		type: "POST",
   		url: "/admin/level1/admin_2nd/get_list",
   		data: "csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
	    		var password = "";
	    		clearTable('managerTable');
	    		for (var i = 0; i < data.length; ++i) {
                    if (data[i].school_info == null) {
                        var schoolId = "";
                        var schollName = "";
                    } else {
                        var schoolId = data[i].school_info.id;
                        var schoolName = data[i].school_info.name;
                    }
	    			addToAdmin2ndTable(data[i].id, data[i].name, data[i].username, password, data[i].contact_info, schoolId, schoolName);
	    		}
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function createAdmin2nd(f) {
  	var token = window.localStorage.getItem("token");
	var username = f.word[1].value;
	var password = f.word[2].value;
	var name = f.word[0].value;
	var contact_info = f.word[3].value;
	var school_id = $(f).find('option:selected').attr('id');
	var url = "/admin/level1/admin_2nd/create"
    var data = "username=" + username + "&password=" + password + "&name=" + name + "&contact_info=" + contact_info + "&csrf_token=" + token
	if (school_id != null) {
	   data = data + "&school_id=" +school_id;
  	}

	$.ajax({
   		type: "POST",
   		url: url,
   		data: data,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getAdmin2ndList();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function modifyAdmin2nd(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var school_id = $(temp[0]).find("select option:selected").attr("id");
  	var name = $(temp[1]).text();
  	var contact_info = $(temp[4]).text();
  	var username = $(temp[2]).text();
  	var password = $(temp[3]).text();
  	var admin_id = $(temp[1]).attr('id');
  	if (password == "") {
  		password = null;
  	}
  	if (school_id == "") {
  		school_id = null;
  	}
    var url = "/admin/level1/admin_2nd/modify"
    var data="admin_id=" + admin_id + "&username=" + username + "&password=" + password + "&name=" + name + "&contact_info=" + contact_info + "&school_id=" + school_id;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getAdmin2ndList();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function deleteAdmin2nd(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var admin_id = $(temp[1]).attr("id");
  	var url="/admin/level1/admin_2nd/delete";
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: "admin_id=" + admin_id + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function addToAdmin2ndTable(id, name, username, password, contact_info, schoolId, schoolName) {
	$("#managerTable").find('tbody').append('<tr><td id="'+ schoolId + '" onclick=toSchoolSelect(this)>' + schoolName + '</td><td id="'+ id + '"><div contenteditable="true">' + name + '</div></td><td><div  contenteditable="true">' + username + '</div></td><td><div contenteditable="true">' + password + '</div></td><td><div contenteditable="true">' + contact_info
									   +'</div></td><td><input type="button" value="确认" class="btn btn-default" onclick="modifyAdmin2nd(this)"/> \n'
									   +'<input type="button" value="删除" class="btn btn-default"  onclick="deleteRow(this); deleteAdmin2nd(this)"/> \n'
									   +'<input type="button" value="取消" class="btn btn-default" onclick="resetAdmin2nd()"/></td></tr>');
}

function getAdmin3rdList(school_id) {
  	var token = window.localStorage.getItem("token");
  	$.ajax({
   		type: "POST",
   		url: "/admin/level1/admin_3rd/get_list",
   		data: "csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
	    		var password = "";
	    		clearTable('hostTable');
	    		for (var i = 0; i < data.length; ++i) {
                    if (data[i].school_info == null) {
                        var schoolId = "";
                        var schoolName = "";
                    } else {
                        var schoolId = data[i].school_info.id;
                        var schoolName = data[i].school_info.name;
                    }
                    if (data[i].building_info == null) {
                        var buildingId = "";
                        var buildingName = "";
                    } else {
                        var buildingId = data[i].building_info.id;
                        var buildingName = data[i].building_info.name;
                    }
	    			addToAdmin3rdTable(data[i].id, data[i].name, data[i].username, password, data[i].contact_info, schoolId, schoolName, buildingId, buildingName);
	    		}
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function createAdmin3rd(f) {
  	var token = window.localStorage.getItem("token");
	var username = f.word[1].value;
	var password = f.word[2].value;
	var name = f.word[0].value;
	var contact_info = f.word[3].value;
	var building_id = $(f).find('#thirdbuilding option:selected').attr('id');
	var url = "/admin/level1/admin_3nd/create"
    var data = "username=" + username + "&password=" + password + "&name=" + name + "&contact_info=" + contact_info;
	if (building_id != null) {
	   data = data + "&building_id=" +building_id;
  }
    data = data + "&csrf_token=" + token;
	$.ajax({
   		type: "POST",
   		url: url,
   		data: data,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getAdmin3rdList();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function modifyAdmin3rd(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var building_id = $(temp[1]).find("selected option:selected").attr("id");
  	var name = $(temp[2]).text();
  	var contact_info = $(temp[5]).text();
  	var username = $(temp[3]).text();
  	var password = $(temp[4]).text();
  	var admin_id = $(temp[2]).attr('id');
  	if (password == "") {
  		password = null;
  	}
    var url="/admin/level1/admin_3nd/modify"
    var data = "admin_id=" + admin_id + "&username=" + username + "&password=" + password + "&name=" + name + "&contact_info=" + contact_info + "&school_id=" + school_id;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data +"&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getAdmin3rdList();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function addToAdmin3rdTable(id, name, username, password, contact_info, schoolId, schoolName, buildingId, buildingName) {
	$("#hostTable").find('tbody').append('<tr><td id="'+ schoolId + '"><div  contenteditable="true">' + schoolName + '</div></td><td id="'+ buildingId + '" onclick="toBuildingSelect(this)"><div contenteditable="true">' + buildingName +'</div></td><td id="'+ id + '"><div contenteditable="true">' + name + '</div></td><td><div contenteditable="true">' 
									   		+ username + '</div></td><td><div contenteditable="true">' + password + '</div></td><td><div contenteditable="true">' + contact_info
									   		+'</div></td><td><input type="button" value="确认" class="btn btn-default" onclick="modifyAdmin3rd(this)"/> \n'
									   		+'<input type="button" value="删除" class="btn btn-default"  onclick="deleteRow(this); deleteAdmin3rd(this)"/> \n'
									   		+'<input type="button" value="取消" class="btn btn-default" onclick="resetAdmin3rd()"/></td></tr>');
}

function deleteAdmin3rd(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var admin_id = $(temp[2]).attr("id");
  	var url="/admin/level1/admin_3rd/delete"
    var data = "admin_id=" + admin_id;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function getCat1List() {
  	var token = window.localStorage.getItem("token");
	var url = "/admin/level1/cat1/get_list";
	$.ajax({
   		type: "POST",
   		url: url,
   		data: "csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
	    		var password_ = "";
	    		clearTable('cat1Table');
	    		clearList('cat1List');
	    		for (var i = 0; i < data.length; ++i) {
	    			addToCat1Table(data[i].id, data[i].name);
	    			addToCat1List(data[i].id, data[i].name);
	    		}
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function addToCat1Table(id, name) {
	$("#cat1Table").find('tbody').append('<tr><td id="'+ id + '"><div contenteditable="true">' + name
									   +'</div></td><td><input type="button" value="确认" class="btn btn-default" onclick="modifyCat1(this)"/> \n'
									   +'<input type="button" value="删除" class="btn btn-default"  onclick="deleteRow(this); deleteCat1(this)"/> \n'
									   +'<input type="button" value="取消" class="btn btn-default" onclick="resetCat1()"/></td></tr>');
}

function addToCat1List(id, name) {
	$("select[name='cat1List']").append('<option id="' + id + '">' + name + '</option>');  //$ important!!!  因为append是jquery的
}

function createCat1(f) {
  	var token = window.localStorage.getItem("token");
	var name = f.word.value;
	var url = "/admin/level1/cat1/create"
  var dara = "name=" + name;
	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getCat1List();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function modifyCat1(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var cat1_id = $(temp[0]).attr('id');
  	var name = $(temp[0]).text();
    var url="/admin/level1/cat1/modify"
    var dara = "cat1_id="+cat1_id+"&name="+name;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getCat1List();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function deleteCat1(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var cat1_id = $(temp[0]).attr("id");
  	var name = $(temp[0]).text();
  	var url="/admin/level1/cat1/delete"
    var data = "admin_id=" + cat1_id+"&name="+name;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getCat1List();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function getCat2List(cat1_id, cat2_id) {
  	var token = window.localStorage.getItem("token");
  	var url = "/admin/level1/cat2/get_list";
  	if (cat2_id != null)
  		var data = "cat2_id="+ cat2_id;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
	    		if (cat2_id == null) {
	    			clearTable("cat2Table");
	    			for (var i = 0; i < data.length; ++i) {
	    				addToCat2Table(data[i].id, data[i].name);
	    			}
	    		} else {
					for (var i = 0; i < data.length; ++i) {
						addToCat2List(data[i].id, data[i].name, cat2_id);
					}
	    		}
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function addToCat2Table(id, name) {
	$("#cat2Table").find('tbody').append('<tr><td id="'+ id + '><div contenteditable="true">' + name
									   +'</div></td><td><input type="button" value="确认" class="btn btn-default" onclick="modifyCat1(this)"/> \n'
									   +'<input type="button" value="删除" class="btn btn-default"  onclick="deleteRow(this); deleteCat1(this)"/> \n'
									   +'<input type="button" value="取消" class="btn btn-default" onclick="resetCat1()"/></td></tr>');
}

function addToCat2List(id, name, t) {
	$(t).find("select").append('<option id="' + id + '">' + name + '</option>'); 
}

function createCat2(f) {
  	var token = window.sessionStorage.getItem("token");
	var name = f.word.value;
	var url = "/admin/level1/cat2/create"
  var data = "name=" + name;
	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getCat2List();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function modifyCat2(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var cat2_id = $(temp[0]+ " select option:selected").attr('id');
    var url="/admin/level1/cat2/modify";
    var data ="cat2_id="+cat2_id;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getCat2List();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function deleteCat2(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var cat2_id = $(temp[0]).attr("id");
  	var url="/admin/level1/cat2/delete"
    var data = "cat2_id=" + cat2_id;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getCat2List();
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function getProductList() {
  	var token = window.localStorage.getItem("token");
  	$.ajax({
   		type: "POST",
   		url: "/admin/level1/product/get_list",
   		data: "_csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
	    		clearDiv();
	    		for (var i = 0; i < data.length; ++i) {
	    			addToProductTable(data[i].id, data[i].name, data[i].description, data[i].img_uri, data[i].price, data[i].cat1_info.id, data[i].cat1_info.name, data[i].cat2_info.id, data[i].cat2_info.name, data[i].asso);
	    		}
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function addToProductTable(id, name, description, img_uri, price, cat1Id, cat1Name, cat2Id, cat2Name, asso) {
	$("#productList").append('<div class="first"><div class="second" style="float:left; margin: 50px 10px 0 1%">'
        +'<table name="productTable" class="table table-striped" >'
        +'<thead><tr><th>图片</th><th>名称</th><th>描述</th><th>价格</th><th>类别</th><th>二级类别</th></tr></thead>'
        +'<tbody><tr><td><img src="'+img_uri+'"></td><td><div contenteditable="true" id="'+id+'">'+name+'</div></td><td class="description"><div contenteditable="true">'+description+'</div></td><td><div contenteditable="true">'+price+'</div></td><td id="'+cat1Id+'">'+cat1Name+'</td><td id="'+cat2Id+'" onclick="toCatSelect(this)">'+cat2Name+'</td><td>'
      	+'<input type="file" id="inputfile" enctype="multipart/form-data" id="image" class="btn btn-default" style="width:250px"><br><input type="button" value="确认" class="btn btn-default" onclick="modifyProduct(this)"/>' + "\n"
		+'<input type="button" value="删除" class="btn btn-default"  onclick="deleteProduct(this)"/>' + "\n"
		+'<input type="button" value="取消" class="btn btn-default" onclick="resetProduct()"/>' + "\n"
　　    +'<input type="button" value="导出" class="btn btn-default" onclick="exportProduct(this)"/>'
		+'</td></tr></tbody></table><form class="form-inline"><div class="form-group" style="float:left"><select name="schoolList" class="form-control"><option value=1>学校</option></select>\n<select name="buildingList" class="form-control"><option value=1>楼栋</option></select>\n<input type="text" class="form-control" name="word" placeholder="存货量"/>\n'
        +'<input type="text" class="form-control" name="word" placeholder="送货时间"/>\n<input type="button" value="添加" class="btn btn-default" /></div></form></div><div class="third" style="float:left; margin: 50px 0 0 0">'
        +'<table name="'+id+'" class="table table-striped scrolled" >'
        +'<thead><tr><th>学校</th><th>楼栋</th><th>存货量</th><th>送货时间</th></tr></thead><tbody></tbody></table></div></div>');
	for (var i = 0; i < asso.length; ++i) {
		$("table[name="+id+"]").append('<tr><td id="'+asso[i].school_info.id+'">' + asso[i].school_info.name + '</td><td id="'+asso[i].building_info.id+'">' + asso[i].building_info.name + '</td><td>'+asso[i].quantity+'</td><td>'+asso[i].timedelta
										+'</td><td><input type="button" value="删除" class="btn btn-default"  onclick="deleteBuildingProduct(this)"/></td></tr>');
	}
}

function toCatSelect(t) {
	var obj = $(t);
	var cat2_id = $(t).prev().attr('id');
	obj.html('<div class="form-group"><select class="form-control"><option>二级类别</option></select></div>')
	$(t).attr('onclick', "");
	getCat2List(cat2_id, t);
}

function toSchoolSelect(t) {
	var obj = $(t);
	obj.html('<div class="form-group"><select class="form-control"><option>学校</option></select></div>')
	$(t).attr('onclick', "");
	getSchoolList(t);
}

function toBuildingSelect(t) {
	var obj = $(t);
	school_id = obj.siblings().eq(0).attr('id');
	obj.html('<div class="form-group"><select class="form-control"><option>楼栋</option></select></div>')
	$(t).attr('onclick', "");
	getBuildingList(school_id, t);
}

function deleteBuildingProduct(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().parent().parent().parent();
  	var product_id = $(temp).attr("id");
  	var building_id = $(t).parent().siblings().eq(1).attr('id');
  	$(t).parent().parent().remove();
  	var url=" /admin/level1/associate/delete";
    var data = "product_id="+product_id+"&building_id="+buidling_id;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function createProductBuilding(f) {
  	var token = window.localStorage.getItem("token");
	var quantity = f.word[0].value;
	var timedelta = f.word[1].value;
	var product_id = $(f).siblings().eq(0).find('div').eq(0).attr('id');
	var building_id = $(f + " select[name='buildingList']").eq(0).attr('id');
	var url = "/admin/level1/associate/create"
  var data = "product_id=" + product_id+"&building_id="+building_id+"&timedelta="+timedelta;
  	if (quantity != null) {
  		data = data +"&quantity="+quantity;
  	}
	$.ajax({
  		url: url,
  		type: 'POST',
  		data: data + "&csrf_token="+token,
  		success: function(msg) {
  			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
				$("table[name="+id+"]").append('<tr><td>' + '</td><td id="'+building_id+'">' + building_info.name + '</td><td>'+quantity+'</td><td>'+timedelta
										+'</td><td><input type="button" value="删除" class="btn btn-default"  onclick="deleteBuildingProduct(this)"/></td></tr>');
	    	} else {
	    		errorCode(code);
    		}
  		}
  	});
}

function exportProduct(t) {
  	var temp = $(t).parent().siblings();
  	var product_id = $(temp[1]).attr("id");
  	var token = window.localStorage.getItem("token");
  	var url = "/admin/level1/product/export";
    var data = "product_id=" + product_id;
  	$.ajax({
  		url: url,
  		type: 'POST',
  		data: data + "csrf_token="+token,
  		success: function(msg) {
  			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
      			if (!isNaN(data)) {
	    			$("#sales").append(document.createTextNode(data));
	    		} else {
	    			$("body").append("<iframe src='" + data + "' style='display: none;'></iframe>");
	    		}
	    	} else {
	    		errorCode(code);
    		}
  		}
  	});
}

function createProduct(f) {
  	var token = window.localStorage.getItem("token");
	var name = f.word[0].value;
	var description = f.word[2].value; 
	var price = f.word[1].value;
	var cat2_id = $("#cat2").find('option:selected').attr('id');
	var url = "/admin/level1/product/create";
    var data = "name="+name+"&description="+description+"&cat2_id="+cat2_id+"&price="+price;
  	var formdata=new FormData();
  	$.ajax({
  		url: url,
  		type: 'POST',
  		data: formdata+data+"&csrf_token="+token,
  		processData: false,
  		contentType: 'multipart/form-data',
  		success: function(msg) {
  			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getProductList();
	    	} else {
	    		errorCode(code);
    		}
  		}
  	});
}


function modifyProduct(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var product_id = $(temp[1]).attr("id");
  	var name = $(temp[1]).find("div").text();
  	var description = $(temp[2]).find("div").text();
  	var price = $(temp[3]).find("div").text();
  	var cat2_id =  $(temp[5]).find("select option:selected").attr('id');
    var url="/admin//level1/school/modify";
    var data = "product_id=" + product_id + "&name="+name+"&description="+description+"&cat2_id="+cat2_id+"&price="+price;
  	$.ajax({
  		url: url,
  		type: 'POST',
  		data: data + "&csrf_token="+token,
  		success: function(msg) {
  			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			getProductList();
	    	} else {
	    		errorCode(code);
    		}
  		}
  	});
}

function deleteProduct(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var product_id = $(temp[1]).attr("id");
  	$(t).parent().parent().parent().parent().parent().parent().remove();
    var url="/admin/level1/product/delete";
    var data = "product_id="+product_id;
  	$.ajax({
  		url: url,
  		type: 'POST',
  		data: data + "&csrf_token="+token,
  		success: function(msg) {
  			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
	    	} else {
	    		errorCode(code);
    		}
  		}
  	});
}

function getPromotionList() {
  	token = window.localStorage.getItem("token");
  	var url = "/admin/level1/promotion/get_list";
  	$.ajax({
  		url: url,
  		type: 'POST',
  		data: "csrf_token="+token,
  		success: function(msg) {
  			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
      			var data = output.data;
	    		clearTable('promotionTable');
	    		for (var i = 0; i < data.length; ++i) {
	    			addToPromotionTable(data[i].id, data[i].img_uri);
	    		}
	    	} else {
	    		errorCode(code);
    		}
  		}
  	});
}

function addToPromotionTable(id, img_uri) {
	$("#promotionTable tbody").append('<tr><td><img src="'+img_uri+'" id="'+id+'"></td><td>'
		+'<input type="button" value="删除" class="btn btn-default"  onclick="deletePromotion(this)"/></td></tr>');
}

function createPromotion(f) {
  	var token = window.localStorage.getItem("token");
  	var url = "/admin/level1/promotion/create";
    var data = "name="+name+"&description="+description+"&cat2_id="+cat2_id+"&price="+price;
  	var formdata=new FormData();
  	$.ajax({
  		url: url,
  		type: 'POST',
  		data: formdata+ data + "&csrf_token="+token,
  		processData: false,
  		contentType: 'multipart/form-data',
  		success: function(msg) {
  			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
	    	} else {
	    		errorCode(code);
    		}
  		}
  	});
}

function deletePromotion(t) {
  	var token = window.localStorage.getItem("token");
  	var temp = $(t).parent().siblings();
  	var promotion_id = $(temp[0]).find("img").attr("id");
  	$(t).parent().parent().parent().parent().parent().parent().remove();
    var url="/admin/level1/promotion/delete";
    var data = "promotion_id="+promotion_id;
  	$.ajax({
   		type: "POST",
   		url: url,
   		data: data + "&csrf_token=" + token,
   		success: function(msg){
   			var output = msg;
      	    var code = output.code;
      		if (code == 0) {
	    	} else {
	    		errorCode(code);
    		}
   		}
	});
}

function checkSchool(school, buildingId) {
		if ($(school).val() == -1) {
			$("#" + buildingId).val(-1);
			$("#" + buildingId).attr("disabled", "disabled");
		} else if ($(school).val() != -1) {
			$("#" + buildingId).val(-1);
			$("#" + buildingId).removeAttr("disabled");
			getBuildingList();
			$('.selectpicker').selectpicker('refresh');
		}
}

function checkYear(year) {
	if ($(year).val() == -1) {
			$("#quarter").val(-1);
			$("#month").val(-1);
			$("#month").attr("disabled", "disabled");
			$("#quarter").attr("disabled", "disabled");
			$('.selectpicker').selectpicker('refresh');
		} else if ($(year).val() != -1) {
			$("#month").removeAttr("disabled");
			$("#quarter").removeAttr("disabled");
			$('.selectpicker').selectpicker('refresh');
		}
}

function checkBoth(a, b) {
	if ($("#" + a).val() != -1) {
			$("#" + b).attr("disabled", "disabled");
	} else {
		$("#" + b).removeAttr("disabled");
	} 
}

function checkCat(cat1) {
		if ($(cat1).val() == -1) {
			$("#cat2").val(-1);
			$("#cat2").attr("disabled", "disabled");
		} else if ($(cat1).val() != -1) {
			$("#cat2").removeAttr("disabled");
		}
}

function deleteRow(t) {
	$(t).parent().parent().remove();
}

// initialize the page
function initPage() {
	getSchoolList();
	getAdmin2ndList();
	getAdmin3rdList();
	getCat1List();
	getProductList();
	getPromotionList();
}

function resetBuilding(school, tableId) {
	clearTable(tableId);
	getBuildingList();
}

function resetSchool() {
	clearTable('schoolTable');
	getSchoolList(1);
}

function resetAdmin2nd() {
	clearTable('managerTable');
	getAdmin2ndList();
}

function resetAdmin3rd() {
	clearTable('hostTable');
	getAdmin3rdList();
}

function resetCat1() {
	clearTable('cat1Table');
	getCat1List();
}

function resetCat2() {
	clearTable('cat2Table');
	getAdmin2ndList();
}

function clearTable(tableId) {
	$("#"+tableId + ' tbody tr').remove();
}

function clearDiv() {
	var d = $("#productList").children();
	for (var i = 0; i < d.length; ++i) {
		d[i].remove();
	}
}

function clearList(selectName) {
	if (selectName == 'schoolList') {
		schools = $('select[name="schoolList"]');
		for (var i = 0; i < schools.length; ++i) {
			$(schools[i]).find('option[value!=-1]').remove();
		}
	} else {
		$("select[name="+selectName+"]").find('option[value!=-1]').remove();
	}
}


