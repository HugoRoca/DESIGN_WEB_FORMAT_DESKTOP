var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}
};

String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g,'');
};

function isEmail(val) {
    if (val.length == 0) return false;
    var filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return filter.test(val);
}

function isURL(val) {
   var res = /^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/i.test(val);
   return res;
}

function get(id) {
    return document.getElementById(id);
}

function getObj(obj) {
    if (typeof obj == "string") obj = get(obj);
    return obj;
}

function getPos(obj) {
    obj = getObj(obj);

    if (!obj) return {left:0, top:0};

    var y = 0;
    var x = 0;

    while (obj.offsetParent) {
          x += obj.offsetLeft;
          y += obj.offsetTop;
          obj = obj.offsetParent;
    }
    return {left : x, top : y};
}

function gtn(obj, tag) {

    //say('obj: ' + obj);
	obj = getObj(obj);
	return obj.getElementsByTagName(tag);
}

function gtnc(obj, tag, clase) {
    var eles = gtn(obj, tag);
    var ne = eles.length;

    var arr = new Array();
    var i = 0;

    for (var e = 0; e < ne; e ++) {
        var ele = eles[e];

        if (ele.className.indexOf(clase) != -1) {
            arr[i] = ele;
            i ++;
        }
    }

    if (arr.length) return arr;
    else return 0;
}

function getNavegador() {
    var nav = window.navigator;
    var ver = 0;

    if (nav.appName.indexOf("Explorer") != -1) {
       oVer = nav.appVersion;
       var pi = oVer.indexOf("MSIE") + 5;
       var pf = oVer.indexOf(";", pi);

       ver = oVer.substr(pi, pf - pi);
    }

    return ver;
}

function setEvent(evt) {
    var e = new Object();

    var nav = getNavegador();

    if (nav) e.target = evt.srcElement;
    else e.target = evt.target;

    e.shiftKey = evt.shiftKey;
    e.ctrlKey = evt.ctrlKey;

    var tipo = evt.type;
    e.type = tipo;

    if (tipo == 'keydown' || tipo == 'keyup') {
       e.keyCode = evt.keyCode;
    }  /*else if (tipo == "keypress") {

    }*/

    e.preventDefault = function() {
	   if (nav) evt.returnValue = false;
	   else evt.preventDefault();
    };

    e.stopPropagation = function() {
    	if (nav) evt.cancelBubble = true;
        else evt.stopPropagation();
    };

    var x = evt.clientX;
    var y = evt.clientY;

    e.clientX = x;
    e.clientY = y;

    if (nav) {
    	e.scrollLeft = document.documentElement.scrollLeft;
    	e.scrollTop = document.documentElement.scrollTop;

    	x += e.scrollLeft;
       	y += e.scrollTop;

    } else {
       x = evt.pageX;
       y = evt.pageY;

       e.scrollLeft = x - e.clientX;
       e.scrollTop = y - e.clientY;
    }

    e.pageX = x;
    e.pageY = y;

    return e;
}

function listen(obj, event, func) {
    obj = getObj(obj);
    if (obj.addEventListener) {
        obj.addEventListener(event, func, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + event, func);
    }
}

function removeListen(obj, event, func) {
    obj = getObj(obj);
    if (obj.addEventListener) {
        obj.removeEventListener(event, func, false);
    } else if (obj.attachEvent) {
        obj.detachEvent('on' + event, func);
    }
}

function getBody() {
	return gtn(document, 'body')[0];
}
function getHead() {
	return gtn(document, 'head')[0];
}

function clearNode(obj) {
	obj = getObj(obj);

    while(obj.hasChildNodes()) {
        obj.removeChild(obj.lastChild);
    }
}

function removeElement(obj) {
    obj = getObj(obj);
    if (obj) {
        if (typeof obj != 'undefined' && typeof obj.onremove === 'function') {
            obj.onremove();
        }

        obj.parentNode.removeChild(obj);
    }
}

function removeCap(obj) {
    removeElement(obj);
}

function toInt(num) {
    num = parseInt(num, 10);

    if (isNaN(num)) num = 0;

    return num;
}

function toLong(num) {
    num = parseInt(num, 10);

    if (isNaN(num)) num = 0;

    return num;
}

function toFloat(num) {
    num = parseFloat(new String(num).replace(',', ''));

    if (isNaN(num)) num = 0;

    return num;
}

function isUser(val) {
	if (val.length == 0) return false;
    var filter = /^[a-z][a-z0-9_]{0,16}$/;
    if (filter.test(val)) return true;
    else return false;
}

function isPass(val) {
	if (val.length == 0) return false;
    var filter = /^[a-z0-9][a-z0-9_]{0,16}$/;
    if (filter.test(val)) return true;
    else return false;
}

function selSelected(sel, ids) {
    sel = getObj(sel);
    var ns = sel.length, s;

    for (s = 0; s < ns; s ++) {
        //alert(sel.options[s].value + ', ' + ids);
        if (sel.options[s].value == ids) {
            sel.selectedIndex = s;
            break;
        }
    }
}

function setDate(fec) {
    var sep = '';

    if (fec.indexOf('/') != -1) {
        sep = '/';
    } else if (fec.indexOf('-') != -1) {
        sep = '-';
    } else {
        alert('Fecha no válida');
        return false;
    }

    var fcs = fec.split(sep);

    if (fcs[2].length == 4) {
        return fcs[2] + '-' + fcs[1] + '-' + fcs[0];
    } else if (fcs[0].length == 4) {
        return fcs[2] + '/' + fcs[1] + '/' + fcs[0];
    } else {
        alert('Fecha no válida');
        return false;
    }
}

function setDate1(fec) {
    var sep = '';

    if (fec.indexOf('/') != -1) {
        sep = '/';
    } else if (fec.indexOf('-') != -1) {
        sep = '-';
    } else {
        //alert('Fecha no válida');
        return false;
    }

    var fcs = fec.split(sep);

    if (fcs[2].length == 4) {
        return fcs[2] + '-' + fcs[1] + '-' + fcs[0];
    } else if (fcs[0].length == 4) {
        return fcs[2] + '/' + fcs[1] + '/' + fcs[0];
    } else {
        //alert('Fecha no válida');
        return false;
    }
}

function getDateTime(fec) {
    var date = new Date();
    var pg = date.toString().indexOf('GMT');

    var time = date.toString().substr(pg - 10, 9);

    return setDate(fec) + time;
}

function get2DateTime(fec) {
    var date = new Date();
    var pg = date.toString().indexOf('GMT');

    var time = date.toString().substr(pg - 10, 9);

    return fec + time;
}
function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

function getStyle(oElm, strCssRule) {
    oElm = getObj(oElm);

    var strValue = '';

    if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(oElm, '').getPropertyValue(strCssRule);
    } else if (oElm.currentStyle) {
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });

        strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
}

function dump(obj) {
    var rst = '';

    if (isArray(obj)) {
        var nl = obj.length, l;
        for (l = 0; l < nl; l ++) rst += l + ' : ' + obj[l] + '<br />';
    } else {
        for (ele in obj) rst += ele + ' : ' + obj[ele] + '<br />';
    }
    say(rst);
}
function say(txt) {
    get('say').innerHTML = txt;
}

function getNodeValue(node) {
    if (node.hasChildNodes()) {
        while (node.hasChildNodes()) {
            node = node.firstChild;
        }
        return node.nodeValue.trim();
    } else return '';
}

function fillSelect(sel, arr, selected, ids, desc) {
    if (typeof ids == 'undefined' || typeof desc == 'undefined') {
        var ele, c = 0;
        for (ele in arr[0]) {
           if (c == 0) ids = ele;
           else if (c == 1) desc = ele;

           c ++;
        }
    }

    var na = arr.length, a;

    sel.length = 0;

    if (na > 0) {
        for (a = 0; a < na; a ++) {
            var opt = arr[a];
            sel.options[a] = new Option(opt[desc], opt[ids], opt[ids] == selected);
        }
    }   else {
        sel.options[0] = new Option('\u00A0', '');
    }
}

function getPreIntVal(evt) {
    var pPos = posCursor(evt.target);
    var val = evt.target.value;

    var key = evt.keyCode;
    var chr = (key > 47 && key < 58) ? String.fromCharCode(key) : String.fromCharCode(key - 48);

    return toInt(val.substr(0, pPos) + chr + val.substr(pPos));
}

function getPreDstosVal(evt) {
    var pPos = posCursor(evt.target);
    var val = evt.target.value;

    var key = evt.keyCode;
    get('say2').innerHTML = 'key: ' + key;

    var dsto = 1;

    if (key == 107 || (key > 47 && key < 58) || (key > 95 && key < 106)) {
        var chr = key == 107 ? '+' : (key > 47 && key < 58) ? String.fromCharCode(key) : String.fromCharCode(key - 48);

        val = val.substr(0, pPos) + chr + val.substr(pPos);
    }  else if (key == 8) {
        val = val.substr(0, pPos - 1) + val.substr(pPos);
    }   else if (key == 46) {
        val = val.substr(0, pPos) + val.substr(pPos + 1);
    }

    var dsts = val.split('+');
    var nd = dsts.length, d;

    for (d = 0; d < nd; d ++) {
        dsto *= (100 - dsts[d]) / 100;
    }

    var e = (1 - dsto) * 100;

    //say('e: ' + e);

    return e;
}