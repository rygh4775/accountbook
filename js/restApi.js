restApi = function(){
	
	var token_url = page.restUrl + "token?grant_type=client_credentials&client_id="+page.client_id+"&client_secret="+page.client_secret;

	
	$.getJSON(token_url,function(data){
	    page.outh_token = data.access_token;
		});
	
	$.ajaxSetup({
		global: true,
        dataType: 'json',
  	  	beforeSend: function (xhr) {
       	xhr.setRequestHeader('Authorization', 'Bearer '+page.outh_token);
        },
  	  	success: function(data,status,xhr){
	      	console.log(data);
	      },
	    error: function(response){
	  	  var error = jQuery.parseJSON(response.responseText);
	  	  alert(error.error_description);
	    }
  	});
	
	this.createUser = function(config){
	    $.ajax({
	      url: page.restUrl + 'users',
	      type: "POST",
	      data: config.data,
	      success : config.success
	    });
	};
	
	this.getUser = function(config){
	    $.ajax({
	      url: page.restUrl + 'users/'+ config.id,
	      type: "GET",
	      success : config.success
	    });
	};
	
	this.getGroupsWithUser = function(config){
	    $.ajax({
	      url: page.restUrl + 'users/' + config.id + '/groups',
	      type: "GET",
	      success : config.success
	    });
	};
	  
	this.createGroup = function(config){
	    $.ajax({
	      url: page.restUrl + 'groups',
	      type: "POST",
	      data: config.data,
	      success : config.success
	    });
	};
	
	this.addUserToGroup = function(config){
	    $.ajax({
	      url: page.restUrl + 'groups/' + config.groupId + '/users/' + config.id ,
	      type: "POST",
	      success : config.success
	    });
	 };
	 
	 this.getUsersInGroup = function(config){
	    $.ajax({
	      url: page.restUrl + 'groups/' + config.groupId + '/users',
	      type: "GET",
	      success : config.success
	    });
	 };
	 
	 this.createEntity = function(config){
	    $.ajax({
	      url: page.restUrl + config.collection,
	      type: "POST",
	      data: config.data,
	      success : config.success
	    });
	};
	
	this.connectEntities = function(config){
		$.ajax({
			url: page.restUrl + config.firstCollection +'/'+ config.firstId + '/'+config.secondCollection + '/' +config.secondId,
			type: "POST",
			success : config.success
		});
	};

	this.getConnectedEntities = function(config){
		$.ajax({
			url: page.restUrl + config.firstCollection +'/'+ config.firstId + '/'+config.secondCollection,
			type: "GET",
			success : config.success
		});
	};
	
//	deleteUserFromGroup = function(){
//		var group_id = 'testGroup2';
//		var user_id = 'testUser2';
//	    $.ajax({
//	      url: page.restUrl + 'groups/' + group_id + '/users/' + user_id,
//	      type: "DELETE"
//	    });
//	};
//	
//	addUserToRole = function(){
//		var role_name = 'manager';
//		var user_id = 'host';
//	    $.ajax({
//	      url: page.restUrl + 'roles/' + role_name + '/users/' + user_id,
//	      type: "POST"
//	    });
//	};
	
};
	
