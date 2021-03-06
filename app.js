$(function() {

	var api = new restApi();
	
	var showGroupList = function(entities){
		$(".removeGroupList").remove();
		
		var groupList = $("#groupList");
		for(var idx in entities){
		var groupName = entities[idx].name;
		var list = $('<a data-role="button" data-icon="arrow-r" class="removeGroupList" data-iconpos="right">'+groupName+'</a>');
		
		(function(list,groupName){
			list.on('click',function(){
				location.href = "#cashbook";
				page.groupId = groupName;
				$('.groupName').text(page.groupId);
			});
		})(list,groupName);
		
		list.appendTo(groupList);
	  	}
		$('#groups').trigger('pagecreate');
	};
	
	var showMemberList = function(entities){
		$('.removeUserList').remove();
		
		var memberList = $("#memberList");
		
		for(var idx in entities){
		var userName = entities[idx].username;
		var list = $('<p class="removeUserList">'+userName+'</p>');
		list.appendTo(memberList);
	  	}
		
	};
	
	var showDealList = function(entities, dateText){
		$(".removeDayStateList").remove();
		
    	var totalDeposit = 0;
    	var totalWithdrawal = 0;
    	
    	for(var index in entities){
    		var entity = entities[index];
    		
    		if(entity.date == dateText){
    			dealList(entity);
    			totalDeposit += Number(entity.deposit);
    			totalWithdrawal += Number(entity.withdrawal);
    		}
    		else{
    			$(".removeDayStateList").remove();
    		}
    	}
    	
    	$("#totalDeposit").text(totalDeposit);
    	$("#totalWithdrawal").text(totalWithdrawal);
    	$("#amount").text(totalDeposit-totalWithdrawal);
	};
	
	var showTotalDealList = function(entities){
		var allDeposit = 0;
    	var allWithdrawal = 0;
    	
    	for(var index in entities){
    		var entity = entities[index];
    		allDeposit += Number(entity.deposit);
    		allWithdrawal += Number(entity.withdrawal);
    	}
    	
    	$("#allDeposit").text(allDeposit);
    	$("#allWithdrawal").text(allWithdrawal);
    	$("#allAmount").text(allDeposit-allWithdrawal);
	};
	
	var dealList = function(entity){
		
		var dayState = $("#dayState");
		var html = $('<div class="ui-body ui-body-c removeDayStateList" >'
				+	'<center>'
				+	'<div class="ui-grid-d">'
				+		'<div class="ui-block-a">이 름</div>'
				+		'<div class="ui-block-b">입 금</div>'
				+		'<div class="ui-block-c">출 금</div>'
				+		'<div class="ui-block-d">내 용</div>'
				+		'<div class="ui-block-a"><span style="color:#0100FF;">'+entity.createdBy+'</span></div>'
				+		'<div class="ui-block-b"><span style="color:#0100FF;">'+entity.deposit+'</span></div>'
				+		'<div class="ui-block-c"><span style="color:#FF0000;">'+entity.withdrawal+'</span></div>'
				+		'<div class="ui-block-d"><span style="color:#FF0000;">'+entity.contents+'</span></div>'
				+	'</div>'	
				+	'</center>'	
				+  '</div>');		
					
		html.appendTo(dayState);
	};
	
	$( "#datepicker" ).datepicker({
		dateFormat: "yy-mm-dd",
		showOtherMonths: true,
		selectOtherMonths: true,
		onSelect: function(dateText, inst) {
		
			api.getConnectedEntities({
				firstCollection : 'groups',
				firstId : page.groupId,
				secondCollection : 'accounts',
				success: function(result){
					var entities = result.entities;
					showDealList(entities, dateText);
	   	      	}
			}); 
		
		}
	}); 

	$( "#datepicker2" ).datepicker({
		dateFormat: "yy-mm-dd",
		showOtherMonths: true,
		selectOtherMonths: true,
		onSelect: function(dateText, inst) {
			console.log(  dateText  ); 
		}
	});
	$( "#datepicker2" ).datepicker('setDate', 'today'); 

	$( "#datepicker3" ).datepicker({
		dateFormat: "yy-mm-dd",
		showOtherMonths: true,
		selectOtherMonths: true,
		onSelect: function(dateText, inst) {
			console.log(  dateText  ); 
		}
	});
	$( "#datepicker3" ).datepicker('setDate', 'today');

	$( "#datepicker4" ).datepicker({
		dateFormat: "yy-mm-dd",
		showOtherMonths: true,
		selectOtherMonths: true,
		onSelect: function(dateText, inst) {
			console.log(  dateText  ); 
			}
	});
	$( "#datepicker4" ).datepicker('setDate', 'today');
	
    $( "#tabs" ).tabs();
	
    
	$("#createUser").on('click',function(){
    	var data = $("#createUserForm").toJSON();
    	
    	if(data.username&&data.password&&data.confirmPassword != ''){
    		api.createUser({
    			data: JSON.stringify(data),
    			success : function(){
    				alert("success join!");
    			}
    		});
    	}
    	else{
    		alert("fill out the empty blank");
    	}
    	
	});
  
    $("#logIn_btn").on('click',function(){
    	var data = $("#loginUserForm").toJSON();
    	
    	if(data.username&&data.password != ''){
    		api.getUser({
    			id: data.username,
    			success: function(result){
    				if(result.entities[0].confirmPassword == data.password){
    					page.id = data.username;
    					
   						api.getGroupsWithUser({
    						id: data.username,
    						success : function(result){
    							var entities = result.entities;
    	      	    	    	showGroupList(entities);
    						}
    					}); 
    					
          	    		location.href = "#groups"; 
    				}
    				else{
    					alert("check your apssword");
    				}
    			}
  			});
    	}
    	
    });
    
    $("#addGroup_btn").on('click',function(){
    	var data = $("#createGroupForm").toJSON();
    	data.path = data.name;
    	
    	if(data.name != ''){
    		api.createGroup({
    			data: JSON.stringify(data),
    			success : function(){
    				api.addUserToGroup({
    					id: page.id,
    					groupId: data.name,
    					success: function(){
    						api.getGroupsWithUser({
        						id: page.id,
        						success : function(result){
        							var entities = result.entities;
        	      	    	    	showGroupList(entities);
        						}
        					}); 
    						location.href = "#groups"; 
    					}
    				});
    			}
    		});
    	}
    	else{
    		alert("fill out the empty blank");
    	}
    	
    });
    
    $("#setup_btn").on('click',function(){
    	
    	api.getUsersInGroup({
    		groupId: page.groupId,
    		success: function(result){
    			var entities = result.entities;
      	    	showMemberList(entities);
      	    	location.href = "#setup";
    		}
    	});
   
    });
    
    $("#addUser_btn").on('click',function(){
    	var inveiteUser = $("#inviteUser").val();
    	
    	api.addUserToGroup({
			id: inveiteUser,
			groupId: page.groupId,
			success: function(result){
				$("#setup_btn").trigger('click');
			}
		});

    });
    
    $("#deposit_btn").on('click',function(){
    	var data = $("#depositForm").toJSON();
		data.withdrawal = '0';
		data.createdBy = page.id;
		
		api.createEntity({
			collection: 'accounts',
			data: JSON.stringify(data),
			success: function(result){
				var uuid = result.entities[0].uuid;
				api.connectEntities({
					firstCollection: 'groups',
					firstId: page.groupId,
					secondCollection: 'accounts',
					secondId: uuid,
					success: function(){
						alert("success deposit!");
					}
				});
			}
		});
		
    });

    $("#withdrawl_btn").on('click',function(){
    	
    	var data = $("#withdrawalForm").toJSON();
		data.deposit = '0';
		data.createdBy = page.id;
		
		api.createEntity({
			collection: 'accounts',
			data: JSON.stringify(data),
			success: function(result){
				var uuid = result.entities[0].uuid;
				api.connectEntities({
					firstCollection: 'groups',
					firstId: page.groupId,
					secondCollection: 'accounts',
					secondId: uuid,
					success: function(){
						alert("success withdrawal!");
					}
				});
			}
		});
		
    });
    
    $("#asset_btn").on('click',function(){
    	
    	api.getConnectedEntities({
			firstCollection : 'groups',
			firstId : page.groupId,
			secondCollection : 'accounts',
			success: function(result){
				var entities = result.entities;
				showTotalDealList(entities);
   	      	}
		}); 
    	
    });
});