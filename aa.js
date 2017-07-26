$(document).ready(function () {
    $.post('/', function (data1) {
        alert("11111");
        $('#url').html(data1);
    });
})