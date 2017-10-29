
angular.module("Slider.Ctrl")

.controller("ctrl_revenue",function($scope,$rootScope,jsonRepo3,Util){
	var ctrl = this; //controller as revenue
	jsonRepo3._getAll(function(result){
		console.log("complete to bring in revenue data from db", result);
		ctrl.record = result.data;
	});
	
	var _getFormData = function() {
		return ctrl.record.filter(function(el){
			return el.flag && el.flag==true;
		});
	};
	
	ctrl.deleteData = function() {
		
		var formData = _getFormData();
		if( formData.length == 0 ) {
			alert('선택된 항목이 없습니다');
			return;
		};
		
		jsonRepo3._drop(formData, function(res){
			jsonRepo3._getAll(function(result){
				ctrl.record = result.data;
			});
			alert(res.data.count+"개 삭제되었습니다");
		});
	};
	ctrl.sendData = function() {
		
		var formData = _getFormData();
		if( formData.length == 0 ) {
			alert('선택된 항목이 없습니다');
			return;
		};
			
		jsonRepo3._create(formData, function(res){
			alert(res.data.count+"개 추가되었습니다");
		});
		
	};
	ctrl.dropForm = function() {
		ctrl.record.pop();
	};
	
	ctrl.createForm = function() {
		ctrl.record.push(
			{
				item_name:'1',
				category:'1',
				dte:'1',
				amount:'1',
				place:'1',
				pay_method:'1',
			    flag:true
			}
		);
	};
	
});
