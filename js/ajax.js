function getAjax() {
	var req;
	try {
		req = new XMLHttpRequest();
	} 	catch(err1) {
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (err2) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (err3) {
				req = false;
			}
		}
	}

	return req;
}

function Ajax() {
    this.ajax = new getAjax();
    this.ajax.parent = this;
    this.response = null;

    this.ajax.onresp = function() {
        if (typeof closeSession == 'function') closeSession();
        try {
            this.parent.response = eval('(' + this.responseText.trim() + ')');
        }	catch(e) {
            this.parent.response = this.responseText.trim();
        }

        this.parent.onresponse();
    };

    this.onresponse = function() {

    };

    this.URL = 'processor.jsp';
    var url;
    var snd = null;
    var method = 'GET';

    this.execGET = function(params) {
        //alert(params);
        if (typeof params == 'undefined' || params == '') params = '?';
        else params = '?' + params + '&';
        //alert(params);
        url = this.URL + params + 'rnd=' + Math.random();
        //alert('url:' + url);
        this.execAjax();
    };

    this.execPOST = function(params) {
        url = this.URL;
        //alert(url);
        snd = params;
        //alert(params);
        method = 'POST';
        this.execAjax();
    };
    this.execmPOST = function(params) {
        url = 'text.jsp';
        //alert(url);
        snd = params;
        //alert(params);
        method = 'POST';
        this.execAjax();
    };
    this.execAjax = function() {
        this.ajax.open(method, url, true);
        this.ajax.onreadystatechange = function() {
            if (this.readyState == 4) {
                //var rst = this.responseText;
                //alert(rst);
                this.onresp();
            }
        };
        if (method == 'POST') this.ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        //alert(snd);
        this.ajax.send(snd);
    };
}