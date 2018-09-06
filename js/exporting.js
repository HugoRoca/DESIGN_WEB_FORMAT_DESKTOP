function exportTo(type, report) {
    if (type) {
        var url = window.location.href;
        var pi = url.lastIndexOf('/');
        url = url.substr(0, pi) + '/processor.jsp?exportTo='+type+'&reportName='+report;
        alert(url);
        window.location.href = url;
    }   else alert('Debe seleccionar el formato de exportación');
}