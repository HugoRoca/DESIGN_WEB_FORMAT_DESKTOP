/* 
 * opc: 0: a�o con spinner 
 * opc: 1: a�o con lista deplegable 
 */

function Calendar(opc) {
	var objCal = this;
	this.date = new Date();
	this.dats = null;
	var cap;
	var cal;
	var button;
	var input;
	var type = 0;
	var sel = null;
	
	this.selMes = null;
	this.objYear = null;
	
	this.setInput = function(inp) {
		input = getObj(inp);
		//alert(input);
	};
	
	this.printCalendar = function(obj, inp, day, month, year) {
		type = 1;
		if (inp) input = getObj(inp);
		//alert(input);

		if (day) this.date.setDate(day);
		if (month) this.date.setMonth(month - 1);
		if (year) this.date.setYear(year);
		
		cap = getObj(obj);
		cap.id = 'capCalendar';
		cap.className = 'dvCal'; 
		
		var divTop = document.createElement('div');
		divTop.className = 'calTop';
		var divMes = document.createElement('div');
		divMes.className = 'divMes';
		
		this.selMes = document.createElement('select');
		//selMes.id = 'selCalMonth';
		var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
		
		for (var m = 0; m < 12; m ++) {
			if (m == this.date.getMonth()) this.selMes.options[m] = new Option(meses[m], m, true); 
			else this.selMes.options[m] = new Option(meses[m], m);
		}
		listen(this.selMes, 'change', setMonth);
		divMes.appendChild(this.selMes);
		
		var divAno = document.createElement('div');
		divAno.className = 'divAno';
		
		if (opc) {
			this.objYear = document.createElement('select');
		
			var objDD = new Date();
			var ya = objDD.getFullYear();
			var iy = 0;
			for (var y = ya; y >= 1900; y --) {
				this.objYear.options[iy] = new Option(y, y);
				iy ++;
			}
			
			listen(this.objYear, 'change', setYear);
		}	else {
			this.objYear = document.createElement('input');
			this.objYear.value = this.date.getFullYear(); 
		}
		
		divAno.appendChild(this.objYear);
		
		if (!opc) {
			var spinner = document.createElement('span');
			
			var lnkUp = document.createElement('a');
			lnkUp.href = 'JavaScript:;';
			lnkUp.className = 'lnkUp';
			listen(lnkUp, 'click', this.anoUp);
			
			var lnkDown = document.createElement('a');
			lnkDown.href = 'JavaScript:;';
			lnkDown.className = 'lnkDown';
			listen(lnkDown, 'click', this.anoDown);
			
			spinner.appendChild(lnkUp);
			spinner.appendChild(lnkDown);
			
			divAno.appendChild(spinner);
		}
		
		divTop.appendChild(divMes);
		divTop.appendChild(divAno);
		
		cap.appendChild(divTop);
		
		cal = document.createElement('div');
		cal.className = 'divCal';
		cal.appendChild(objCal.getTable());
		cap.appendChild(cal);
	};
	
	this.showCalendar = function(obj, inp, day, month, year, dts) {
		this.dats = dts;
		button = getObj(obj);
		input = getObj(inp);

		if (day) this.date.setDate(day);
		if (month) this.date.setMonth(month - 1);
		if (year) this.date.setYear(year);
		
		if (!cap) {
			cap = document.createElement('div');
			cap.id = 'capCalendar';
			
			var divTitle = document.createElement('div');
			divTitle.className = 'calTitle';
			
			var lnkClose = document.createElement('a');
			lnkClose.href = 'JavaScript:;';
			lnkClose.title = 'Cerrar';
			listen(lnkClose, 'click', objCal.close);
			
			divTitle.appendChild(lnkClose);
			
			var divTop = document.createElement('div');
			divTop.className = 'calTop';
			var divMes = document.createElement('div');
			divMes.className = 'divMes';
			
			this.selMes = document.createElement('select');
			//selMes.id = 'selCalMonth';
			var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
			
			for (var m = 0; m < 12; m ++) {
				if (m == this.date.getMonth()) this.selMes.options[m] = new Option(meses[m], m, true); 
				else this.selMes.options[m] = new Option(meses[m], m);
			}
			listen(this.selMes, 'change', setMonth);
			divMes.appendChild(this.selMes);
			
			var divAno = document.createElement('div');
			divAno.className = 'divAno';
			
			if (opc) {
				this.objYear = document.createElement('select');
			
				var objDD = new Date();
				var ya = objDD.getFullYear();
				var iy = 0;
				for (var y = ya; y >= 1900; y --) {
					this.objYear.options[iy] = new Option(y, y);
					iy ++;
				}
				
				listen(this.objYear, 'change', setYear);
			}	else {
				this.objYear = document.createElement('input');
				this.objYear.value = this.date.getFullYear(); 
			}
			
			divAno.appendChild(this.objYear);
			
			if (!opc) {
				var spinner = document.createElement('span');
				
				var lnkUp = document.createElement('a');
				lnkUp.href = 'JavaScript:;';
				lnkUp.className = 'lnkUp';
				listen(lnkUp, 'click', this.anoUp);
				
				var lnkDown = document.createElement('a');
				lnkDown.href = 'JavaScript:;';
				lnkDown.className = 'lnkDown';
				listen(lnkDown, 'click', this.anoDown);
				
				spinner.appendChild(lnkUp);
				spinner.appendChild(lnkDown);
				
				divAno.appendChild(spinner);
			}
			
			divTop.appendChild(divMes);
			divTop.appendChild(divAno);
			
			cap.appendChild(divTitle);
			cap.appendChild(divTop);
			
			cal = document.createElement('div');
			cal.className = 'divCal';
			cal.appendChild(objCal.getTable());
			cap.appendChild(cal);
			getBody().appendChild(cap);
		}	else {
			cap.style.visibility = 'visible';
			clearNode(cal);
			cal.appendChild(objCal.getTable());
		}
		
		var pos = getPos(button);
		cap.style.left = (pos.left + button.offsetWidth + 5) + 'px';
		cap.style.top = pos.top + 'px';
		
	};
	
	this.getInput = function() {
		return input;
	};
	
	function getTop() {
		
	}
	
	this.setMes = function(month, year) {
		objCal.date.setMonth(month);
		objCal.date.setFullYear(year);
		clearNode(cal);
		
		cal.appendChild(objCal.getTable());
	};
	
	function setYear(evt) {
		var year = setEvent(evt).target.value;
		objCal.date.setYear(year);
		objCal.setMes(objCal.selMes.value, year);
	};
	
	this.getTable = function() {
		var aDate = new Date();
		aDate.setYear(objCal.date.getFullYear());
		aDate.setMonth(objCal.date.getMonth());
		
		aDate.setDate(1);
		var first = aDate.getDay();
		
		var dm = objCal.date.getMonth();
		
		if (dm == 3 || dm == 5 || dm == 8 || dm == 10) dMes = 30;
		else if (dm == 1) { 
			var da = this.date.getFullYear();
			if (da % 4 == 0) {
				if (da % 100 == 0) {
					if (da % 400) dMes = 29;
					else dMes = 28;
				}	else dMes = 29;
			}	else dMes = 28;
		}	else dMes = 31;
		
		aDate.setDate(dMes);
		var last = aDate.getDay();
		
		var dias = new Array();
		for (var d = 0; d < first; d ++) dias[d] = '';
		for (var d = first; d < first + dMes; d ++) dias[d] = d - first + 1;
		for (var d = 0; d < 6 - last; d ++) dias[d + first + dMes] = '';
		
		var table = document.createElement('table');
		table.cellSpacing = 1;
		var headTR = document.createElement('tr');
		var aDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
		var nd = aDays.length;
		for (var d = 0; d < nd; d ++) {
			var headTH = document.createElement('th');
			var label = document.createTextNode(aDays[d]);
			headTH.appendChild(label);
			
			headTR.appendChild(headTH);
		}
		table.appendChild(headTR);
		
		var nSems = dias.length / 7;
		for (var s = 0; s < nSems; s ++) {
			var bodyTR = document.createElement('tr');
			for (d = 0; d < 7; d ++) {
				var di = s * 7 + d;
				
				var bodyTD = document.createElement('td');
				
				var lblDay = document.createTextNode(dias[di]);
				if (dias[di]) {
					var lnkDay = document.createElement('a');
					lnkDay.href = 'JavaScript:;';
					listen(lnkDay, 'click', setCalDate);
					lnkDay.appendChild(lblDay);
					
					bodyTD.appendChild(lnkDay);
					if (d == 0) bodyTD.className = 'monday';
				}	else {
					bodyTD.className = 'void';
				}
				
				if (dias[di] == objCal.date.getDate()) bodyTD.className = 'current';
				
				bodyTR.appendChild(bodyTD);
			}
			table.appendChild(bodyTR);
		}
		
		return table;
	};
	
	this.execAction = function() {
		
	};
	
	function setCalDate(evt) {
		evt = setEvent(evt);
		var day = evt.target.firstChild.nodeValue;
		if (day < 10) day = '0' + day;
		
		var month = parseInt(objCal.selMes.value, 10) + 1; 
		if (month < 10) month = '0' + month;
		
		//alert(input);
		input.value = day + '/' + month + '/' + objCal.date.getFullYear();
		
		if (type == 0) cap.style.visibility = 'hidden';
		else {
			if (sel) sel.removeAttribute('class');
			var act = evt.target.parentNode;
			act.className = 'selected';
			sel = act;
		}
		objCal.execAction();
	}

	this.anoUp = function() {
		objCal.objYear.value = parseInt(objCal.objYear.value) + 1;
		objCal.setMes(objCal.selMes.value, objCal.objYear.value);
	};
	this.anoDown = function() {
		objCal.objYear.value = parseInt(objCal.objYear.value) - 1;
		objCal.setMes(objCal.selMes.value, objCal.objYear.value);
	};
	
	function setMonth() {
		objCal.date.setMonth(objCal.selMes.value);
		objCal.setMes(objCal.selMes.value, objCal.objYear.value);
	};
	
	this.close = function(evt) {
		if (cap) cap.style.visibility = 'hidden';
	};
}