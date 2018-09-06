function noHelp(evt) {
    evt = setEvent(evt);
    if (evt.keyCode == 112) evt.preventDefault();
    if (evt.ctrlKey) evt.preventDefault();
}

var Former = null;
var nav;
var cAlert, cConfirm;
var calDate = null;
var calDoc = null;
var calSch = null;

window.onload = function() {
    nav = getNavegador();
    //alert(nav);
    listen(window, 'keydown', noHelp);
    listen(document, 'keydown', noHelp);
    document.onhelp = function() {
        return false;
    };

    /* cAlert y cConfirm */
    
    cAlert = get('alertCap');
	if (cAlert) {
		cAlert.show = function(say, opc, caller) {
            this.caller = null;
			var aSay = get('aSay');
			clearNode(aSay);
			var txt = document.createTextNode(say);
			aSay.appendChild(txt);

			if (typeof opc != 'undefined') {
				gtn(this, 'img')[0].src = 'imgs/error.png';
				gtn(this, 'span')[0].innerHTML = 'Error';
			}

            if (typeof caller != 'undefined') this.caller = getObj(caller);

			var sw = document.documentElement.clientWidth;
			var sh = document.documentElement.clientHeight;

			var w = this.offsetWidth;
			var h = this.offsetHeight;

			var lf = Math.round((sw - w) / 2);
			var tp = Math.round((sh - h) / 2);

			this.style.left = lf + 'px';
			this.style.top = tp + 'px';
			this.style.visibility = 'visible';
			//gtn(this, 'div')[1].style.width = (w - 14) + 'px';

			this.capTop = document.createElement('div');
			this.capTop.id = 'capATop';
			getBody().appendChild(this.capTop);
			goOnTop(this.capTop);

			this.style.zIndex = this.capTop.style.zIndex + 1;
            gtn(this, 'button')[0].focus();
		};

		cAlert.onclose = function() {

		};

		cAlert.close = function() {
			removeElement(this.capTop);
			cAlert.style.visibility = 'hidden';

            var firstLevel = levelsCap.indexOf(currentForm);
            var nl = levelsCap.length, l;

            for (l = firstLevel; l < nl - 1; l ++) {
                levelsCap[l] = levelsCap[l + 1];
                if (get(levelsCap[l])) get(levelsCap[l]).style.zIndex = l;
            }

            delete managers[currentForm];
            levelsCap.pop();

            currentForm = levelsCap.length > 0 ? get(levelsCap[levelsCap.length - 1]).id : null;
            if (currentForm) goOnTop(currentForm);

			gtn(this, 'img')[0].src = 'imgs/notification.png';
			gtn(this, 'span')[0].innerHTML = 'Advertencia';

            if (this.caller != null) this.caller.focus();

			this.onclose();
		};
	}

	cConfirm = get('confirmCap');

	if (cConfirm) {
		var butts = gtn(cConfirm, 'button');
		cConfirm.btnOK = butts[0];
		cConfirm.btnCancel = butts[1];
        cConfirm.caller = null;

        function setCnfCancel(evt) {
            evt = setEvent(evt);
            if (evt.keyCode == 39) cConfirm.btnCancel.focus();
        }

        function setCnfOK(evt) {
            evt = setEvent(evt);
            if (evt.keyCode == 37) cConfirm.btnOK.focus();
        }

        listen(cConfirm.btnOK, 'keydown', setCnfCancel);
        listen(cConfirm.btnCancel, 'keydown', setCnfOK);

        cConfirm.show = function(say, caller) {
            if (typeof caller != 'undefined') cConfirm.caller = getObj(caller);
			cConfirm.btnCancel.onclick = function() {
                cConfirm.close();
                cConfirm.onCancel();
                cConfirm.clearFunctions();
			};

			cConfirm.btnOK.onclick = function() {
                cConfirm.close();
                cConfirm.onOK();
                cConfirm.clearFunctions();
			};

			var cSay = get('cSay');
            cSay.innerHTML = say;

			var sw = document.documentElement.clientWidth;
			var sh = document.documentElement.clientHeight;

			var w = this.offsetWidth;
			var h = this.offsetHeight;

			var lf = Math.round((sw - w) / 2);
			var tp = Math.round((sh - h) / 2);

			this.style.left = lf + 'px';
			this.style.top = tp + 'px';
			this.style.visibility = 'visible';
			//gtn(this, 'div')[1].style.width = (w - 14) + 'px';

			this.capTop = document.createElement('div');
			this.capTop.id = 'capTop';
			this.capTop.className = 'floating';
			getBody().appendChild(this.capTop);
			goOnTop(this.capTop);
			this.style.zIndex = this.capTop.style.zIndex + 1;
            this.btnOK.focus();
		};

        cConfirm.clearFunctions = function() {
            cConfirm.onOK = function() {

            };
            cConfirm.onCancel = function() {

            };
        }

		cConfirm.close = function() {
			getBody().removeChild(this.capTop);
			cConfirm.style.visibility = 'hidden';

            var firstLevel = levelsCap.indexOf(currentForm);
            var nl = levelsCap.length, l;

            for (l = firstLevel; l < nl - 1; l ++) {
                levelsCap[l] = levelsCap[l + 1];
                if (get(levelsCap[l])) get(levelsCap[l]).style.zIndex = l;
            }

            delete managers[currentForm];
            levelsCap.pop();

            currentForm = levelsCap.length > 0 ? get(levelsCap[levelsCap.length - 1]).id : null;
            if (currentForm) goOnTop(currentForm);

            if (cConfirm.caller != null) cConfirm.caller.focus();
            cConfirm.caller = null;
		};

		cConfirm.onCancel = function() {

		};
		cConfirm.onOK = function() {

		};
	}

    /* Fin de cAlert y cConfirm */

    /* Menú */

    var mens = gtn('navMenu', 'span');
    var nm = mens.length, m;
    //alert(nm);
    for (m = 0; m < nm; m ++) {
        var men = mens[m];
        listen(men, 'click', showMenu);
        listen(men, 'mouseover', overMenu);
    }

    document.onclick = function(evt) {
        //alert('jj');
		if (nav) evt = event;
		evt = setEvent(evt);

		var capMen = get('module' + curMen);
		if (evt.target.parentNode.id != 'navMenu' && curMen) {
			if (parseInt(curMen) > 0) {
				capMen.style.visibility = 'hidden';
				get('barTop').style.visibility = 'hidden';
				get('lineTop').style.visibility = 'hidden';
			}
			get('menu' + curMen).removeAttribute('class');
			curMen = 0;
		}
	};

    /* Fin de Menú */

    /* Ventanas flotantes */
    document.onmousemove = function(evt) {
	    if (capFloat) {
	    	if (nav) evt = event;
	        evt = setEvent(evt);

	        var x = evt.clientX;
	        var y = evt.clientY;

	        var pLeft = parseInt(capFloat.style.left);
	        var hDir = (x - xi) - pLeft;

	        //get('divSay').innerHTML = hDir;

	        if (hDir < 0 && pLeft > 10 || hDir > 0 && pLeft + capFloat.offsetWidth + 10 < screen.width) capFloat.style.left = (x - xi) + 'px';
	        capFloat.style.top = (y - yi) + 'px';
	    }
    };
    document.onmouseup = function(evt) {
        if (nav) evt = event;
        leaveCap(evt);
    };
    /* Fin de Ventanas flotantes */

    calDate = new Calendar();
    calDoc = new Calendar();
    calDoc.execAction = function() {
        showTblDocs(calDoc.dats);
    };

    calSch = new Calendar();
    calSch.execAction = function() {
        showTblSchDocs(calSch.dats);
    };

    /* Former */
    Former = new MngForms();
    /* Fin de Former */

    /* Loader Page */

    var lp = 0;

    var pImgs = gtn(document, 'img');
    var np = pImgs.length, p;

    for (p = 0; p < np; p ++) {
        var pImg = pImgs[p];
        /*var src = pImg.src;
        var pl = src.lastIndexOf('/');
        src = src.substr(pl + 1);
        get('say2').innerHTML += src + '<br />';*/
        if (!pImg.complete) listen(pImgs[p], 'load', isPageLoaded);
        else isPageLoaded();
    }

    var dImgs = ['accept.png', 'add.png', 'bottom.gif', 'bottom-over.gif', 'button_cancel.png', 'calendar.png',
                 'cancel.png', 'clear.png', 'code_barr.png', 'coins.png', 'disk.gif', 'error.png', 'exclamation.png', 'exit.gif',
                 'img.gif', 'less.gif', 'loader.gif', 'macclose.gif', 'macclose-over.gif',
                 'macmin.gif', 'macmin-over.gif', 'macrest.gif', 'macrest-over.gif', 'menleft.jpg', 'page_white.png', 'page_white_edit.png',
                 'plus.gif', 'printer.png', 'process.png', 'titafon.jpg', 'titfoff.jpg', 'titfon.jpg', 'titpfon.jpg',
                 'tloader.gif', 'top.gif', 'top-over.gif'];
    var nd = dImgs.length, d;

    for (d = 0; d < nd; d ++) {
        var lImg = new Image();
        lImg.src = 'imgs/' + dImgs[d];
        //get('say2').innerHTML += dImgs[d] + '<br />';
        if (!lImg.complete) listen(lImg, 'load', isPageLoaded);
        else isPageLoaded();
    }

    //get('say2').innerHTML = 'np: ' + np + ', nd: ' + nd;

    function isPageLoaded() {
        lp ++;

        /*if (typeof evt == 'object') {
            src = evt.target.src;
            var pl = src.lastIndexOf('/');
            src = src.substr(pl + 1);
        }else src = evt;

        get('say').innerHTML += src + ', ' + lp + '<br />';*/
        if (lp == np + nd) {

            removeElement('divLoading');
            removeElement('shadow');
        }
    }

    closeSession();
    /* Fin de Loader Page */
}

/* Cierre de Sesión */
var ssa = null;

function closeSession() {
    if (ssa) window.clearTimeout(ssa);
    ssa = window.setTimeout(function() {
        window.location.replace('./?csa');
    }, 1000 * 3600 * 12);
    //console.log('ssa: ' + ssa);
}

/* Fin de Cierre de Sesión

/* Menu */

var curMen = 0;

function showMenu(evt) {
	//alert(obj);
	evt = setEvent(evt);
	var obj = evt.target;
        var modID = obj.id.substr(4);
        //alert(obj);
        //alert(modID);obj
	if (modID != 'cs') obj.className = 'over';
	curMen = modID;

	if (parseInt(modID) > 0) {
		var cap = get('module' + modID);

		var pos = getPos(obj);
                //alert(cap + ' ' + pos)
		var lf = pos.left; // + evt.scrollLeft;
		var tp = pos.top + obj.offsetHeight; // + evt.scrollTop; // + evt.scrollTop;
                //alert(lf + '' + tp);
		cap.style.left = lf + 'px';
		cap.style.top = (tp + 3) + 'px';

		cap.style.visibility = 'visible';

		var capBT = get('barTop');
		capBT.style.width = (obj.offsetWidth - 2) + 'px';
		capBT.style.left = lf + 'px';
		capBT.style.top = tp + 'px';
		capBT.style.visibility = 'visible';

		var capLT = get('lineTop');
		capLT.style.width = (cap.offsetWidth - parseInt(capBT.style.width) - 1) + 'px';
		capLT.style.left = (lf + obj.offsetWidth - 1) + 'px';
		capLT.style.top = (tp + 3) + 'px';
		capLT.style.visibility = 'visible';
	}
}

function overMenu(evt) {
    if (curMen) {
        if (parseInt(curMen) > 0) get('module' + curMen).style.visibility = 'hidden';
        get('menu' + curMen).removeAttribute('class');
        get('barTop').style.visibility = 'hidden';
        get('lineTop').style.visibility = 'hidden';
        showMenu(evt);
    }
}
/* Fin de Menú */

/* Mostrar Programa */
function loading() {
    get('loa').className = 'show';
}

function loaStop() {
    get('loa').className = 'none';
}

var levelsCap = new Array();

function goOnTop(cap) {
    cap = getObj(cap);

    var nl = levelsCap.length, l;
    //say('nl: ' + nl);
    if (nl > 0) {
        var top = getObj(levelsCap[nl - 1]);
        top.className = top.className.replace(' on-top', '');
    }

    var indexCap = levelsCap.indexOf(cap.id);
    if (indexCap == -1) {
        cap.style.zIndex = levelsCap.length;
        levelsCap.push(cap.id);
    } else {
        for (l = indexCap; l < nl - 1; l ++) {
            levelsCap[l] = levelsCap[l + 1];
            get(levelsCap[l]).style.zIndex = l;
        }

        levelsCap[nl - 1] = cap.id;
        cap.style.zIndex = levelsCap.length - 1;
    }

    cap.className += ' on-top';

    currentForm = cap.id;
}

function setCapShowing(obj, opc) {
	obj = getObj(obj);

    if (typeof opc == 'undefined') opc = 'center';

    if (opc == 'center') {
       var w = document.documentElement.clientWidth;
       var h = document.documentElement.clientHeight;

       var wi = obj.offsetWidth;
       var he = obj.offsetHeight;

       var lf = Math.round((w - wi) / 2);
       var tp = Math.round((h - he) / 2);
    }

    obj.style.left = lf + 'px';
    obj.style.top =  tp + 'px';

    //alert("w: " + w + ', h: ' + h + ', wi: ' + wi + ', he: ' + he);
}

function createFloating(id, title, content, icon) {
    var win = document.createElement('section');
    win.id = id;
    //alert(id.substring(6, id.length));
    var id2 = id.substring(6, id.length);
    var estr =  '<h2>' +
                    '<span>' +
                        '<img src="imgs/icons/' + icon + '" />' + title +
                    '</span>' +
                    '<a href="JavaScript:;" class="butt-close" title="Cerrar" onclick="removeElement(this.parentNode.parentNode);"></a>' +
                    '<a href="JavaScript:;" class="butt-mm" title="Minimizar" onclick="minRestCap(this.parentNode.parentNode, this);"></a>' +
                '</h2>' +
                '<article>' +
                    '<div>' +
                        '<img src=\"imgs/information.png\" alt=\"Información\" />' +
                        '<span>Nuevo</span>' +
                    '</div>' +
                    '<dialog>' +
                        '<form name="frmwin'+id2+'" onsubmit="return false">'+content+'</form>' +
                    '</dialog>' +
                '</article>' +
                '<footer></footer>';

    win.innerHTML = estr;
    getBody().appendChild(win);
    //goOnTop(win);
    return win;
}

function loadJSCSS(prgID) {
    var js = document.createElement('script');
    js.id = 'js-' + prgID;
    js.type = 'text/javascript';
    js.src = 'forms/js/' + prgID + '.js?rnd=' + Math.random();

    getHead().appendChild(js);

    var css = document.createElement('link');
    css.id = 'css-' + prgID;
    css.type = "text/css";
    css.rel = "stylesheet";
    css.href = 'forms/css/' + prgID + '.css?rnd=' + Math.random();

    getHead().appendChild(css);
}

function unloadJSCSS(prgID) {
    removeElement('js-' + prgID);
    removeElement('css-' + prgID);
}

function loadTimer() {
    var ljs = null;
    var nfjs = 0;

    this.isLoaded = function(prgID) {
        ljs = window.setInterval("lt.isLoa('" + prgID + "')", 1);
    }
    this.isLoa = function(prgID) {
        //alert(typeof window['frmBegin' + prgID]);
        //if (typeof window['frmBegin' + prgID] === 'function') {
        //alert(prgID);
        //alert(typeof window[prgID] === 'function');

        if (typeof window[prgID] === 'function') {
            window.clearInterval(ljs);
            this.onloaded();
            nfjs = 0;
        } else {
            nfjs ++;

            if (nfjs == 100) {
                var ajax = new Ajax();
                ajax.URL = 'forms/' + prgID + '.html';
                ajax.execGET();
                ajax.onresponse = function() {
                    if (this.ajax.status != 200) {
                        window.clearInterval(ljs);
                        loaStop();
                        nfjs = 0;
                        cAlert.show('Este programa se encuentra en desarrollo', 1);
                    }
                };
            }
        }
    }

    this.onloaded = function() {

    }
}
function loadProgram(prgID, title, icon) {
    if (!get('js-' + prgID)) loadJSCSS(prgID);
    //cambios aki
    //var prgid = prgID.substr(3);
    //cambios aki tmb
    window['win' + prgID] = new mngWin(prgID, title, icon);
}

var lt = new loadTimer();

function showProgram(prgID, title, icon) {
    if(prgID != 'tblIngrCaja' && prgID != 'tblDocTrasCaja' && prgID != 'rptReportesCaja'){
        loadProgram(prgID, title, icon);
        loading();
        lt.onloaded = function() {
            // CAMBIO AKI window['frmBegin' + prgID]();
            window[prgID]();
            //cambio aki la mayuscukla por la minuscula
            //var prgid = prgID.substr(3);
            window['win' + prgID].createWin();
        }
        lt.isLoaded(prgID);
        //ljs = window.setInterval('isLoaded(' + prgID + ')', 1);
    }else{
        if(get('hidCurrentCompany').value == '10'){
            loadProgram(prgID, title, icon);
            loading();
            lt.onloaded = function() {
                window[prgID]();
                window['win' + prgID].createWin();
            }
            lt.isLoaded(prgID);
        }
    }
    
}

function showPrgSystem(prgID,nom,icon){
    //alert(prgID);
    /*loadProgram(prgID,nom,icon);
    loading();
    lt.onloaded = function(){
        window['frmBegin' + prgID]();
        window['win' + prgID].createWin();
    }
    lt.isLoaded(prgID);*/
}

function setNextIn(obj) {
    var eles = gtn(obj, 'input');
    var ne = eles.length, e, x;

    for (e = 0; e < ne; e ++) {
        var ele = eles[e];        
        if (ele.type.toLowerCase() == 'text' && !(ele.type == 'hidden' || ele.readOnly || ele.disabled)) {
            for (x = e + 1; x < ne; x ++) {
                var xEle = eles[x];
                if (!(xEle.type == 'hidden' || xEle.readOnly || xEle.disabled)) {
                    ele.alt = xEle.id;
                    //alert(ele.tagName + ', ' + ele.id + ': ' +  xEle.id);
                    listen(ele, 'keyup', goNext);
                    break;
                }
            }
        }
    }

}
function setNextIn2(obj) {
    var eles = gtn(obj, 'input');
    var ne = eles.length, e, x;

    for (e = 0; e < ne; e ++) {
        var ele = eles[e];
        if (ele.type.toLowerCase() == 'text' && !(ele.type == 'hidden' || ele.readOnly)) {
            for (x = e + 1; x < ne; x ++) {
                var xEle = eles[x];
                if (!(xEle.type == 'hidden')) {
                    ele.alt = xEle.id;
                    //alert(ele.tagName + ', ' + ele.id + ': ' +  xEle.id);

                    listen(ele, 'keyup', goNext);
                    break;
                }
            }
        }
    }

}

function mngWin(prgID, title, icon) {
    //alert(prgID);
    //cambios aki

    /*if(get('frm' + prgID)) prgID = 'frm' + prgID;
    else prgID = 'rpt' + prgID;*/
    //fin cambios

    var eles, firstEle = null;

    var cols = new Array();
    var tc = null;
    var cc = 0, dt = 1;

    this.data = new Object();

    this.createWin = function(parent, addPrms) {
        var ajx = new Ajax();
        ajx.URL = 'forms/' + prgID + '.html';
        ajx.parent = this;

        if (typeof addPrms == 'undefined') addPrms = '';
        //---------------- alert('mngWin= ' + addPrms);
        ajx.execGET(addPrms);
        ajx.onresponse = function() {
            if (ajx.ajax.status == 200) {
                //prgID = prgID.substr(3);
                var win = 'win' + prgID;
		//alert(win);
                if (get(win)) {
                    cap = get(win);
                    gtn(cap, 'form')[0].innerHTML = this.response; // correccion de Evert
                } else {
                    cap = createFloating(win, title, this.response, icon);
                    listen(cap, 'mousedown', setFloating);
                }
                //alert(cap);
                if (window.navigator.userAgent.indexOf('Chrome') != -1 && gtn(cap, 'input').length > 0) gtn(cap, 'dialog')[0].style.width = (gtn(cap, 'h2')[0].offsetWidth - 22) + 'px';
                this.parent.onload();

                var buts = gtn(win, 'button');
                var nb = buts.length, b;

                for (b = 0; b < nb; b ++) buts[b].type = 'button';

                //eles = document['frmwin' + prgID].elements;
                //alert(prgID.substring(3, prgID.length));
                eles = document['frmwin' + prgID.substring(3, prgID.length)].elements;

               //---------------- alert(prgID);
                var ne = eles.length, e;

                for (e = 0; e < ne; e ++) {
                    var ele = eles[e];
                    cls = ele.className;

                    if (cls.indexOf('entero') != -1) {
                        listen(ele, 'keydown', fixEntero);
                        if (ele.maxLength && cls.indexOf('noFill') == -1) listen(ele, 'blur', fixZeros);
                    }	else if (cls.indexOf('decimal') != -1) {
                            listen(ele, 'keydown', decimales);
                            listen(ele, 'blur', fixDecimales);
                    }	else if (cls.indexOf('porcentaje') != -1) listen(ele, 'keydown', porcentaje);

                    if (!(ele.tagName.toLowerCase() == 'fieldset' || ele.tagName.toLowerCase() == 'button' || ele.tagName.toLowerCase() == 'textarea' || ele.type == 'hidden' || ele.readOnly || ele.disabled)) {
                        if (!firstEle) firstEle = ele;

                        for (var x = e + 1; x < ne; x ++) {
                            var xEle = eles[x];
                            if (!(xEle.tagName.toLowerCase() == 'fieldset' || xEle.tagName.toLowerCase() == 'button' || xEle.type == 'hidden' || xEle.readOnly || xEle.disabled)) {
                                ele.alt = xEle.id;
                                //alert(ele.tagName + ', ' + ele.id + ': ' +  xEle.id);

                                listen(ele, 'keyup', goNext);
                                break;
                            }
                        }
                    }
                }

                var tables = gtn(cap, 'table');
                //var table = gtn(cap, 'table')[0];
                var nt = tables.length, t;

                for (t = 0; t < nt; t ++) {
                    var table = tables[t];

                    if (table.className.indexOf('tbl-butts') != -1) {

                        var dats = table.summary.split(',');
                        var nc = toInt(dats[0]);
                        //var nr = toInt(dats[1]);

                        //if (table.className.indexOf('no-order') == -1) {
                            listen(table, 'mousedown', showWholeText);
                            listen(table, 'mouseup', hiddenText);

                            var heaTRs = table.tHead.rows;
                            var heaTR = heaTRs[0];
                            var heads = heaTR.cells;

                            var nh = heads.length, h;
                            nb = toInt(heads[heads.length - 1].colSpan);
                            if (nb == 0) nb = 1;

                            var awidth = table.offsetWidth - 1;
                            //console.log('awidth: ' + awidth);

                            for (h = 0; h < nh; h ++) {
                                var head = heads[h];
                                var w, ia;

                                if (head.hasChildNodes() && head.firstChild.nodeValue) {
                                    if (table.className.indexOf('no-order') == -1) {
                                        var hTxt = document.createTextNode(head.firstChild.nodeValue);
                                        var hLnk = document.createElement('a');
                                        hLnk.href = 'JavaScript:;';
                                        hLnk.title = 'Ordenar por "' + head.firstChild.nodeValue + '"';
                                        hLnk.setAttribute('onclick', 'sortTable(this, ' + h + ');');
                                        hLnk.appendChild(hTxt);
                                        head.replaceChild(hLnk, head.firstChild);
                                    }

                                    w = toInt(head.width);

                                    if (w == 0) ia = h;
                                    else {
                                        insertRule('#' + table.id + ' tbody td:nth-child(' + (nc + nb) + 'n + ' + (h + 1) + ')', 'width: ' + w + 'px');
                                        if (heaTRs.length > 1) {
                                            insertRule('#' + table.id + ' thead td:nth-child(' + (nc + nb) + 'n + ' + (h + 1) + ')', 'width: ' + (w + 8) + 'px');
                                        }
                                        insertRule('#' + table.id + ' tfoot td:nth-child(' + (nc + nb) + 'n + ' + (h + 1) + ')', 'width: ' + (w + 6) + 'px');
                                    }
                                } else {
                                    head.style.width = ((nb * 27) - 8 - nb) + 'px';
                                    w = parseInt(head.style.width) - 1;
                                }

                                //console.log('w: ' + w);
                                if (w > 0) awidth -= w + 11;
                                //console.log('awidth: ' + awidth);
                            }
                            awidth -= 19;
                            //console.log('nb: ' + nb + ', ia: ' + ia);

                            heads[ia].width = (awidth - 10);
                            insertRule('#' + table.id + ' tbody td:nth-child(' + (nc + nb) + 'n + ' + (ia + 1) + ')',('width: ' + (awidth - 10) + 'px'));
                            if (heaTRs.length > 1) {
                                insertRule('#' + table.id + ' thead td:nth-child(' + (nc + nb) + 'n + ' + (ia + 1) + ')', 'width: ' + (awidth - 2) + 'px');
                            }
                            insertRule('#' + table.id + ' tfoot td:nth-child(' + (nc + nb) + 'n + ' + (ia + 1) + ')', 'width: ' + (awidth - 4) + 'px');

                            var th = document.createElement('th');
                            th.innerHTML = '&nbsp;';
                            if (heaTRs.length > 1) {
                                //th.style.height = '40px';
                            }
                            th.width = 6;
                            heaTR.appendChild(th);
                        //}
                        /* if(prgID != 84){
                             fillTable(table)
                        } else {
                         fillTableArt(table);
                        }*/
                        fillTable(table);
                    }



                }
                setCapShowing(cap, 'center');
                goOnTop(cap);
                cap.style.visibility = 'visible';

                var capDis = null;
                if (typeof parent != 'undefined')  {
                    capDis = gtn(parent, 'footer')[0];
                    capDis.className = 'visible';
                }

                if (firstEle) firstEle.focus();
                //alert(this.parent.onshow);

                cap.parent = this.parent;
                cap.onremove = function() {
                    this.parent.onremove();
                    if (capDis != null) capDis.removeAttribute('class');
                }

                this.parent.onshow();
            } else alert('Este programa se encuentra en desarrollo----------');
            loaStop();
        };
    };

    function showWholeText(evt) {
        evt = setEvent(evt);
        var td = evt.target;
        //console.log(td.innerHTML);
        if (td.tagName.toLowerCase() == 'td' && td.className != 'td-butt' && td.parentNode.parentNode.tagName.toLowerCase() == 'tbody') {
            var s = td.offsetWidth;
            td.className = 'whole-text';
            s -= td.offsetWidth;
            if (s < 0) td.style.marginRight = s + 'px';
            else td.removeAttribute('class');
        }
    }

    function hiddenText(evt) {
        evt = setEvent(evt);
        var td = evt.target;
        //console.log(td.innerHTML);
        if (td.tagName.toLowerCase() == 'td' && td.className != 'td-butt' && td.parentNode.parentNode.tagName.toLowerCase() == 'tbody') {
            td.removeAttribute('class');
            td.removeAttribute('style');
            td.marginRight = '0';
        }
    }
    this.onload = function() {

    };

    this.onshow = function() {

    };

    this.clearForm = function(execps) {
        if (typeof execps == 'undefined') execps = '';
        var e;
        for (e = 0; e < eles.length; e ++) {
            var ele = eles[e];
            if (execps.indexOf(ele.id) == -1) {
                var tag = ele.tagName.toLowerCase();
                if (tag == 'input') {
                    var type = ele.type.toLowerCase();

                    if (type == 'text' || type == 'password' || type == 'hidden' || type == 'file') ele.value = '';
                    else if (type == 'checkbox' || type == 'radio') ele.checked = false;
                }else if (tag == 'select') {
                    ele.selectedIndex = 0;
                }	else if (tag == 'textarea') ele.value = '';
            }
        }
        //this.say('Nuevo');
        //firstEle.focus();
    };

    this.setFrmDisabled = function(val, exceps) {
        if (typeof exceps == 'undefined') exceps = '';
        for (e = 0; e < eles.length; e ++) {
            var ele = eles[e];
            if (ele.className.indexOf('no-disabled') == -1 && exceps.indexOf(ele.id) == -1) ele.disabled = val;
        }
    };

    function setAlert(objEle, col1, col2) {
        objEle = getObj(objEle);

        var t = 10;
        var d = 50;

        var red1 = hex2dec(col1.substr(0, 2));
        var green1 = hex2dec(col1.substr(2, 2));
        var blue1 = hex2dec(col1.substr(4, 2));

        var red2 = hex2dec(col2.substr(0, 2));
        var green2 = hex2dec(col2.substr(2, 2));
        var blue2 = hex2dec(col2.substr(4, 2));

        var dRed = (red2 - red1) / d;
        var dGreen = (green2 - green1) / d;
        var dBlue = (blue2 - blue1) / d;

        for (var c = 0; c < d; c ++) {
            cols[c] = dec2hex(red1 + dRed * c) + dec2hex(green1 + dGreen * c) + dec2hex(blue1 + dBlue * c);
        }
        window.clearInterval(tc);
        tc = window.setInterval(function() {setColor(objEle);}, t);
    }

    function setColor(objEle) {
        objEle.style.backgroundColor = '#' + cols[cc];
        //alert(cols[cc]);

        cc += dt;

        if (cc == cols.length - 1) dt = -1;
        if (dt == -1 && cc == 0) {
            window.clearInterval(tc);
            dt = 1;
        }
    }

    this.say = function(msg, opc) {
        var spnSay = gtn('win' + prgID, 'span')[1];
        spnSay.innerHTML = msg;

        if (opc == 'loading') {
            img = 'tloader.gif';
                spnSay.removeAttribute('class');
        }else if (opc == 'error') {
            img = 'exclamation.png';
            spnSay.className = 'red';
            setAlert(spnSay.parentNode, 'ECECEC', 'FFFFB5');
        }else if (!opc || icon == 'info') {
            img = 'information.png';
            spnSay.removeAttribute('class');
            setAlert(spnSay.parentNode, 'ECECEC', 'FFFFB5');
        }	else {
            img = 'information.png';
            spnSay.removeAttribute('class');
            setAlert(spnSay.parentNode, 'ECECEC', 'FFFFB5');
        }
        var ima = gtn('win' + prgID, 'img')[1];
        ima.src = 'imgs/' + img;
    };

    this.loaProgram = function(msg, nod) {
        if (typeof nod == 'undefined') this.setFrmDisabled(true);
        this.say(msg, 'loading');
    };

    this.stopLoading = function(msg, opc, nod) {
        if (typeof nod == 'undefined') this.setFrmDisabled(false);
        if (opc == 'loading') opc = '';
        this.say(msg, opc);
    };

    this.showPopup = function(idpp, inp, title, method, heaFields, fields, putFunc, putFields, nf, mParams) {
        showPopup(prgID, idpp, inp, title, method, heaFields, fields, putFunc, putFields, nf, mParams);
    };

    this.showFinderDocs = function(idpp, inp, method, heaFields, fields, putFunc, putFields, mParams) {

        showFinderDocs(prgID, idpp, inp, method, heaFields, fields, putFunc, putFields, mParams);
        //alert(prgID);
        //alert(idpp);
        //alert(inp);
        //alert(method);
        //alert(heaFields);
        //alert(fields);
        //alert(putFunc);
        //alert(putFields);
        //alert(mParams);
    };

    this.showSearcherDocs = function(idpp, inp, method, headFields, fields, putFunc, putFields, searcherField, addParams) {
        showSearcherDocs(prgID, idpp, inp, method, headFields, fields, putFunc, putFields, searcherField, addParams);
    }
    this.showReportHtml = function(report, title, file, ops, ori, html, longDats){
        if (typeof ops == 'undefined' || ops == '') ops = '';
        else ops = '&' + ops;
        if (typeof html == 'undefined') html = '';
        if (typeof longDats == 'undefined') longDats = '';
        if (typeof ori == 'undefined' || ori == '') ori = 0;
        var rParams = 'report='+report+'&title='+escape(escape(title))+'&file='+file+'&orientacion='+ori+ops+'&html='+encodeURIComponent(html)+'&longDats='+encodeURIComponent(longDats);

    }
    this.showReport = function(report, title, file, ops, ori, html, longDats) {
        if (typeof ops == 'undefined' || ops == '') ops = '';
        else ops = '&' + ops;
        if (typeof html == 'undefined') html = '';
        if (typeof longDats == 'undefined') longDats = '';
        if (typeof ori == 'undefined' || ori == '') ori = 0;

        var rParams = 'report='+report+'&title='+escape(escape(title))+'&file='+file+'&orientacion='+ori+ops+'&html='+encodeURIComponent(html)+'&longDats='+encodeURIComponent(longDats);
        //alert(rParams);
        var rptAjax = new Ajax();
        rptAjax.parent = this;
        this.loaProgram('Procesando ...');
        //this.say('Procesando...');
        rptAjax.execPOST(rParams);
        rptAjax.onresponse = function() {
            if (this.response) {
                //alert(this.respomse);
                this.parent.stopLoading('Listo!');
                //this.parent.say('Listo...!!');
                var url = 'report.jsp?report=' + report + '&title=' + escape(title) + '&file='+file + '&rnd='+Math.random();
                window.open(url);
            }else {
                this.parent.stopLoading('No se ha conseguido crear el Reporte', 'error');
               //this.parent.say('No se ha conseguido crear el Reporte','error');
               //this.say('No se ha conseguido crear el Reporte', 'error')
            }
        };
    }

    this.printCBMak = function(arts,colores,art_tipos,art_colores,art_coltal){
        var url = window.location + 'text.jsp';
        var rParams = 'CB=CB&arts=' + arts + '&colores=' + colores + '&tipos=' + art_tipos + '&art_colores=' + art_colores + '&tallas=' + art_coltal;
        var rptAjax = new Ajax();
        rptAjax.parent = this;
        this.loaProgram('Procesando ...');
        rptAjax.execmPOST(rParams);
        rptAjax.onresponse = function(){
            if (this.response) {
                //alert(url);
                //alert(this.response);
                //return false;
                var printer = get('appletPrinter');
                printer.printText(url);
                this.parent.stopLoading('Imprimiendo...!');
                //window.open(url);
            } else {
                this.parent.stopLoading('No se ha detectado ninguna impresora', 'error');
            }
        };
    };

    this.shoPrevioDoc = function(report, title, file, ops, ori, html, longDats) {
        if (typeof ops == 'undefined' || ops == '') ops = '';
        else ops = '&' + ops;
        if (typeof html == 'undefined') html = '';
        if (typeof longDats == 'undefined') longDats = '';
        if (typeof ori == 'undefined' || ori == '') ori = 0;

        var rParams = 'report='+report+'&title='+escape(escape(title))+'&file='+file+'&orientacion='+ori+ops+'&html='+encodeURIComponent(html)+'&longDats='+encodeURIComponent(longDats);
        //alert(rParams);
        var rptAjax = new Ajax();
        rptAjax.parent = this;
        //this.loaProgram('Procesando ...');
        this.say('Procesando...');
        rptAjax.execPOST(rParams);
        rptAjax.onresponse = function() {
            if (this.response) {
                //this.parent.stopLoading('Listo!');
                this.parent.say('Listo...!!');
                var url = 'report.jsp?report=' + report + '&title=' + escape(title) + '&file='+file + '&rnd='+Math.random();
                window.open(url);
            }else {
                //this.parent.stopLoading('No se ha conseguido crear el Reporte', 'error');
               this.parent.say('No se ha conseguido crear el Reporte','error');
               //this.say('No se ha conseguido crear el Reporte', 'error')
            }
        };
    }


    this.close = function() {
        removeCap('win' + prgID);
    }

    this.onclose = function() {

    }

    this.onremove = function() {
        unloadJSCSS(prgID);
        window['win' + prgID] = null;

        var firstLevel = levelsCap.indexOf('win' + prgID)
        var nl = levelsCap.length, l;

        for (l = firstLevel; l < nl - 1; l ++) {
            levelsCap[l] = levelsCap[l + 1];
            if (get(levelsCap[l])) get(levelsCap[l]).style.zIndex = l;
        }

        delete managers[currentForm];
        levelsCap.pop();

        currentForm = levelsCap.length > 0 ? levelsCap[levelsCap.length - 1] : null;

        if (currentForm) goOnTop(currentForm);

        //get('say2').innerHTML = 'currentForm: ' + currentForm;

        this.onclose();
    }
}

function show2Popup(prgID, idpp, inp, title, method, heaFields, fields, putFunc, putFields, nf, mParams) {
    showPopup(prgID, idpp, inp, title, method, heaFields, fields, putFunc, putFields, nf, mParams, 1);
}

function showPopup(prgID, idpp, inp, title, method, heaFields, fields, putFunc, putFields, nf, mParams, neo) {
    var ajx = new Ajax();
    ajx.parent = this;

    /*var isForm = false;
    if (isNaN(prgID)) isForm = true;*/
    var isForm = false;
    if (!isNaN(prgID)) isForm = true;

    heaFields = heaFields.replace(/, /g, ',');
    fields = fields.replace(/, /g, ',');
    putFields = putFields.replace(/, /g, ',');

    if (typeof mParams == 'undefined') mParams = '';
    if (typeof neo == 'undefined') neo = '';

    var tSnd = 'getPopup='+idpp+'&title='+encodeURIComponent(title)+'&method='+method+'&mParams='+mParams+
               '&heaFields='+heaFields+'&fields='+fields+'&putFunc='+putFunc+'&putFields='+putFields+'&nf='+nf+'&neo='+neo;
   // alert(mParams);
   //alert(prgID);
    var manager = managers[prgID];
    if (isForm) manager.loading('Procesando');
    else window['win' + prgID].loaProgram('Procesando ...');
    ajx.execPOST(tSnd);
    ajx.onresponse = function() {
        var capDis;

        if (isForm) capDis = gtn(prgID, 'footer')[0];
        else capDis = gtn('win' + prgID, 'footer')[0];
        capDis.className = 'visible';

        inp = getObj(inp);
        var cap;

        if (get(idpp)) cap = get(idpp);
        else {
            cap = document.createElement('section');
            cap.className = 'sct-popup';
            cap.id = idpp;

            var pos = getPos(inp);

            cap.style.left = (pos.left + inp.offsetWidth + 5) + 'px';
            cap.style.top = pos.top + 'px';

            getBody().appendChild(cap);
            cap.style.visibility = 'visible';
        }

        cap.innerHTML = this.response;

        if (isForm) {
            displayTable(gtn(cap, 'table')[0]);

            manager.stopLoading('Listo!');
        } else {
            var thsHead = gtn(cap, 'tr')[0].cells;
            var nt = thsHead.length, t;

            for (t = 0; t < nt; t ++) {
                var th = thsHead[t];
                th.style.width = (th.offsetWidth - 10) + 'px';
            }

            fillTable(gtn(cap, 'table')[0]);

            window['win' + prgID].stopLoading('Listo!');
        }

        var oldManager = manager;

        goOnTop(cap);

        managers[idpp] = oldManager;

        //managers[idpp].formManager = oldFormManager;

        cap.onremove = function() {
            capDis.removeAttribute('class');

            var firstLevel = levelsCap.indexOf(currentForm);
            var nl = levelsCap.length, l;

            for (l = firstLevel; l < nl - 1; l ++) {
                levelsCap[l] = levelsCap[l + 1];
                if (get(levelsCap[l])) get(levelsCap[l]).style.zIndex = l;
            }

            delete managers[currentForm];
            levelsCap.pop();

            currentForm = levelsCap.length > 0 ? get(levelsCap[levelsCap.length - 1]).id : null;
            if (currentForm) goOnTop(currentForm);

            inp.focus();
        };

        gtn(cap, 'input')[0].focus();
    };
}

function  showFinderDocs(prgID, idpp, inp, method, heaFields, fields, putFunc, putFields, mParams) {
    //alert(prgID);
    //alert(idpp);
    //alert(inp);
    //alert(method);
    var ajx = new Ajax();
    ajx.parent = this;

    heaFields = heaFields.replace(/, /g, ',');
    fields = fields.replace(/, /g, ',');
    putFields = putFields.replace(/, /g, ',');

    if (typeof mParams == 'undefined') mParams = '';

    var tSnd = 'getFinderDocs='+idpp+'&prgID='+prgID+'&method='+method+'&mParams='+encodeURIComponent(mParams)+
               '&heaFields='+heaFields+'&fields='+fields+'&putFunc='+putFunc+'&putFields='+putFields;
    //alert(tSnd);
    window['win' + prgID].loaProgram('Procesando ...');

    ajx.execPOST(tSnd);
    ajx.onresponse = function() {
        inp = getObj(inp);
        var cap;

        if (get(idpp)) cap = get(idpp);
        else {
            cap = document.createElement('section');
            cap.className = 'sct-popup';
            cap.id = idpp;

            var pos = getPos(inp);

            cap.style.left = (pos.left + inp.offsetWidth + 5) + 'px';
            cap.style.top = pos.top + 'px';

            getBody().appendChild(cap);
            cap.style.visibility = 'visible';
        }
        goOnTop(cap);
        cap.innerHTML = this.response;

        var thsHead = gtn(cap, 'tr')[0].cells;
        var nt = thsHead.length, t;

        for (t = 0; t < nt; t ++) {
            var th = thsHead[t];
            th.style.width = (th.offsetWidth - 10) + 'px';
        }

        fillTable('tbl-'+idpp);

        var capDis = gtn('win' + prgID, 'footer')[0];
        capDis.className = 'visible';

        cap.onremove = function() {
            capDis.removeAttribute('class');

            var firstLevel = levelsCap.indexOf(currentForm);
            var nl = levelsCap.length, l;

            for (l = firstLevel; l < nl - 1; l ++) {
                levelsCap[l] = levelsCap[l + 1];
                if (get(levelsCap[l])) get(levelsCap[l]).style.zIndex = l;
            }

            delete managers[currentForm];
            levelsCap.pop();

            currentForm = levelsCap.length > 0 ? get(levelsCap[levelsCap.length - 1]).id : null;
            if (currentForm) goOnTop(currentForm);

            inp.focus();
        }

        window['win' + prgID].stopLoading('Listo!');
    };
}

function showSearcherDocs(form, idpp, inp, method, headFields, fields, putFunc, putFields, searcherField, addParams) {
    var ajx = new Ajax();
    ajx.parent = this;

    headFields = headFields.replace(/, /g, ',');
    fields = fields.replace(/, /g, ',');
    putFields = putFields.replace(/, /g, ',');

    if (typeof addParams == 'undefined') addParams = '';

    var tSnd = 'getSearcherDocs='+idpp+'&form='+form+'&method='+method+'&addParams='+encodeURIComponent(addParams)+
               '&heaFields='+headFields+'&fields='+fields+'&putFunc='+putFunc+'&putFields='+putFields+
               '&searcherField='+searcherField;
    //alert(tSnd);
    var oldManager = managers[form];

    if (!isNaN(form)) oldManager.loading('Procesando ...');
    else window['win' + form].loaProgram('Procesando ...');

    ajx.execPOST(tSnd);
    ajx.onresponse = function() {
        inp = getObj(inp);
        var cap, capDis;

        if (get(idpp)) cap = get(idpp);
        else {
            if (!isNaN(form)) capDis = gtn(form, 'footer')[0];
            else capDis = gtn('win' + form, 'footer')[0];
            capDis.className = 'visible';

            cap = document.createElement('section');
            cap.className = 'sct-popup';
            cap.id = idpp;

            var pos = getPos(inp);

            cap.style.left = (pos.left + inp.offsetWidth + 5) + 'px';
            cap.style.top = pos.top + 'px';

            getBody().appendChild(cap);
            cap.style.visibility = 'visible';
        }

        cap.innerHTML = this.response;

        var spns = gtn(cap, 'span');
        var spnDesde    = spns[1];
        var spnSearcher = spns[3];

        spnDesde.style.width = spnSearcher.offsetWidth + 'px';

        displayTable('tbl-'+idpp);

        if (!isNaN(form)) oldManager.stopLoading('Listo!');
        else window['win' + form].stopLoading('Procesando ...');

        goOnTop(cap);

        managers[idpp] = oldManager;

        cap.onremove = function() {
            capDis.removeAttribute('class');

            var firstLevel = levelsCap.indexOf(currentForm);
            var nl = levelsCap.length, l;

            for (l = firstLevel; l < nl - 1; l ++) {
                levelsCap[l] = levelsCap[l + 1];
                if (get(levelsCap[l])) get(levelsCap[l]).style.zIndex = l;
            }

            delete managers[currentForm];
            levelsCap.pop();

            currentForm = levelsCap.length > 0 ? get(levelsCap[levelsCap.length - 1]).id : null;
            if (currentForm) goOnTop(currentForm);

            inp.focus();
        };
        var inps = gtn(cap, 'input');
        inps[inps.length - 1].focus();
    };
}


function showTblDocs(idpp) {
    var inps = gtn(idpp, 'input');
    var begin = setDate(inps[0].value);
    var ending = setDate(inps[1].value);
    var method = inps[2].value;
    var mParams = inps[3].value;
    var heaFields = inps[4].value;
    var fields = inps[5].value;
    var putFunc = inps[6].value;
    var putFields = inps[7].value;
    var prgID = inps[8].value;

    var ajx = new Ajax();
    ajx.parent = this;

    var tSnd = 'getTblDocs='+method+'&mParams='+mParams+'&heaFields='+heaFields+
              '&fields='+fields+'&putFunc='+putFunc+'&putFields='+putFields+
              '&begin='+begin+'&ending='+ending;

    window['win' + prgID].loaProgram('Procesando ...');

    ajx.execPOST(tSnd);
    ajx.onresponse = function() {
        fillTable('tbl-'+idpp, this.response);

        window['win' + prgID].stopLoading('Listo!');
    };
}

function showTblSchDocs(idpp) {
    var inps = gtn(idpp, 'input');
    var begin       = setDate(inps[0].value);
    var ending      = setDate(inps[1].value);
    var method      = inps[2].value;
    var addParams   = inps[3].value;
    var heaFields   = inps[4].value;
    var fields      = inps[5].value;
    var putFunc     = inps[6].value;
    var putFields   = inps[7].value;
    var form        = inps[8].value;
    var sf          = inps[9].value;
    var find        = inps[10].value.toLowerCase();

    var ajx = new Ajax();
    ajx.parent = this;

    var tSnd = 'getTblDocs='+method+'&mParams='+addParams+'&heaFields='+heaFields+
              '&fields='+fields+'&putFunc='+putFunc+'&putFields='+putFields+
              '&begin='+begin+'&ending='+ending;

    var manager = managers[form];

    if (!isNaN(form)) {
        window['win' + form].loaProgram('Procesando');
    } else manager.loading('Procesando ...');

    ajx.execPOST(tSnd);
    ajx.onresponse = function() {
        coverTable('tbl-'+idpp, this.response);
        searcher(find, 'tbl-'+idpp, sf);

        if (!isNaN(form)) {
            window['win' + form].stopLoading('Listo!');
        } else manager.stopLoading('Listo!');
    };
}

function searchInPopup(evt, idpp, nf) {
    evt = setEvent(evt);

    if (evt.keyCode == 27) {
        removeElement(idpp);
        return false;
    }

    var table = get('tbl-'+idpp);
    var tBod = table.tBodies[0];

    var val = evt.target.value.toLowerCase();

    var trs = tBod.rows;
    var nt = trs.length, t;

    var z = 0;
    var dts = table.summary.split(',');
    var c = dts[0];
    var n = parseInt(dts[1]);
    var m = 0;
    
    for (t = 0; t < nt; t ++) {
        var tr = trs[t];
        var td = tr.cells[nf];
        var tdVal = getNodeValue(td);

        if (tdVal && tdVal.toLowerCase().indexOf(val) == -1) tr.className = 'none';
        else {
            //tr.removeAttribute('class');
            tr.className = 'row-' + (z % 2);
            z ++;
            m ++;
        }
    }

    var trHea = table.tHead.rows[0];
    var trRows = trHea.cells;
    var i, j;

    var nb = trRows[trRows.length - 2].colSpan;

    if (m <= n) {
        for (i = m; i < n; i ++) {
            tr = document.createElement('tr');
            tr.className = 'row-' + (z % 2);
            z ++;

            for (j = 0; j < c - 1; j ++) {
                td = document.createElement('td');
                //td.colSpan = trRows[j].colSpan;
                td.innerHTML = '&nbsp;';

                tr.appendChild(td);
            }

            for (j = 0; j < nb; j ++) {
                td = document.createElement('td');
                td.innerHTML = '&nbsp;';
                td.className = 'td-butt';

                tr.appendChild(td);
            }
            tBod.appendChild(tr);
        }

        /*if (trHea.cells.length > c) {
            trHea.deleteCell(c);
        }*/
    } else {
        var del = true, nr;
        while (del) {
            nr = tBod.rows.length;
            if (m > n) {
                var td0 = tBod.rows[nr - 1].cells[0];
                var tag = td0.firstChild.tagName ? true : false;

                if (!tag) {
                    tBod.deleteRow(nr - 1);
                    m --;
                } else del = false;
            } else del = false;
        }

        /*if (m > n) {
            if (trHea.cells.length == c) {
                var th = document.createElement('th');
                th.innerHTML = '&nbsp;';
                th.width = 6;
                if (table.tHead.rows.length > 1) th.rowSpan = table.tHead.rows.length;
                trHea.appendChild(th);
            }

            var hc = 21;
            //alert(hc);
            tBod.style.height = ((hc + 1) * n  - 1) + 'px';
        }*/
    }

    if (evt.keyCode == 13 && tBod.title > -1) {
        var func = gtn(tBod.rows[tBod.title], 'a')[0].onclick.toString();
        var pi = func.indexOf('{') + 1;
        var pf = func.indexOf(')', pi);

        func = func.substr(pi, pf - pi + 1).trim();
        eval(func);
    }

    if (evt.keyCode == 40 || evt.keyCode == 38) {
        var trSel = parseInt(tBod.title);
        var sTR = null;

        if (trSel > -1 && trSel < tBod.rows.length) gtn(tBod.rows[trSel], 'a')[0].removeAttribute('class');

        do {
            sTR = null;

            if (evt.keyCode == 40) {
                if (trSel < tBod.rows.length - 1) trSel ++;
            } else {
                if (trSel > -1) trSel --;
            }

            if (trSel > -1 && trSel < tBod.rows.length) {
                sTR = tBod.rows[trSel];
            } else {
                if (trSel < tBod.rows.length) tBod.title = trSel;
                if (trSel > -1) gtn(tBod.rows[toInt(tBod.title)], 'a')[0].className = 'over';
                return false;
            }
            if (typeof sTR == 'undefined' || sTR == null) break;
            if (gtn(sTR, 'a').length == 0) {
                trSel --;
                break;
            }
        } while (!(trSel > - 1 && (!sTR.className || sTR.className.indexOf('row-') != -1)));
        //alert(trSel);
        if (trSel > -1 && trSel < tBod.rows.length) {
            gtn(tBod.rows[trSel], 'a')[0].className = 'over';

            var nScroll = Math.round(tBod.scrollTop / 22);

            if (trSel < nScroll || trSel + 1 > nScroll + n) {
                if (evt.keyCode == 40 && trSel > - 1) {
                    tBod.scrollTop = (trSel + 1 - n) * 22;
                }

                if (evt.keyCode == 38 && trSel < tBod.rows.length - n) {
                    tBod.scrollTop = trSel * 22;
                }
            }
        }

        tBod.title = trSel;
    }else {
        if (tBod.title != '' && toInt(tBod.title) > -1 && evt.keyCode != 37 && evt.keyCode != 39) {
            var lnks = gtn(tBod.rows[tBod.title], 'a');
            if (tBod.title > -1) lnks[0].removeAttribute('class');
            tBod.title = '-1';
        }
    }
}

function searchInTable(val, table, nf) {
    val = val.toLowerCase();
    table = getObj(table);
    var bod = table.tBodies[0];

    var z = 0;
    var dats = table.summary.split(',');
    var c = parseInt(dats[0], 10);
    var b = parseInt(dats[1], 10);
    var n = parseInt(dats[2], 10);

    var trs = bod.rows;
    var nt = trs.length, t;
    var m = 0;

    var tr0 = null;

    for (t = 0; t < nt; t ++) {
        var tr = trs[t];

        if (getNodeValue(tr.cells[nf]).toLowerCase().indexOf(val) == -1) tr.className = 'none';
        else {
            if (!tr0) tr0 = tr;
            //tr.removeAttribute('class');
            tr.className = 'row-' + (z % 2);
            z ++;
            m ++;
        }
    }

    if (m < n) {
        var r, s;
        for (r = 0; r < n - m; r ++) {
            var ntr = document.createElement('tr');
            ntr.className = 'row-' + (z % 2);
            z ++;
            for (s = 0; s < c + b; s ++) {
                var ntd = document.createElement('td');
                ntr.appendChild(ntd);
            }

            if (!tr0) tr0 = ntr;
            bod.appendChild(ntr);
        }
    } else {
        trs = bod.rows;
        nt = trs.length;

        for (t = nt - 1; t >= n; t --) {
            tr = trs[t];
            var td0 = tr.cells[0];
            if (getNodeValue(td0).length == 0) removeElement(tr);
        }
    }

    var tds0 = tr0.cells;
    if (!tds0[0].style.width) {
        var ths = table.tHead.rows[0].cells;

        for (t = 0; t < c; t ++) {
            var th = ths[t];
            var td = tds0[t];

            var hp = 2 * parseInt(getStyle(th, 'padding-left'), 10);
            var bp = 2 * parseInt(getStyle(td, 'padding-left'), 10);

            td.style.width = (parseInt(th.style.width, 10) + hp - bp) + 'px';
        }
    }
}


function searcher(val, table, nf) {
    val = val.toLowerCase();
    table = getObj(table);

    var z = 0;
    var dats = table.summary.split(',');

    var b = 0, n;
    var c = parseInt(dats[0], 10);
    if (dats.length == 2) {
        n = parseInt(dats[1], 10);
    } else if (dats.length == 3) {
        b = parseInt(dats[1], 10);
        n = parseInt(dats[2], 10);
    }

    var bod = table.tBodies[0];

    var trs = bod.rows;
    var nt = trs.length, t;

    var tr0 = null;

    var m = 0;
    for (t = 0; t < nt; t ++) {
        var tr = trs[t];

        if (getNodeValue(tr.cells[nf]).toLowerCase().indexOf(val) == -1) tr.className = 'none';
        else {
            if (!tr0) tr0 = tr;
            //tr.removeAttribute('class');
            tr.className = 'row-' + (z % 2);
            z ++;
            m ++;
        }
    }

    if (m < n) {
        var r, s;
        for (r = 0; r < n - m; r ++) {
            var ntr = document.createElement('tr');
            ntr.className = 'row-' + (z % 2);
            z ++;
            var ntd;
            for (s = 0; s < c; s ++) {
                ntd = document.createElement('td');
                ntr.appendChild(ntd);
            }

            for (s = 0; s < b; s ++) {
                ntd = document.createElement('td');
                ntd.className = 'td-butt';
                ntr.appendChild(ntd);
            }

            if (!tr0) tr0 = ntr;
            bod.appendChild(ntr);
        }
    } else {
        trs = bod.rows;
        nt = trs.length;

        for (t = nt - 1; t >= n; t --) {
            tr = trs[t];
            var td0 = tr.cells[0];
            if (getNodeValue(td0).length == 0) removeElement(tr);
        }
    }

    var tds0 = tr0.cells;
    if (!tds0[0].style.width) {
        var ths = table.tHead.rows[0].cells;

        for (t = 0; t < c; t ++) {
            var th = ths[t];
            var td = tds0[t];

            var hp = 2 * parseInt(getStyle(th, 'padding-left'), 10);
            var bp = 2 * parseInt(getStyle(td, 'padding-left'), 10);

            td.style.width = (parseInt(th.style.width, 10) + hp - bp) + 'px';
        }
    }

    return n;
}

function searching(evt, idpp, nf) {
    evt = setEvent(evt);

    if (evt.keyCode == 27) {
        removeElement(idpp);
        return false;
    }

    var val = evt.target.value.toLowerCase();

    var table = get('tbl-' + idpp);
    searcher(val, table, nf);

    var dats = table.summary.split(',');
    var n = parseInt(dats[1], 10);

    var bod = table.tBodies[0];
    //say('m: ' + m + ', n: ' + n);

    if (evt.keyCode == 13 && bod.lang > -1) {
        var func = gtn(bod.rows[bod.lang], 'a')[0].onclick.toString();
        var pi = func.indexOf('{') + 1;
        var pf = func.indexOf(')', pi);

        func = func.substr(pi, pf - pi + 1).trim();
        eval(func);
    }

    if (evt.keyCode == 40 || evt.keyCode == 38) {
        var trSel = parseInt(bod.lang);
        var sTR = null;

        if (trSel > -1 && trSel < bod.rows.length) gtn(bod.rows[trSel], 'a')[0].removeAttribute('class');

        do {
            sTR = null;

            if (evt.keyCode == 40) {
                if (trSel < bod.rows.length - 1) trSel ++;
            }else {
                if (trSel > -1) trSel --;
            }

            if (trSel > -1 && trSel < bod.rows.length) {
                sTR = bod.rows[trSel];
            } else {
                if (trSel < bod.rows.length) bod.lang = trSel;
                if (trSel > -1) gtn(bod.rows[toInt(bod.lang)], 'a')[0].className = 'over';
                return false;
            }
            if (typeof sTR == 'undefined' || sTR == null) break;
            if (gtn(sTR, 'a').length == 0) {
                trSel --;
                break;
            }
        }while (!(trSel > - 1 && !sTR.className));
        //alert(trSel);
        if (trSel > -1 && trSel < bod.rows.length) {
            gtn(bod.rows[trSel], 'a')[0].className = 'over';

            var nScroll = Math.round(bod.scrollTop / 22);
            //get('say2').innerHTML = "trSel: " + trSel + "<br />ns: " + nScroll+"<br />n: " + n;

            if (trSel < nScroll || trSel + 1 > nScroll + n) {
                if (evt.keyCode == 40 && trSel > - 1) {
                    bod.scrollTop = (trSel + 1 - n) * 22;
                }

                if (evt.keyCode == 38 && trSel < bod.rows.length - n) {
                    bod.scrollTop = trSel * 22;
                }
            }
        }

        bod.lang = trSel;
    } else {
        if (bod.lang != '' && toInt(bod.lang) > -1 && evt.keyCode != 37 && evt.keyCode != 39) {
            var lnks = gtn(bod.rows[bod.lang], 'a');
            if (bod.lang > -1) lnks[0].removeAttribute('class');
            bod.lang = '-1';
        }
    }
}

function minRestCap(cap, lnk) {
	cap = getObj(cap);

	var tit = gtn(cap, 'h2')[0];
	var bod = gtn(cap, 'article')[0];

	if (bod.className == 'none') {
		bod.removeAttribute('class');
		lnk.className = 'butt-mm';
		lnk.title = 'Minimizar';
		tit.style.width = '100%';
		goOnTop(cap);
	}	else {
		bod.className = 'none';
		lnk.className = 'butt-rest';
		lnk.title = 'Restaurar';

		if (!nav) tit.style.width = 'auto';
	}
}

function goNext(evt) {
    evt = setEvent(evt);
    //alert(evt.target.alt);
    //evt.type.toLowerCase() == 'text'
    //alert(evt.innerHTML);
    //alert(typeof get(evt.target.alt).select);
    if (evt.keyCode == 13 && evt.target.alt) {
        get(evt.target.alt).focus();
        if (typeof get(evt.target.alt).select == 'function') get(evt.target.alt).select();
    }
}
/* Fin de Mostrar Programa */

/* Filtros */

function posCursor(obj) {
	obj = getObj(obj);

    var cursor = -1;

    if (document.selection && (document.selection != 'undefined')) {
         var _range = document.selection.createRange();
         var contador = 0;
         while (_range.move('character', -1)) contador ++;
         cursor = contador;
    } else if (obj.selectionStart >= 0) cursor = obj.selectionStart;

    return cursor;
}

function fixEntero(evt) {
    //akert('fix');
    evt = setEvent(evt);

    if (evt.shiftKey) {
    	evt.preventDefault();
    	return false;
    }

    var key = evt.keyCode;

    //alert(key);
    if (!((key > 47 && key < 58) || (key > 95 && key < 106) || key == 8 || key == 9 || key == 13 || key == 35 || key == 36 || key == 37 || key == 39 || key == 46)) {
       evt.preventDefault();
    }
}

function onlyString(evt) {
    var key = evt.keyCode
    if (key == 124) evt.preventDefault();
}

function decimales(evt) {
    evt = setEvent(evt);
    var cls = evt.target.className;

    var pi = cls.indexOf("decimal") + 7;
    var pf = cls.indexOf(" ", pi);

    if (pf != -1) n = cls.substr(pi, pf - pi);
    else n = cls.substr(pi);
    //alert(n);
    decimal(evt, n);
}

function decimal(evt, n) {
    evt = setEvent(evt);

    if (evt.shiftKey) {
    	evt.preventDefault();
    	return false;
    }

    var key = evt.keyCode;

    if ((key > 47 && key < 58) || (key > 95 && key < 106) || key == 8 || key == 9 || key == 13 || key == 35 || key == 36 || key == 37 || key == 39 || key == 46 || key == 110 || key == 190) {
       var obj = evt.target;
       var val = obj.value;

       var pp = val.indexOf(".");

       if (pp != -1) {
          if (key == 110 || key == 190) evt.preventDefault();

          if ((key > 47 && key < 58) || (key > 95 && key < 106)) {
             var pPos = posCursor(obj);

             if (pPos > pp && obj.selectionEnd - obj.selectionStart == 0) {
                var nDec = val.substr(pp + 1).length;
                if (nDec >= n) evt.preventDefault();
             }
          }
       }
    } else evt.preventDefault();
}

function fixDecimal(numero, n) {
	numero = parseFloat(numero);
        //alert(numero);
	if (!isNaN(numero)) {
		numero = Math.round(numero * Math.pow(10, n)) / Math.pow(10, n);

		numero = String(numero);

		var pd = numero.indexOf('.');
		if (pd == -1) numero += '.';

		var dd = numero.split('.');
		var dec = dd[1];
		var nDec = dec.length;

		if (nDec < n) {
			for (var i = 0; i < n - nDec; i ++) dec += '0';
		}	else dec = dec.substr(0, n);

		return dd[0] + '.' + dec;
	}	else return '';
}

function fixDecimales(evt) {
	var obj = setEvent(evt).target;
	var cls = obj.className;
	var pi = cls.indexOf('decimal');
	var n = cls.substr(pi + 7, 1);

	obj.value = fixDecimal(obj.value, n);
}
function fixZeros(evt) {
	var obj = setEvent(evt).target;
	var val = obj.value;

	if (val) {
		var n = obj.maxLength;

		obj.value = fillZeros(val, n);
	}
}
function fillZeros(val, length) {
	var f = length - new String(val).length;

	for (var c = 0; c < f; c ++) val = "0" + val;

	return val;
}
function porcentaje(evt) {
     evt = setEvent(evt);

     var n = 2;

     var key = evt.keyCode;

     if ((key > 47 && key < 58) || (key > 95 && key < 106) || key == 8 || key == 9 || key == 13 || key == 35 || key == 36 || key == 37 || key == 39 || key == 46 || key == 110 || key == 190) {
        var obj = evt.target;
        var val = obj.value;

        var pp = val.indexOf('.');

        if ((key > 47 && key < 58) || (key > 95 && key < 106)) {

           var pPos = posCursor(obj);

           if (key > 47 && key < 58) chr = String.fromCharCode(key);
           else chr = String.fromCharCode(key - 48);

           var arrVal = val.split('');
           var nArr = arrVal.length;
           for (var i = nArr + 1; i > pPos; i --) {
               arrVal[i] = arrVal[i - 1];
           }
           arrVal[pPos] = chr;

           var tVal = arrVal.join('');
           if (parseFloat(tVal) >= 100) evt.preventDefault();

           if (pp != -1) {

              if (pPos > pp) {
                 var nDec = val.substr(pp + 1).length;
                 if (nDec >= n) evt.preventDefault();
              }
           }
        } else if ((key == 110 || key == 190) && pp != -1) {
           evt.preventDefault();
        }

     } else evt.preventDefault();

}

function descuentos(evt) {
    evt = setEvent(evt);

    if (evt.shiftKey) {
    	evt.preventDefault();
    	return false;
    }

    var key = evt.keyCode;

    if (!((key > 47 && key < 58) || (key > 95 && key < 106) || key == 8 || key == 9 || key == 13 || key == 35 || key == 36 ||
         key == 37 || key == 39 || key == 46 || key == 110 || key == 190 || key == 107)) evt.preventDefault();

     return true;
}

function datting(evt) {
    evt = setEvent(evt);
    var key = evt.keyCode;

    if ((key > 47 && key < 58) || (key > 95 && key < 106) || key == 8 || key == 9 || key == 13 || key == 35 || key == 36 || key == 37 || key == 39 || key == 46 || key == 110 || key == 111 || key == 190) {
        if ((key > 47 && key < 58) || (key > 95 && key < 106) || key == 111) {
            var chr = (key > 47 && key < 58) ? String.fromCharCode(key) : String.fromCharCode(key - 48);
            if (key == 111) chr = '/';

            var pPos = posCursor(evt.target);

            var fec = evt.target.value;
            if ((key == 111 && [2, 5].indexOf(pPos) != -1) || key != 111) {
                if (pPos == 0 && chr == 3) fec = '30' + fec.substr(2);
                else if (pPos == 3 && chr == 1) fec = fec.substr(0, 3) + '10' + fec.substr(5);
                else {
                    fec = fec.substr(0, pPos) + chr + fec.substr(pPos + 1);
                }

                var fcs = fec.split('/');
                var anio = parseInt(fcs[2], 10);

                var mes  = parseInt(fcs[1], 10);

                if (mes >= 1 && mes <= 12) {
                    var dia  = parseInt(fcs[0], 10);

                    var dm = 31;
                    if (mes == 2) {
                        if (anio % 4 == 0 && anio % 400 > 0) dm = 29;
                        else dm = 28;
                    } else if ([4, 6, 9, 11].indexOf(mes) != -1) dm = 30

                    if (dia > 0 && dia <= dm) {
                        evt.target.value = fec;

                        if ([1, 4].indexOf(pPos) != -1) pPos ++;
                        evt.target.setSelectionRange(pPos + 1, pPos + 1);
                    }
                }
            }
        }
    }
}

/* Fin de Filtros */

/* Tablas */

function orderTable(a, b, h, ord) {
    var aCell = a.cells[h];
    var bCell = b.cells[h];

	var fieldA = aCell.hasChildNodes() ? aCell.firstChild.nodeValue.trim() : '';
	var fieldB = bCell.hasChildNodes() ? bCell.firstChild.nodeValue.trim() : '';

    if (fieldB == '') return -1;
    else {
        if (ord == 'order') return fieldA.localeCompare(fieldB);
        else if (ord == 'rorder') return fieldB.localeCompare(fieldA);
        else return null;
    }
}

function sortTable(lnk, h) {
	var head = lnk.parentNode.parentNode.parentNode;
	var table = head.parentNode;

	var tBody = table.tBodies[0];
	var trs = tBody.rows;
	var nt = trs.length, t;

	var th = lnk.parentNode;
	var order = (th.className == 'order') ? 'rorder' : 'order';

	var rows = Array.prototype.slice.call(trs);

	rows.sort(function(a, b) {return orderTable(a, b, h, order);});

	for (t = nt - 1; t >= 0; t --) {
            tBody.deleteRow(t);
	}

	var z = 0;
	for (t = 0; t < nt; t ++) {
            var row = rows[t];
            if (row.className != 'none') {
                row.className = 'row-' + (z % 2);
                z ++;
            }
            tBody.appendChild(row);
	}

	if (head.className) {
		var hp = head.className.split('-')[1];
		head.rows[0].cells[hp].className = '';
	}

	th.className = order;

	head.className = 'o-' + h;
}

function fill2Table(table, rows) {
    table = getObj(table);
    var dats = table.summary.split(',');
    var c = dats[0];
    var n = dats[1];

    var rHea = table.tHead.rows[0];
    var tHeads = rHea.cells;
    var tBod = table.tBodies[0];
    //alert(table.id + ', ' + rows);
    if (typeof rows != 'undefined') tBod.innerHTML = rows;
    var m = tBod.rows.length, i, j;
    var nc = tHeads.length;

   /* if (m <= n) {
        for (i = m; i < n; i ++) {
            var tr = document.createElement('tr');

            for (j = 0; j < c; j ++) {
                var td = document.createElement('td');
                if (tHeads[j].colSpan > 1) td.colSpan = tHeads[j].colSpan;
                td.innerHTML = '&nbsp;';

                tr.appendChild(td);
            }

            tBod.appendChild(tr);
        }
        if (nc > c) {
            rHea.deleteCell(c);
        }

        tBod.removeAttribute('style');
    } else {
        if (nc == c) {
            var th = document.createElement('th');
            //th.className = 'void';
            th.innerHTML = '&nbsp;';
            th.width = 6;
            if (table.tHead.rows.length > 1) th.rowSpan = table.tHead.rows.length;
            rHea.appendChild(th);
        }*/

        //var hc = tBod.rows[0].cells[0].offsetHeight;
        var hc;
        if (table.className.indexOf('tbl-butts') != -1) hc = 26;
        else hc = 21;
        //alert(hc);

        tBod.style.height = ((hc + 1) * n  - 1) + 'px';
    //}
}
function fillTableArt(table, rowsbody, rowsfoot){
   table = getObj(table);
   var tBod = table.tBodies[0];
   var tFoot = table.tFoot;
   var ttBod = table.tBodies[0];
   if (typeof rowsbody != 'undefined') tBod.innerHTML = rowsbody; 
   if (typeof rowsfoot != 'undefined') tFoot.innerHTML = rowsfoot;

   //AGREGANDO BARRA
    var dats = table.summary.split(',');
    var c = dats[0];
    var n = dats[1];
    var rHea = table.tHead.rows[0];
    var tHeads = rHea.cells;

    var nb = tHeads[tHeads.length - 2].colSpan;

    var m = ttBod.rows.length, i, j;
    var nc = tHeads.length;
      if (m <= n) {
        for (i = m; i < n; i ++) {
            var tr = document.createElement('tr');
            var td;

            for (j = 0; j < c - 1; j ++) {
                td = document.createElement('td');

                tr.appendChild(td);
            }

            for (j = 0; j < nb; j ++) {
                td = document.createElement('td');
                td.className = 'td-butt';
                tr.appendChild(td);
            }

            ttBod.appendChild(tr);
        }
        /*if (nc > c) {
            rHea.deleteCell(c);
        }*/

        //tBod.removeAttribute('style');
    } else {
        /*if (nc == c) {
            var th = document.createElement('th');
            //th.className = 'void';
            th.innerHTML = '&nbsp;';
            th.width = 6;
            if (table.tHead.rows.length > 1) th.rowSpan = table.tHead.rows.length;
            rHea.appendChild(th);
        }*/

        //var hc = tBod.rows[0].cells[0].offsetHeight;
        var hc;
        if (table.className.indexOf('tbl-butts') != -1) hc = 26;
        else hc = 21;
        //alert(hc);

        ttBod.style.height = ((hc + 1) * n  - 1) + 'px';
        //tBod.style.height = ((hc + 1) * n ) + 'px';
    }
}

function fillTable(table, rows) {
    table = getObj(table);
    var dats = table.summary.split(',');

    var c = dats[0];
    var n = dats[1];

    var rHea = table.tHead.rows[0];
    var tHeads = rHea.cells;
    var tBod = table.tBodies[0];

    var nb = tHeads[tHeads.length - 2].colSpan;
    //console.log('nb: ' + nb);
    //alert(table.id + ', ' + rows);
   // alert(rHea);
    //alert(tHeads);
    //alert(tBod);
    if (typeof rows != 'undefined') tBod.innerHTML = rows;

    var m = tBod.rows.length, i, j;
    var nc = tHeads.length;

    if (m <= n) {
        for (i = m; i < n; i ++) {
            var tr = document.createElement('tr');
            var td;
            for (j = 0; j < c - 1; j ++) {
                td = document.createElement('td');
                //td.innerHTML = '';
                tr.appendChild(td);
            }
            for (j = 0; j < nb; j ++) {
                //console.log('j: '+j);
                td = document.createElement('td');
                //td.innerHTML = '';
                td.className = 'td-butt';
                tr.appendChild(td);
            }

            tBod.appendChild(tr);
        }
        if (nc > c) {
            //rHea.deleteCell(c);
        }

        //tBod.removeAttribute('style');
    } else {
        /*if (nc == c) {
            var th = document.createElement('th');
            //th.className = 'void';
            th.innerHTML = '&nbsp;';
            th.width = 6;
            if (table.tHead.rows.length > 1) th.rowSpan = table.tHead.rows.length;
            rHea.appendChild(th);
        }*/

        //var hc = tBod.rows[0].cells[0].offsetHeight;
        var hc;
        if (table.className.indexOf('tbl-butts') != -1) hc = 26;
        else hc = 21;
        //alert(hc);

        tBod.style.height = ((hc + 1) * n  - 1) + 'px';
        //tBod.style.height = ((hc + 1) * n ) + 'px';

    }
}


/* Fin de Tablas */


/* Efecto de Alerta */
function dec2hex(dec) {
	var hexs = '0123456789ABCDEF';
	var low = dec % 16;
	var high = (dec - low)/16;
	hex = '' + hexs.charAt(high) + hexs.charAt(low);

	return hex;
}

function hex2dec(hex) {
	return parseInt(hex, 16);
}

/* Fin de Efecto de alert */


/* Ventanas flotantes */

var capFloat = null;
var xi = 0;
var yi = 0;

function setFloating(evt) {
    //alert('--');
    evt = setEvent(evt);
    evt.stopPropagation();

    var objTit = evt.target;
    var tag = objTit.tagName.toLowerCase();

    if (['a', 'button', 'footer'].indexOf(tag) != -1) {
        return false;
    }

    while (objTit.tagName.toLowerCase() != 'section' && objTit.tagName.toLowerCase() != 'h2') {
        objTit = objTit.parentNode;
    }

    if (objTit.tagName.toLowerCase() == 'h2') {
        capFloat = objTit.parentNode;
        //alert(capFloat);

        xi = evt.clientX;
        yi = evt.clientY;

        if (capFloat.style.left) xi -= parseInt(capFloat.style.left);
        if (capFloat.style.top) yi -= parseInt(capFloat.style.top);

        objTit.className = 'moving';

        document.onmousedown = function() {
            return false;
        }
    }

    while (objTit.tagName.toLowerCase() != 'section') {
        objTit = objTit.parentNode;
    }

    if (objTit.tagName.toLowerCase() == 'section') {
        goOnTop(objTit);
    }

    return true;
}

function leaveCap(evt) {
	evt = setEvent(evt);

    var objTit = evt.target;


    while (objTit.tagName.toLowerCase() != "html" && objTit.tagName.toLowerCase() != 'h2') {
        objTit = objTit.parentNode;
    }

	if (objTit.className == 'moving') {
        objTit.removeAttribute('class');
    }

    capFloat = null;

    document.onmousedown = function() {

    }
}

/* Fin de Ventanas flotantes */
function test() {
    var params = 'param=valorEnviado';
    //alert(params);
    printText(null, params);
}

/*function showPPArticulosR(prgID, inp, putFunc, putFields) {
    var headFields = 'Código,Descripción';
    var method     = 'MngArticulos.getPopup';
    var fields     = 'codigo,descripcion';
    var title      = "Buscar Articulos";
   showPopup(prgID, 'ppOcArticulo', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, '');
}*/

/*function showPPClientes(prgID, inp, putFunc, putFields) {
    var headFields = 'Código,Descripción';
    var method     = 'MngClientes.getPopup';
    var fields     = 'clie_id,clie_cliente';
    var title      = "Buscar Clientes";
    showPopup(prgID, 'ppOcClientes', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, '');
}
function showPPTransportistas(prgID, inp, putFunc, putFields,tipo) {
    var headFields = 'Código,Descripción';
    var method     = 'MngClientes.getPopup2';
    var mParams    = 'String=' + tipo;
    var fields     = 'idCliente,cliente';
    var title      = "Buscar Transportistas";
   showPopup(prgID, 'ppOcTransportistas', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, mParams);
}
function showPPClientesProveedores(prgID, inp, putFunc, putFields, tipo) {
    var headFields = 'Código,Descripción';
    var method     = 'MngClientes.getPopup3';
    var mParams     = 'String=' + tipo;
    var fields     = 'idCliente,cliente';
    var title      = "Buscar Clientes";
   showPopup(prgID, 'ppOcClientesProveedores', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, mParams);
}



function showPPPlanCuentas(prgID, inp, putFunc, putFields) {
    var headFields = 'Cuenta,Descripción';
    var method     = 'MngPlanCuentas.getPopup';
    var fields     = 'ctaContable,descripcion';
    var title      = "Buscar Cuentas";

   showPopup(prgID, 'ppCodGPlanCuentas', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, '');
}
function showPPBancos(prgID, inp, putFunc, putFields) {
    var headFields = 'Codigo,Banco';
    var method     = 'MngBancos.getPopup';
    var fields     = 'id,banco';
    var title      = "Buscar Bancos";
   showPopup(prgID, 'ppBancos', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, '');
}
function showPPArtMarcas(prgID, inp, putFunc, putFields,tipo) {
    var headFields = 'Id,Marca';
    var method     = 'MngEstructura.getPopup';
    var mParams    = 'String=' + tipo;
    var fields     = 'id,descripcion';
    var title      = "Marcas";

   showPopup(prgID, 'ppArtMarcas', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, mParams);
}
function showPPArtPrendas(prgID, inp, putFunc, putFields,tipo) {
    var headFields = 'Id,Prenda';
    var method     = 'MngEstructura.getPopup';
    var mParams    = 'String=' + tipo;
    var fields     = 'id,descripcion';
    var title      = "Tipo Prenda";

   showPopup(prgID, 'ppArtPrendas', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, mParams);
}
function showPPArtPrendas(prgID, inp, putFunc, putFields,tipo) {
    var headFields = 'Id,Tela';
    var method     = 'MngEstructura.getPopup';
    var mParams    = 'String=' + tipo;
    var fields     = 'id,descripcion';
    var title      = "Tipo Tela";

   showPopup(prgID, 'ppArtTiposTela', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, mParams);
}
function showPPMoldes(prgID, inp, putFunc, putFields) {
    var headFields = 'Codigo,Descripción';
    var method     = 'MngMoldes.getPopup';
    var fields     = 'idMolde,descripcion';
    var title      = "Buscar Moldes";
   showPopup(prgID, 'ppArtMoldes', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, '');
}
function showPPVendedores(prgID, inp, putFunc, putFields,tipo) {
    var headFields = 'Código,Descripción';
    var method     = 'MngClientes.getPopup2';
    var mParams    = 'String=' + tipo;
    var fields     = 'idCliente,cliente';
    var title      = "Buscar vendedores";

   showPopup(prgID, 'ppFactVendedores', getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, '');
}*/
function DFormat(num, nDec) {
	if (num > 0) {
		var aNum = fixDecimal(num, nDec).split('.');

		num = aNum[0].split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1,');
		num = num.split('').reverse().join('').replace(/^,/, '');

		return num + '.' + aNum[1];
	}	else if (num == 0) return fixDecimal(num, nDec);
	else return '';
}

function recargarApplet(){
    var cont = get('cont-applet');
    cont.innerHTML = '<applet id="appletPrinter" code="printer.IdeasPrinter.class" archive="printer.jar" width="0" height="0"></applet>';
}

function printDoc(win,prms){
    recargarApplet();
    var url = window.location.href + 'text.jsp?' + prms + '&rnd=' + Math.random();
    //alert(url);
    //return false;
    win.say('Detectando impresora ...');
    var printer = get('appletPrinter');

    var resp = printer.printTextFromURL(url);
    if (resp) {
        //printer.corte(3);
        win.say('Imprimiendo');
    } else {
        //alert(prgID);
        win.say('No se ha detectado ninguna impresora', 'error');
    }
    return resp;
}
function printCodBars(win, prms) {
    recargarApplet();
    var url = window.location.href + 'text.jsp?'+prms+'&rnd='+Math.random();   
    //alert(url);
    //return false;
    
    win.loaProgram('Detectando impresora ...');
    var printer = get('appletPrinter');            
    //return false;
    var resp = printer.printTextFromURL(url);    
    if (resp) {
        win.stopLoading('Imprimiendo');
    } else {
        win.stopLoading('No se ha detectado ninguna impresora', 'error');
    }
    return resp;
}

function printCodBarsMak(pForm,method,win) {
    var form = document[pForm];
    form.method = method;
    form.action = "text.jsp";
    form.submit();    
    var url = 'http://localhost:8080/SGVentas/text.jsp';
    win.loaProgram('Detectando impresora ...');
    var printer = get('appletPrinter');
    var resp = printer.printTextFromURL(url);
    if (resp) {
        win.stopLoading('Imprimiendo');
    } else {
        win.stopLoading(prgID, 'No se ha detectado ninguna impresora', 'error');
    }
    return resp;
} 

function printText(win, prms) {
    recargarApplet();
    var url = window.location.href + 'text.jsp?'+prms+'&rnd='+Math.random();
    //win.loaProgram('Detectando impresora ...');
    //alert(url);
    //return false;
    
    var printer = get('appletPrinter');
    //alert(printer);
    //var resp = printer.printTextFromURL(url);
    var resp = printer.printTextFromURL(url);
    if (resp) {
        //win.stopLoading('Imprimiendo');
        /*printer.printText(String.fromCharCode(27)+String.fromCharCode(105));
        esto es para arbal printer.printText(String.fromCharCode(27)+String.fromCharCode(112)+String.fromCharCode(48)+String.fromCharCode(48)+String.fromCharCode(48));*/
        //+'\r\n'+String.fromCharCode(27)+String.fromCharCode(112)+String.fromCharCode(48)+String.fromCharCode(48)+String.fromCharCode(48));
       printer.corte(8);
    } else {
        //win.stopLoading('No se ha detectado ninguna impresora', 'error');
    }
    return resp;
}


function  printTK(win,prms){
    var url = window.open('text.jsp?'+prms+'&rnd='+Math.random());
}

function goNextSave(evt, id){
    evt = setEvent(evt);
    evt.target.alt = '';
    if(evt.keyCode == 13){
        getObj(id).focus();
    }
}
function goTblNextSave(evt, id){
    evt = setEvent(evt);
    if(evt.keyCode == 13 && evt.target.value != ''){
        getObj(id).focus();
    }
}

Array.prototype.unique =  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (this[i] === this[j])
          j = ++i;
      }
      a.push(this[i]);
    }
    return a;
};

function insertRule(selector, rule) {
    var sheet = document.styleSheets[0];

    if (sheet.addRule) {
        sheet.addRule(selector, rule);
    } else {
        sheet.insertRule(selector + ' {' + rule + '}', 0);
    }
}

 /* Former */

var managers = {
    existElement : function(name) {
        var exist = false;
        for (ele in this) {
            if (ele == name ) {
                exist = true;
                break;
            }
        }
        return exist;
    }
};

var currentForm = null;           // ID actual del programa

function MngForms() {
    var mngForm = this;
    this.elements   = new Array();
    this.controls   = new Array();
    this.functions  = new Object();
    this.buttons    = new Object();
    this.disableds  = new Object();
    this.firstControl = null;

    this.msgNew = 'Nuevo';

    this.colors = new Array();
    this.tc = null;
    this.cc = 0;
    this.dt = 1;

    this.tt = null;
    this.ss = 0;

    this.showForm = function(prgID, title, icon, form, addParams, parent) {
        //alert('e: ' + managers.existElement(form) + ': ' + managers[form]);
        if (!managers.existElement(form)) {
            var mForm = new Object();
            mForm.prgID     = prgID;
            mForm.title     = title;
            mForm.icon      = icon;
            mForm.formName  = form;
            mForm.addParams = addParams;
            mForm.parent    = parent;

            var mngClass    = new MngForms();

            mngClass.form   = mForm;

            managers[form]  = mngClass;
        }
        currentForm = form;
        var manager = managers[form];

        loadJSCSS(form);
        manager.tt = window.setInterval(manager.isLoaded, 1);
    };

    this.showChild = function(title, icon, form, addParams) {
        var manager = managers[currentForm];
        manager.loading('Procesando ...');

        manager.showForm(0, title, icon, form, addParams, manager.form.formName);
    };

    this.isLoaded = function() {
        var manager = managers[currentForm];

        //alert(typeof window[currentForm]);

        if (typeof window[currentForm] === 'function') {
            var cmd = 'manager.formManager = ' + 'new ' + manager.form.formName + '();';
            //get('say').innerHTML = cmd;
            eval(cmd);
            manager.formManager.manager = manager;
            managers[currentForm] = manager;

            window.clearInterval(manager.tt);

            //alert('gsdfg',currentForm);

            manager.loaded();
            manager.ss = 0;
        } else {
            manager.ss ++;

            if (manager.ss == 100) {
                var ajax = new Ajax();
                ajax.URL = 'forms/' + currentForm + '.html';
                //get('say').innerHTML += ajax.URL + '<br />';
                ajax.execGET();
                ajax.onresponse = function() {
                    if (this.ajax.status != 200) {
                        window.clearInterval(manager.tt);
                        loaStop();
                        manager.ss = 0;
                        cAlert.show('Este programa se encuentra en desarrollo', 1);
                    }
                };
            }
        }
    };

    this.loaded = function() {
        var manager = managers[currentForm];

        var ajx = new Ajax();
        ajx.URL = 'forms/' + manager.form.formName + '.html';
        //alert(ajx.URL);
        var addParams = manager.form.addParams;
        //alert(typeof addParams)
        if (typeof addParams == 'undefined') addParams = '';

        ajx.execGET(addParams);
        ajx.onresponse = function() {
            if (ajx.ajax.status == 200) {
                var currForm = manager.form.formName;
                var capDis = null;

                if (typeof manager.form.parent != 'undefined') {
                    capDis = gtn(manager.form.parent, 'footer')[0];
                    capDis.className = 'visible';
                }

                var cap;
                if (get(currForm)) cap = get(currForm);
                else {
                    createFloating(currForm, manager.form.title, this.response, manager.form.icon);
                    cap = get(currForm);
                    listen(cap, 'mousedown', setFloating);
                }

                if (typeof manager.form.parent != 'undefined') {
                    managers[manager.form.parent].stopLoading('Listo!');
                }

                var formManager = manager.formManager;

                var tables = gtn(currentForm, 'table');

                var nt = tables.length, t;

                for (t = 0; t < nt; t ++) {
                    var table = tables[t];

                    var dats = table.summary.split(',');

                    var c = parseInt(dats[0]);
                    var b = parseInt(dats[1]);
                    var n = parseInt(dats[2]);

                    if (table.className.indexOf('tbl-butts') != -1) {
                        var hRow = table.tHead.rows[0];

                        var ths = hRow.cells;
                        var nh = ths.length, h;

                        var thScl = document.createElement('th');
                        thScl.className = 'th-scl';
                        hRow.appendChild(thScl);

                        var tblWidth = table.width ? parseInt(table.width, 10) : table.offsetWidth;
                        //alert(tblWidth);

                        var widths = new Array();

                        var padl = parseInt(getStyle(ths[0], 'padding-left'));
                        var padd = 2 * padl;

                        for (h = 0; h < nh; h ++) {
                            var th = ths[h];

                            if (h < c) {
                                var hLbl = th.innerHTML.toString().trim();

                                var tLnk = document.createElement('a');
                                tLnk.href = 'JavaScript:;';
                                tLnk.title = 'Ordenar por "' + hLbl + '"';
                                tLnk.setAttribute('onclick', 'sortTable(this, ' + h + ');');
                                var hTxt = document.createTextNode(hLbl);
                                tLnk.appendChild(hTxt);
                                th.innerHTML = '';
                                th.appendChild(tLnk);
                            }

                            if (th.width > 0) widths[h] = parseInt(th.width) + padd;
                            else if (th.className == 'th-butts') widths[h] = b * ((b - 1) * padl + 17) - 1 + padd;
                            else widths[h] = 0;
                        }
                        widths.push(16);

                        var nw = widths.length, w, dw, tw = 0;
                        for (w = 0; w < nw; w ++) {
                            tw += widths[w];
                            if (widths[w] == 0) dw = w;
                        }

                        var rw = tblWidth - tw - (c + b + 1);
                        widths[dw] = rw;
                        //alert(rw);

                        for (w = 0; w < nw - 1; w ++) {
                            th = ths[w];
                            th.style.width = (widths[w] - padd) + 'px';
                            th.removeAttribute('width');
                        }
                        table.className += ' tbl-scrolled'
                        coverTable(table);
                        //fixTable(table);

                        var slr = '#' + table.id + ' tbody';
                        //var stl = 'height: ' + (n * (table.tBodies[0].rows[0].cells[0].offsetHeight + 1) + 1) + 'px';
                        var stl = 'height: ' + (n * (26 + 1) + 1) + 'px';
                        insertRule(slr, stl);
                    }



                }

                setCapShowing(cap, 'center');

                var dates = new Array();

                var eles = document['frm' + currentForm].elements;
                var ne = eles.length, e;

                var iNext = 1;

                for (e = 0; e < ne; e ++) {
                    ele = eles[e];

                    var cls = ele.className;

                    if (ele.tagName.toLowerCase() == 'button') {
                        ele.type = 'button';

                        if (cls.indexOf('close') != -1) {
                            //alert('close');
                            //get('say').innerHTML += ele.name + ', click <br />';
                            listen(ele, 'click', manager.close);
                            manager.functions[ele.name] = manager.close;
                        } else if (cls.indexOf('new') != -1) {
                            //say('new: ' + ele.name);
                            listen(ele, 'click', manager.newRegister);
                            manager.functions[ele.name] = manager.newRegister;
                        }

                        var lbl = ele.innerHTML.toString();
                        var pi = lbl.indexOf('<s>');
                        if (pi != -1) {
                            var pf = lbl.indexOf('</s>');
                            var let = lbl.substr(pi + 3, pf - pi - 3).trim().toUpperCase();
                            //get('say').innerHTML += 'let: ' + let + '<br />';
                            manager.buttons[let] = ele.name;
                        }
                    }

                    if (cls.indexOf('entero') != -1) {
                        listen(ele, 'keydown', fixEntero);
                        if (ele.maxLength && cls.indexOf('noFill') == -1) listen(ele, 'blur', fixZeros);
                    }	else if (cls.indexOf('decimal') != -1) {
                        listen(ele, 'keydown', decimales);
                        listen(ele, 'blur', fixDecimales);
                    }	else if (cls.indexOf('porcentaje') != -1) {
                        listen(ele, 'keydown', porcentaje);
                    } else if (cls.indexOf('descuentos') != -1) {
                        listen(ele, 'keydown', descuentos);
                    } else if (cls.indexOf('date') != -1) {
                        ele.maxLength = 10;
                        if (ele.className.indexOf(' noFixed') == -1) ele.value = getDate();
                        listen(ele, 'keydown', datting);
                        listen(ele, 'focus', function(evt) {evt.target.setSelectionRange(0, 0);});

                        dates.push(ele);
                    }

                    formManager[ele.name] = ele;

                    manager.elements.push(ele);

                    if (!(ele.tagName.toLowerCase() == 'fieldset' || ele.type == 'hidden' || ele.readOnly || ele.disabled)) {
                        if (!manager.firstControl) manager.firstControl = ele;

                        manager.controls.push(ele);
                        ele.tabIndex = iNext;
                        iNext ++;

                        for (var x = e + 1; x < ne; x ++) {
                            var xEle = eles[x];
                            if (!(xEle.tagName.toLowerCase() == 'fieldset' || ele.tagName.toLowerCase() == 'textarea' || xEle.type == 'hidden' || xEle.readOnly || xEle.disabled)) {
                                //alert(ele.tagName + ', ' + ele.id + ': ' +  xEle.id);

                                listen(ele, 'keyup', manager.nextFocus);
                                break;
                            }
                        }
                    }
                }

                if (formManager.init) formManager.init();

                for (var dt = 0; dt < dates.length; dt ++) {
                    var date = dates[dt];
                    var butt = gtn(date.parentNode, 'a')[0];

                    listen(butt, 'click', function(evt) {(date.calendar ? date.calendar : calDate).showCalendar(evt.target, gtn((evt.target.tagName.toLowerCase() == 'img' ? evt.target.parentNode : evt.target).parentNode, 'input')[0]);});
                }

                if (formManager.spanWidth) {
                    //alert('#' + currentForm + ' label span' + ' width: ' + instance.currentMng.spanWidth);
                    insertRule('#' + currentForm + ' label span', 'width: ' + formManager.spanWidth + 'px');
                }

                if (window.navigator.userAgent.indexOf('Chrome') != -1 && gtn(classForm.cap, 'input').length > 0) gtn(classForm.cap, 'dialog')[0].style.width = (gtn(classForm.cap, 'h2')[0].offsetWidth - 22) + 'px';

                //var methods = new Object();
                for (memberName in formManager) {
                    var member = formManager[memberName];
                    if (typeof member == 'function' && memberName.indexOf('On') != -1) {
                        //alert('memberName: ' + memberName);
                        var mdts = memberName.split('On');

                        var ele = get(mdts[0]) || document['frm' + currentForm][mdts[0]];

                        if (ele) {
                            //var eleName = ele.tagName;
                            //get('say').innerHTML += eleName + '<br />';
                            var evt = mdts[1].toLowerCase();

                            if (evt == 'click') manager.functions[ele.name] = member;
                            listen(ele, evt, member);
                        } else alert('No existe el elemento ' + mdts[0] + ' en el formulario: "' + currentForm + '"');
                    }
                }

                cap.onremove = function() {
                    manager.onremove();
                    if (capDis != null) capDis.removeAttribute('class');
                };

                listen(document, 'keyup', execElement);

                goOnTop(cap);
                cap.style.visibility = 'visible';
                //manager.clearForm();
                manager.say(manager.msgNew);
                if (manager.firstControl) manager.firstControl.focus();

                if (formManager.begin) formManager.begin();
            }
        };
    }

    this.newRegister = function() {
        var manager = managers[currentForm];

        manager.formManager.newRegister();
    }

    this.insertRule = function(selector, rule) {
        var form = '#' + managers[currentForm].form.formName;
        var sels = selector.split(',').map(function(sel) {return form + ' ' + sel;});
        //alert(sels.join(', '));

        insertRule(sels.join(', '), rule);
    }

    this.nextFocus = function(evt) {
        if (evt.keyCode == 13 && ((evt.target.className.indexOf('coder') != -1 && evt.target.value != '') || evt.target.className.indexOf('coder') == -1)) {
            var disabled = false;
            var next = null;
            var n = evt.target.tabIndex;

            while (!disabled) {
                next = managers[currentForm].controls[n];

                if (!next) break;
                else if (next.disabled || next.readOnly) n ++;
                else break;
            }
            if (next) next.focus();
        }
    }

    this.setAlert = function(objEle, col1, col2) {
        objEle = getObj(objEle);

        var d = 50;

        var red1 = hex2dec(col1.substr(0, 2));
        var green1 = hex2dec(col1.substr(2, 2));
        var blue1 = hex2dec(col1.substr(4, 2));

        var red2 = hex2dec(col2.substr(0, 2));
        var green2 = hex2dec(col2.substr(2, 2));
        var blue2 = hex2dec(col2.substr(4, 2));

        var dRed = (red2 - red1) / d;
        var dGreen = (green2 - green1) / d;
        var dBlue = (blue2 - blue1) / d;

        var manager = mngForm;
        for (var c = 0; c < d; c ++) {
            manager.colors[c] = dec2hex(red1 + dRed * c) + dec2hex(green1 + dGreen * c) + dec2hex(blue1 + dBlue * c);
        }

        window.clearInterval(manager.tc);

        manager.tc = window.setInterval(function() {manager.setColor(objEle);}, manager.t);
    };

    this.setColor = function(objEle) {
        var manager = mngForm;
        if (manager) {
            objEle.style.backgroundColor = '#' + manager.colors[manager.cc];
            //alert(cols[cc]);

            manager.cc += manager.dt;

            if (manager.cc == manager.colors.length - 1) manager.dt = -1;
            if (manager.dt == -1 && manager.cc == 0) {
                window.clearInterval(manager.tc);
                manager.dt = 1;
            }
        }
    };

    this.say = function(msg, opc) {
        var manager = mngForm;

        var cap = manager.form.formName;
        //alert(cap);

        var spnSay = gtn(cap, 'span')[1];
        spnSay.innerHTML = msg;

        var img;
        if (opc == 'loading') {
            img = 'tloader.gif';
            spnSay.removeAttribute('class');
            manager.setAlert(spnSay.parentNode, 'ECECEC', 'FFFFB5');
        }	else if (opc == 'error') {
            img = 'exclamation.png';
            spnSay.className = 'red';
            manager.setAlert(spnSay.parentNode, 'ECECEC', 'FFFFB5');
        }	else if (!opc || currentForm.icon == 'info') {
            img = 'information.png';
            spnSay.removeAttribute('class');
            manager.setAlert(spnSay.parentNode, 'ECECEC', 'FFFFB5');
        }	else {
            img = 'information.png';
            spnSay.removeAttribute('class');
            manager.setAlert(spnSay.parentNode, 'ECECEC', 'FFFFB5');
        }
        var ima = gtn(cap, 'img')[1];
        ima.src = 'imgs/' + img;
    };

    this.loading = function(msg, nod) {
        var manager = mngForm;
        if (typeof nod == 'undefined') manager.setFrmDisabled(true);
        manager.say(msg, 'loading');
    };

    this.stopLoading = function(msg, opc, nod) {
        var manager = mngForm;

        if (typeof nod == 'undefined' || nod == '') manager.setFrmDisabled(false);
        if (opc == 'loading') opc = '';
        manager.say(msg, opc);
    };

    this.setFrmDisabled = function(val) {
        var manager = mngForm;

        var butts = manager.buttons;
        var disabs = manager.disableds;

        var frm = document['frm' + manager.form.formName];
        for (let in butts) {
            if (typeof butts[let] != 'function') {
                var name = butts[let];
                //get('say2').innerHTML += let + '<br />';

                var butt = frm[name];

                if (val) {
                    disabs[name] = butt.disabled;
                    butt.disabled = val;
                } else {
                    butt.disabled = disabs[name];
                }
            }
        }
    };

    this.showReport = function(report, title, file, ops, ori, html, longDats) {
        if (typeof ops == 'undefined' || ops == '') ops = '';
        else ops = '&' + ops;
        if (typeof html == 'undefined') html = '';
        if (typeof ori == 'undefined') ori = 0;
        if (typeof longDats == 'undefined') longDats = '';

        var rParams = 'report='+report+'&title='+escape(escape(title))+'&file='+file+'&orientacion='+ori+ops+'&html='+encodeURIComponent(html)+'&longDats='+encodeURIComponent(longDats);

        var manager = managers[currentForm];
        var rptAjax = new Ajax();

        manager.loading('Procesando ...');
        rptAjax.execPOST(rParams);
        rptAjax.onresponse = function() {
            if (this.response) {
                manager.stopLoading('Listo!');
                window.open('report.jsp?report=' + report + '&title=' + escape(title) + '&file='+file + '&rnd='+Math.random());
            } else manager.stopLoading('No se ha conseguido crear el Reporte', 'error');
        };
    }

    this.printCBMak = function(arts,colores,art_tipos,art_colores,art_coltal){
        var url = window.location + 'text.jsp';
        var rParams = 'CB=CB&arts=' + arts + '&colores=' + colores + '&tipos=' + art_tipos + '&art_colores=' + art_colores + '&tallas=' + art_coltal;
        var rptAjax = new Ajax();
        rptAjax.parent = this;
        this.loaProgram('Procesando ...');
        rptAjax.execmPOST(rParams);
        rptAjax.onresponse = function(){
            if (this.response) {
                this.parent.stopLoading('Imprimiendo...!');
                var printer = get('appletPrinter');
                //alert(this.response);
                //return false;
                printer.printText(this.response);
            } else {
                this.parent.stopLoading('No se ha detectado ninguna impresora', 'error');
            }
        };
    };


    this.clearForm = function(execps) {
        if (typeof execps != 'string') execps = '';
        var manager = managers[currentForm];

        var e;
        for (e = 0; e < manager.elements.length; e ++) {
            var ele = manager.elements[e];

            if (execps.indexOf(ele.id) == -1 || execps.indexOf(ele.name) == -1) {
                var tag = ele.tagName.toLowerCase();
                //alert(tag);
                if (tag == 'input') {
                    var type = ele.type.toLowerCase();
                    //alert(ele.name);
                    if (type == 'text' || type == 'password' || type == 'hidden' || type == 'file') ele.value = '';
                    else if (type == 'checkbox' || type == 'radio') ele.checked = false;
                }	else if (tag == 'select') {
                    ele.selectedIndex = 0;
                }	else if (tag == 'textarea') ele.value = '';
            }
        }
    };


    this.setDisabled = function(val, execps) {
        if (typeof execps == 'undefined') execps = '';
        var manager = managers[currentForm];

        var e;
        for (e = 0; e < manager.elements.length; e ++) {
            var ele = manager.elements[e];

            if (execps.indexOf(ele.name) == -1) ele.disabled = val;
        }
    };

    this.close = function() {
        var form = managers[currentForm].form.formName;
        removeCap(form);
    }

    this.onclose = function() {

    }

    this.onremove = function() {
        var manager = managers[currentForm];

        unloadJSCSS(currentForm);
        removeListen(document, 'keyup', manager.execElement);

        var firstLevel = levelsCap.indexOf(currentForm);
        var nl = levelsCap.length, l;

        for (l = firstLevel; l < nl - 1; l ++) {
            levelsCap[l] = levelsCap[l + 1];
            if (get(levelsCap[l])) get(levelsCap[l]).style.zIndex = l;
        }

        delete managers[currentForm];
        levelsCap.pop();

        currentForm = levelsCap.length > 0 ? get(levelsCap[levelsCap.length - 1]).id : null;
        if (currentForm) goOnTop(currentForm);

        this.onclose();
    }


    this.showPopup = function(idpp, inp, title, method, heaFields, fields, putFunc, putFields, nf, mParams) {
        showPopup(currentForm, idpp, inp, title, method, heaFields, fields, putFunc, putFields, nf, mParams, 1);
    };

    this.showSearcherDocs = function(idpp, inp, method, headField, fields, putFunc, putFields, searcherField, addParams) {
        showSearcherDocs(currentForm, idpp, inp, method, headField, fields, putFunc, putFields, searcherField, addParams)
    }

    this.printText = function(prms) {
        var url = window.location.href + 'text.jsp?'+prms+'&rnd='+Math.random();
        //alert(url);
        //return false;
        var manager = managers[currentForm];

        manager.loading('Detectando impresora ...');
        //alert('Detectando impresora ...');
        var printer = get('appletPrinter');
        var resp = printer.printTextFromURL(url);
        //alert(resp);
        //return false
        if (resp) {
            manager.stopLoading('Imprimiendo');
            //alert('Imprimiendo');
        } else {
            manager.stopLoading('No se ha detectado ninguna impresora', 'error');
            //alert('No se ha detectado ninguna impresora');
        }

        //return resp;
    }
}
function testManagers(obj) {
    //obj = obj.frmGrupos.form;

    /*var txt = '';
    for (ele in obj) {
        if (ele != 'existElement') {
            var objIn = obj[ele];
            txt += ele + ' : ' + objIn + '<p>';
        }
    }*/
    dump(managers.tblVendedores);
}

function execElement(evt) {
    evt = setEvent(evt);

    if (evt.ctrlKey) {
        var let = String.fromCharCode(evt.keyCode);

        var manager = managers[currentForm];
        var butt = manager.formManager[manager.buttons[let]];
        if (butt && !butt.disabled) manager.functions[manager.buttons[let]]();
    }
}

function displayTable(table) {
    table = getObj(table);
    var dats = table.summary.split(',');

    var n = parseInt(dats[1]);

    var hRow = table.tHead.rows[0];

    var ths = hRow.cells;
    var nh = ths.length, h;

    var thScl = document.createElement('th');
    thScl.className = 'th-scl';
    hRow.appendChild(thScl);

    for (h = 0; h < nh; h ++) {
        var th = ths[h];

        var padd = 2 * parseInt(getStyle(th, 'padding-left'));
        th.style.width = (th.offsetWidth - padd) + 'px';
    }

    table.className += ' tbl-scrolled'

    coverTable(table);

    var slr = '#' + table.id + ' tbody';
    var stl = 'height: ' + (n * (table.tBodies[0].rows[0].cells[0].offsetHeight + 1) + 1) + 'px';
    insertRule(slr, stl);
}

function coverTable(table, rows) {
    table = getObj(table);

    var dats = table.summary.split(',');
    var c = parseInt(dats[0]);

    var b = 0;

    if (dats.length == 3) b = parseInt(dats[1]);

    var ni = dats.length == 2 ? 1 : 2;
    var n = parseInt(dats[ni]);

    //alert('c: ' + c + ', b: ' + b + ', n: ' + n);

    var tBod    = table.tBodies[0];
    //alert(table.id + ', ' + rows);
    if (typeof rows != 'undefined') tBod.innerHTML = rows;

	var m = tBod.rows.length, i, j;

    if (m <= n) {
        for (i = m; i < n; i ++) {
            var tr = document.createElement('tr');

            for (j = 0; j < c + b; j ++) {
                var td = document.createElement('td');

                if (j >= c && j < c + b) td.className = 'td-butt';

                tr.appendChild(td);
            }
            tBod.appendChild(tr);
        }
    }
    fixTable(table);
}

function fixTable(table) {
    table = getObj(table);

    var dats = table.summary.split(',');

    var c = parseInt(dats[0]);
    //var n = parseInt(dats[2]);

    var ths = table.tHead.rows[0].cells;
    var bRows = table.tBodies[0].rows;
    var nr = bRows.length;

    var i, j;
    for (i = 0; i < nr; i ++) {
        var row = bRows[i];

        if (row.className != 'none') {
            for (j = 0; j < c; j ++) {
                var td = row.cells[j];
                var th = ths[j];

                var hp = 2 * parseInt(getStyle(th, 'padding-left'), 10);
                var bp = 2 * parseInt(getStyle(td, 'padding-left'), 10);

                td.style.width = (parseInt(th.style.width, 10) + hp - bp) + 'px';
            }

            break;
        }
    }
}

/* Fin de Former */

/* Tabs */

function Tabs(ide) {
    var tbs = this;
    ide = getObj(ide);
    this.tabs = null;

	var active = 0;
    var blocks = gtn(ide, 'blockquote');

	this.setDefault = function(a) {
		active = a;
	};

    this.init = function() {
        this.tabs = gtn(gtn(ide, 'ul')[0], 'li');

        var nt = this.tabs.length, t;

        for (t = 0; t < nt; t ++) {
            var tab = this.tabs[t];
            tab.value = t;
            listen(this.tabs[t], 'click',  this.display);
        }
        this.display();
    };

	this.display = function(evt) {
        var i = 0;

        if (typeof evt == 'object') {
            evt = setEvent(evt);
            i = evt.target.value;
        } else if (typeof evt == 'number') i = evt;

        tbs.tabs[active].removeAttribute('class');
        tbs.tabs[i].className = 'active';

        blocks[active].style.display = 'none';
        blocks[i].style.display = 'block';

        active = i;
	};
}

/* Fin de Tabs */

function myDB() {
    var stoProc = null;
    var params = new Array();

    this.prepareCall = function(sp) {
        stoProc = sp;
    };

    this.setVar = function(type, val)  {
        params.push(type + '=' + encodeURIComponent(val));
    };

    var manager = new Manager();
    manager.myDB = this;

    this.call = function() {
        var prms = '';
        if (params.length > 0) {
            prms = params.join('&');
        }

        var len = arguments.length;
        if (len > 0) {
            stoProc = arguments[0];
        }

        manager.execStoredProcedure(stoProc, encodeURIComponent(prms));
        manager.onresponse = function() {
            stoProc = null;
            params = new Array();

            this.myDB.response = this.response;
            this.myDB.onresponse();
        };
    };

    this.onresponse = function() {

    };
}

var MyDB = new myDB();

function spcParamaters() {
    var params = new Array();

    this.addParameter = function(type, val)  {
        params.push(type + '=' + encodeURIComponent(val));
    };

    this.toString = function() {
        return encodeURIComponent(params.join('&'));
    };
}

function showLoader(ide, dir, w, h) {
    get(ide).innerHTML = '<iframe scrolling="no" frameborder="0" width="' + w + '" height="' + h + '" src="loader.jsp?ide=' + ide + '&width='+w+'&height='+h+'&dir='+dir+'"></iframe>';
}

function getDate() {
	var date = new Date();

	var day = date.getDate();
	if (day < 10) day = '0' + day;

	var month = date.getMonth() + 1;
	if (month < 10) month = '0' + month;

	return day + '/' + month + '/' + date.getFullYear();
}

function spinning(evt) {
    if (evt.keyCode == 38) {
        evt.target.value ++;
    } else if (evt.keyCode == 40) {
        var val = evt.target.value;
        if (val - 1 > 0) evt.target.value --;
    }
}

function showFinderCap(form, evt, idCap, method, putFunc, putFields, addParams) {
    if (!isNaN(form)) form = get(form);
    else form = get('win' + form);
    var most = 0;
    var inp = evt.target;
    var c, cap, li;
    if (evt.keyCode == 13) {
        cap = get(idCap);
        if (cap && cap.lang) {
            c = parseInt(cap.lang);
            if (c > -1) {
                li = gtn(cap, 'a')[c];
                li.onclick();
            }
        }
    } else if (evt.keyCode == 27) {
        removeElement(idCap);
    } else if (evt.keyCode == 38 || evt.keyCode == 40 && get(idCap)) {
        cap = get(idCap);
        var lis = gtn(cap, 'li');
        var len = lis.length;

        if (!cap.lang) c = -1;
        else c = parseInt(cap.lang);

        if (c > -1) lis[c].removeAttribute('class');

        if (evt.keyCode == 38 && c > -1) {
            c --;
        } else if (evt.keyCode == 40 && c < len - 1) {
            c ++;
        }
        if (c > -1 && c < len) {
            li = lis[c];
            li.className = 'over';
            most  = gtn(lis[c], 'a')[0].innerHTML.split(': ').length;
            if(most > 1){
                inp.value = gtn(lis[c], 'a')[0].innerHTML.split(': ')[1].replace(/&amp;/g, '&');
            } else {
                inp.value = gtn(lis[c], 'a')[0].innerHTML.replace(/&amp;/g, '&');
            }
        }

        var h = 20;
        var n = 10;

        var nScroll = Math.round(cap.scrollTop / h);

        if (c < nScroll || c + 1 > nScroll + n) {
            if (evt.keyCode == 40 && c > - 1) {
                cap.scrollTop = (c + 1 - n) * h;
                //console.log('scroll: ' + cap.scrollTop);
            }

            if (evt.keyCode == 38 && c < len - n) {
                cap.scrollTop = c * h;
                //console.log('scroll: ' + cap.scrollTop);
            }
        }

        cap.lang = c;
    } else if (inp.value != '') {
        var ajx = new Ajax();
        ajx.parent = this;

        putFields = putFields.replace(/, /g, ',');

        if (typeof addParams == 'undefined') addParams = '';

        var tSnd = 'getFinderCap='+idCap+'&method='+method+'&addParams='+addParams+'&putFunc='+putFunc+'&putFields='+putFields;
        //alert(tSnd);

        ajx.execPOST(tSnd);
        ajx.onresponse = function() {
            inp = getObj(inp);
            if (get(idCap)) cap = get(idCap);
            else {
                cap = document.createElement('div');
                cap.className = 'div-finder';
                cap.id = idCap;

                var pos = getPos(inp);                
                cap.style.left = (pos.left + 1) + 'px';
                cap.style.top = (pos.top + inp.offsetHeight + 3) + 'px';
                //cap.style.width = (inp.offsetWidth - 2) + 'px';
                cap.style.width = '550px';

                getBody().appendChild(cap);
                cap.style.visibility = 'visible';
            }
            cap.style.zIndex = form.style.zIndex;

            cap.lang = -1;

            cap.innerHTML = this.response;
        };
    } else removeElement(idCap);

}

function showFinderClickCap(form, evt, idCap, method, putFunc, putFields, addParams) {
    if (!isNaN(form)) form = get(form);
    else form = get('win' + form);
    var most = 0;
    var inp = evt.target;
    var c, cap, li;
    /*if (evt.keyCode == 13) {
        cap = get(idCap);
        if (cap && cap.lang) {
            c = parseInt(cap.lang);
            if (c > -1) {
                li = gtn(cap, 'a')[c];
                li.onclick();
            }
        }
    } else */
    if (evt.keyCode == 27) {
        removeElement(idCap);
    }/* else if (evt.keyCode == 38 || evt.keyCode == 40 && get(idCap)) {
        cap = get(idCap);

        var lis = gtn(cap, 'li');
        var len = lis.length;

        if (!cap.lang) c = -1;
        else c = parseInt(cap.lang);

        if (c > -1) lis[c].removeAttribute('class');

        if (evt.keyCode == 38 && c > -1) {
            c --;
        } else if (evt.keyCode == 40 && c < len - 1) {
            c ++;
        }

        if (c > -1 && c < len) {
            li = lis[c];
            li.className = 'over';
            most  = gtn(lis[c], 'a')[0].innerHTML.split(': ').length;
            if(most > 1){
                inp.value = gtn(lis[c], 'a')[0].innerHTML.split(': ')[1].replace(/&amp;/g, '&');
            } else {
                inp.value = gtn(lis[c], 'a')[0].innerHTML.replace(/&amp;/g, '&');
            }
        }

        var h = 20;
        var n = 10;

        var nScroll = Math.round(cap.scrollTop / h);

        if (c < nScroll || c + 1 > nScroll + n) {
            if (evt.keyCode == 40 && c > - 1) {
                cap.scrollTop = (c + 1 - n) * h;
                //console.log('scroll: ' + cap.scrollTop);
            }

            if (evt.keyCode == 38 && c < len - n) {
                cap.scrollTop = c * h;
                //console.log('scroll: ' + cap.scrollTop);
            }
        }

        cap.lang = c;
    }*/ else if (inp.value != '') {
        var ajx = new Ajax();
        ajx.parent = this;

        putFields = putFields.replace(/, /g, ',');

        if (typeof addParams == 'undefined') addParams = '';

        var tSnd = 'getFinderCap='+idCap+'&method='+method+'&addParams='+addParams+'&putFunc='+putFunc+'&putFields='+putFields;
        //alert(tSnd);

        ajx.execPOST(tSnd);
        ajx.onresponse = function() {
            inp = getObj(inp);
            if (get(idCap)) cap = get(idCap);
            else {
                cap = document.createElement('div');
                cap.className = 'div-finder';
                cap.id = idCap;

                var pos = getPos(inp);
                cap.style.left = (pos.left + 1) + 'px';
                cap.style.top = (pos.top + inp.offsetHeight + 3) + 'px';
                //cap.style.width = (inp.offsetWidth - 2) + 'px';
                cap.style.width = '550px';

                getBody().appendChild(cap);
                cap.style.visibility = 'visible';
            }
            cap.style.zIndex = form.style.zIndex;

            cap.lang = -1;

            cap.innerHTML = this.response;
        };
    } else removeElement(idCap);
}

function showFinderCapSp(form, evt, idCap, method, putFunc, putFields, putSpaces,addParams) {
    if (!isNaN(form)) form = get(form);
    else form = get('win' + form);

    var inp = evt.target;
    var c, cap, li;
    if (evt.keyCode == 13) {
        cap = get(idCap);
        if (cap && cap.lang) {
            c = parseInt(cap.lang);
            if (c > -1) {
                li = gtn(cap, 'a')[c];
                li.onclick();
            }
        }
    } else if (evt.keyCode == 27) {
        removeElement(idCap);
    } else if (evt.keyCode == 38 || evt.keyCode == 40 && get(idCap)) {
        cap = get(idCap);

        var lis = gtn(cap, 'li');
        var len = lis.length;

        if (!cap.lang) c = -1;
        else c = parseInt(cap.lang);

        if (c > -1) lis[c].removeAttribute('class');

        if (evt.keyCode == 38 && c > -1) {
            c --;
        } else if (evt.keyCode == 40 && c < len - 1) {
            c ++;
        }

        if (c > -1 && c < len) {
            li = lis[c];
            li.className = 'over';
            inp.value = gtn(lis[c], 'a')[0].innerHTML.split(': ')[1].replace(/&amp;/g, '&');
        }

        var h = 20;
        var n = 10;

        var nScroll = Math.round(cap.scrollTop / h);

        if (c < nScroll || c + 1 > nScroll + n) {
            if (evt.keyCode == 40 && c > - 1) {
                cap.scrollTop = (c + 1 - n) * h;
                //console.log('scroll: ' + cap.scrollTop);
            }

            if (evt.keyCode == 38 && c < len - n) {
                cap.scrollTop = c * h;
                //console.log('scroll: ' + cap.scrollTop);
            }
        }

        cap.lang = c;
    } else if (inp.value != '') {
        var ajx = new Ajax();
        ajx.parent = this;

        putFields = putFields.replace(/, /g, ',');

        if (typeof addParams == 'undefined') addParams = '';

        var tSnd = 'getFinderCapSp='+idCap+'&method='+method+'&addParams='+addParams+'&putFunc='+putFunc+'&putFields='+putFields+'&putSpaces='+putSpaces;
        //alert(tSnd);

        ajx.execPOST(tSnd);
        ajx.onresponse = function() {
            inp = getObj(inp);
            if (get(idCap)) cap = get(idCap);
            else {
                cap = document.createElement('div');
                cap.className = 'div-finder';
                cap.id = idCap;

                var pos = getPos(inp);
                cap.style.left = (pos.left + 1) + 'px';
                cap.style.top = (pos.top + inp.offsetHeight + 3) + 'px';
                //cap.style.width = (inp.offsetWidth - 2) + 'px';
                cap.style.width = '550px';

                getBody().appendChild(cap);
                cap.style.visibility = 'visible';
            }
            cap.style.zIndex = form.style.zIndex;

            cap.lang = -1;

            cap.innerHTML = this.response;
        };
    } else removeElement(idCap);
}



function showFinderChekList(form, evt, idCap, method, putFunc, putFields, addParams) {
    if (!isNaN(form)) form = get(form);
    else form = get('win' + form);
    var inp = evt.target;
    var c, cap, li;    
    if (evt.keyCode == 13) {
        cap = get(idCap);
        if (cap && cap.lang) {
            c = parseInt(cap.lang);
            if (c > -1) {
                li = gtn(cap, 'label')[c];
                //li.onclick();
            }
        }
    } else if (evt.keyCode == 27) {
        removeElement(idCap);
    } else if (evt.keyCode == 38 || evt.keyCode == 40 && get(idCap)) {
        cap = get(idCap);

        var lis = gtn(cap, 'li');
        var len = lis.length;

        if (!cap.lang) c = -1;
        else c = parseInt(cap.lang);

        if (c > -1) lis[c].removeAttribute('class');

        if (evt.keyCode == 38 && c > -1) {
            c --;
        } else if (evt.keyCode == 40 && c < len - 1) {
            c ++;
        }

        if (c > -1 && c < len) {
            li = lis[c];
            li.className = 'over';
            inp.value = gtn(lis[c], 'span')[0].innerHTML.split(': ')[1].replace(/&amp;/g, '&');
        }

        var h = 20;
        var n = 10;

        var nScroll = Math.round(cap.scrollTop / h);

        if (c < nScroll || c + 1 > nScroll + n) {
            if (evt.keyCode == 40 && c > - 1) {
                cap.scrollTop = (c + 1 - n) * h;
                //console.log('scroll: ' + cap.scrollTop);
            }

            if (evt.keyCode == 38 && c < len - n) {
                cap.scrollTop = c * h;
                //console.log('scroll: ' + cap.scrollTop);
            }
        }

        cap.lang = c;
    } else if (inp.value != '') {
        var ajx = new Ajax();
        ajx.parent = this;

        putFields = putFields.replace(/, /g, ',');

        if (typeof addParams == 'undefined') addParams = '';

        var tSnd = 'getFinderChekList='+idCap+'&method='+method+'&addParams='+addParams+'&putFunc='+putFunc+'&putFields='+putFields;
        //alert(tSnd);

        ajx.execPOST(tSnd);
        ajx.onresponse = function() {
            inp = getObj(inp);
            if (get(idCap)) cap = get(idCap);
            else {
                cap = document.createElement('div');
                cap.className = 'div-finder';
                cap.id = idCap;

                var pos = getPos(inp);
                cap.style.left = (pos.left + 1) + 'px';
                cap.style.top = (pos.top + inp.offsetHeight + 3) + 'px';
                cap.style.width = (inp.offsetWidth - 2) + 'px';
                //cap.style.width = '550px';

                getBody().appendChild(cap);
                cap.style.visibility = 'visible';
            }
            cap.style.zIndex = form.style.zIndex;

            cap.lang = -1;

            cap.innerHTML = this.response;
        };
    } else removeElement(idCap);
}

function showFinderLenCap(form, evt, idCap, method, putFunc, putFields, addParams) {
    if (!isNaN(form)) form = get(form);
    else form = get('win' + form);
    var most = 0;
    var inp = evt.target;
    var c, cap, li;
    if (evt.keyCode == 13) {
        cap = get(idCap);
        if (cap && cap.lang) {
            c = parseInt(cap.lang);
            if (c > -1) {
                li = gtn(cap, 'a')[c];
                li.onclick();
            }
        }
    } else if (evt.keyCode == 27) {
        removeElement(idCap);
    } else if (evt.keyCode == 38 || evt.keyCode == 40 && get(idCap)) {
        cap = get(idCap);

        var lis = gtn(cap, 'li');
        var len = lis.length;

        if (!cap.lang) c = -1;
        else c = parseInt(cap.lang);

        if (c > -1) lis[c].removeAttribute('class');

        if (evt.keyCode == 38 && c > -1) {
            c --;
        } else if (evt.keyCode == 40 && c < len - 1) {
            c ++;
        }

        /*if (c > -1 && c < len) {
            li = lis[c];
            li.className = 'over';
            inp.value = gtn(lis[c], 'a')[0].innerHTML.split(': ')[1].replace(/&amp;/g, '&');
        }*/
        if (c > -1 && c < len) {
            li = lis[c];
            li.className = 'over';
            most  = gtn(lis[c], 'a')[0].innerHTML.split(': ').length;
            if(most > 1){
                inp.value = gtn(lis[c], 'a')[0].innerHTML.split(': ')[1].replace(/&amp;/g, '&');
            } else {
                inp.value = gtn(lis[c], 'a')[0].innerHTML.replace(/&amp;/g, '&');
            }
        }



        var h = 20;
        var n = 10;

        var nScroll = Math.round(cap.scrollTop / h);

        if (c < nScroll || c + 1 > nScroll + n) {
            if (evt.keyCode == 40 && c > - 1) {
                cap.scrollTop = (c + 1 - n) * h;
                //console.log('scroll: ' + cap.scrollTop);
            }

            if (evt.keyCode == 38 && c < len - n) {
                cap.scrollTop = c * h;
                //console.log('scroll: ' + cap.scrollTop);
            }
        }

        cap.lang = c;
    } else if (inp.value != '') {
        var ajx = new Ajax();
        ajx.parent = this;

        putFields = putFields.replace(/, /g, ',');

        if (typeof addParams == 'undefined') addParams = '';

        var tSnd = 'getFinderCap='+idCap+'&method='+method+'&addParams='+addParams+'&putFunc='+putFunc+'&putFields='+putFields;
        //alert(tSnd);

        ajx.execPOST(tSnd);
        ajx.onresponse = function() {
            inp = getObj(inp);
            if (get(idCap)) cap = get(idCap);
            else {
                cap = document.createElement('div');
                cap.className = 'div-finder';
                cap.id = idCap;

                var pos = getPos(inp);

                cap.style.left = (pos.left + 1) + 'px';
                cap.style.top = (pos.top + inp.offsetHeight + 3) + 'px';
                cap.style.width = (inp.offsetWidth - 2) + 'px';
                //cap.style.width = '550px';

                getBody().appendChild(cap);
                cap.style.visibility = 'visible';
            }
            cap.style.zIndex = form.style.zIndex;

            cap.lang = -1;

            cap.innerHTML = this.response;
        };
    } else removeElement(idCap);
}


function closeFinderCap(cap) {
    window.setTimeout(function() {removeElement(cap);}, 300);
}
function cellColor(li){

}

