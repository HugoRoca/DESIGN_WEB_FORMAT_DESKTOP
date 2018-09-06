
function showPPPTienda(prgID, idpp,inp, putFunc, putFields,tipo) {
    var headFields = 'Código,Descripción';
    var method     = 'MngEmpresas.getPopupDO';
    var mParams    = 'String=' + tipo;
    var fields     = 'empr_id,empr_nomb';        
    var title      = "Buscar Tienda";
   showPopup(prgID, idpp, getObj(inp), title, method, headFields, fields, putFunc, putFields, 1, mParams);
}

function showPPUnidades(form, idpp, inp, putFunc, putFields) {
    //if (typeof plt == 'undefined') plt = 1;
    var headFields  = 'Código,Unidad';
    var method      = 'MngUnidades.getPopup';
    var fields      = 'unid_id,unid_uniconsumo';
    var title       = "Buscar Unidades";

    showPopup(form, idpp, getObj(inp), title, method, headFields, fields, putFunc, putFields,1,''/*, plt*/);
}

function getTbl(idtd, regs,tbl, editFunc, delFunc){
    var nr = regs.length, r;
    var tr , tds;

    var table = get(tbl);
    table.removeChild(table.tBodies[0]);
    table.appendChild(document.createElement('tbody'));

    var bod = get(tbl).tBodies[0];

    var ntd = 4, d;

    for(r = 0; r < nr; r ++){
        tr = document.createElement('tr');
        tr.id = idtd + regs[r].id;
        for (d = 0; d < ntd; d ++){
            var td = document.createElement('td');
            tr.appendChild(td);
        }
        bod.appendChild(tr);
        tds = tr.cells;
        tds[0].innerHTML = regs[r].id;
        tds[1].innerHTML = regs[r].descripcion;

        var edit = document.createElement('a');
        edit.href = 'JavaScript:;';
        edit.title = 'Modificar';
        edit.setAttribute('onclick', editFunc + "(this,'" + regs[r].id + "');");
        var imge =  document.createElement('img');
        imge.alt = 'Modificar';
        imge.src='imgs/page_white_edit.png';
        edit.appendChild(imge);
        tds[2].innerHTML = '';
        tds[2].appendChild(edit);
        tds[2].className = 'td-butt';

        var del = document.createElement('a');
        del.href = 'JavaScript:;';
        del.title = 'Eliminar';
        del.setAttribute('onclick', delFunc + "(this,'" + regs[r].id + "');");
        var imgd =  document.createElement('img');
        imgd.alt = 'Eliminar';
        imgd.src='imgs/button_cancel.png';
        del.appendChild(imgd);
        tds[3].innerHTML = '';
        tds[3].appendChild(del);
        tds[3].className = 'td-butt';

    }
    fillTable(tbl);    
}

function getItem(idtd, cod, nom, table, editFunc, delFunc){
    var nr, r;
    if (get(idtd)) {
        var tds = gtn(idtd, 'td');
        tds[0].innerHTML = cod;        
        tds[1].innerHTML = nom;
    } else {
        var tr = null;
        var bod = get(table).tBodies[0];
        var rows = bod.rows;
        nr = rows.length;

        for (r = 0; r < nr; r ++) {
            if (rows[r].cells[0].innerHTML == '') {
                tr = rows[r];
                tr.id = idtd;
                tds = tr.cells;
                //tds[2].removeAttribute('colspan');
                //tds[2].className = 'td-butt';
                //td = document.createElement('td');
                //td.className = 'td-butt'
                //tr.appendChild(td);
                break;
            }
        }

        if (tr == null) {
            tr = document.createElement('tr');
            tr.id = idtd;
            nr = 4;

            for (r = 0; r < nr; r ++) {
                var td = document.createElement('td');
                if(r == 2 || r == 3) td.className = 'td-butt';
                tr.appendChild(td);
            }
            bod.appendChild(tr);
        }
        
        tds = tr.cells;
        tds[0].innerHTML = cod.trim();
        tds[1].innerHTML = nom.trim();
        
        // creando boton editar;
        var edit = document.createElement('a');
        edit.href = 'JavaScript:;';
        edit.title = 'Modificar';
        edit.setAttribute('onclick', editFunc + "(this,'" + cod + "');" );
        var imge =  document.createElement('img');
        imge.alt = 'Modificar';
        imge.src='imgs/page_white_edit.png';
        edit.appendChild(imge);
        tds[2].innerHTML = '';
        tds[2].appendChild(edit);

        // creando boton eliminar;
        var del = document.createElement('a');
        del.href = 'JavaScript:;';
        del.title = 'Eliminar';
        del.setAttribute('onclick', delFunc + "(this,'" + cod + "');" );
        var imgd =  document.createElement('img');
        imgd.alt = 'Eliminar';
        imgd.src='imgs/button_cancel.png';
        del.appendChild(imgd);
        tds[3].innerHTML = '';
        tds[3].appendChild(del);
    }
    fillTable(table);    
}




function validHtmlEntities(text){
    var value = text;
    /*if(typeof inp != 'String') value = inp.value;
    else{
        value = inp;
    }    */
    value = value.replace(/&/gi,'&amp;');
    //alert(value);
    value = value.replace(/"/gi,'&quot;');
    //alert(value);
    value = value.replace('<','&lt;');
    //alert(value);
    value = value.replace('>','&gt;');
    return value;
    //alert(value);
    //inp.value.URLlimpia();
    //alert(inp.value.URLlimpia());
}

function showJasperReport (pForm, params,method) {
    //form = getObj(form);
    var form = document[pForm];
    form.method = method;

    if(method=='POST'){
        form.target="_blank";
        form.action = "reportes.jsp";
        form.submit();
    } else{        
        //form.action = "reportes.jsp"        
        window.open('reportes.jsp?' + params);
    }      
}

function showExcelReport (pForm, params,method) {
    //form = getObj(form);
    var form = document[pForm];
    form.method = method;

    if(method=='POST'){
        form.target="_blank";
        form.action = "excel.jsp";
        form.submit();
    } else{
        //form.action = "reportes.jsp"
        window.open('excel.jsp?' + params);
    }
}

function showWordReport (pForm, params,method) {
    //form = getObj(form);
    var form = document[pForm];
    form.method = method;

    if(method=='POST'){
        form.target="_blank";
        form.action = "word.jsp";
        form.submit();
    } else{
        //form.action = "reportes.jsp"
        window.open('word.jsp?' + params);
    }
}

/*function printCBMak(win,arts,colores,art_tipos,art_colores,art_coltal){
    /*var form = document[pForm];
    form.method = method;
    form.action = "text.jsp";
    //form.submit();
    //var url = window.location.href + 'text.jsp';//?'+prms+'&rnd='+Math.random();
    
    var rptAjax = new Ajax();
    rptAjax.parent = this;
    this.loaProgram('Procesando ...');
    rptAjax.execPOST(rParams);
    rptAjax.onresponse = function() {

    };
    var url = 'http://localhost:8080/SGVentas/text.jsp';
    var rParams = 'CB=CB&arts=' + arts + '&colores=' + colores + '&tipos=' + art_tipos + '&art_colores=' + art_colores + '&tallas=' + art_coltal;

    var rptAjax = new Ajax();
    rptAjax.parent = win;
    win.loaProgram('Detectando impresora ...');
    rptAjax.execPOST(rParams);
    rptAjax.onresponse = function() {
        if (this.response) {
            win.stopLoading('Imprimiendo!');
            var printer = get('appletPrinter');
            alert(this.response);
            return false;
            var resp = printer.printTextFromURL(url);
        } else {
            win.stopLoading('No se ha detectado ninguna impresora', 'error');
        }
    }
}*/


function getNextDay( fecha ) {
    var fcs = fecha.split('/');
    var date = new Date();
    date.setDate(parseInt(fcs[0], 10));
    date.setMonth(parseInt(fcs[1], 10) - 1);
    date.setYear(parseInt(fcs[2], 10));
    date.setTime(date.getTime() + 1000 * 24 * 3600);
    var d = date.getDate();
    if (d < 10) d = '0' + d;

    var m = date.getMonth() + 1;
    if (m < 10) m = '0' + m;
    return d + '/' + m + '/' + date.getFullYear();
}

/*compareDates devuelve -1 si la fecha1 es menor que la fecha2
    si son iguales devuelve 0
    y si la fecha1 es mayor que la fecha2 devuelve 1 */

function compareDates(fecha1, fecha2) {

    var date = new Date();
    var fcs;
    fcs = fecha1.split('/');
    date.setDate(parseInt(fcs[0], 10));
    date.setMonth(parseInt(fcs[1], 10) - 1);
    date.setYear(parseInt(fcs[2], 10));

    var time1 = date.getTime();

    fcs = fecha2.split('/');
    date.setDate(parseInt(fcs[0], 10));
    date.setMonth(parseInt(fcs[1], 10) - 1);
    date.setYear(parseInt(fcs[2], 10));

    var time2 = date.getTime();

    if (time1 < time2) return -1;
    else if (time1 == time2) return 0;
    else return 1;
}

function replaceSpace(cad){
    if(cad != ''){
         cad = cad.replace(/[ ]/gi,'&nbsp;');
    }
    return cad;
}

function replaceSpHtml(cad){
    if(cad != ''){
        cad = cad.replace(/&nbsp;/gi,' ');
    }
    return cad;
}

function getFechInv(){
    var fechinv = '';
    var mngFechInv = new MngEmpresas();
    mngFechInv.getFechaInv('empr_fecinvPt');
    mngFechInv.onresponse = function(){
        if(this.response){
            fechinv = this.response;
        }
    }
    return fechinv;
}

function showFinderCodAlt(win) {
    loading();
    loadProgram('frmFinderCodAlt', 'Buscar por Código Alterno', 'package.png');
    lt.onloaded = function () {
        winfrmFinderCodAlt.createWin('win' + win);
        frmFinderCodAlt();
        loaStop();
    };
    lt.isLoaded('frmFinderCodAlt');
}