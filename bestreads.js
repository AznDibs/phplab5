$(document).ready(function(){
    /*
    $('.food').on('click', sendFood);
    function sendFood(event) {
        console.log(event);
    }

    var mode = "";
    var title = "2001spaceodyssey";
    $.get("bestreads.php?mode=" + mode + "&title=" + title, function(data) {
        console.log(data);
    }); */
    displayAll();
    $('#back').on("click",displayAll);
    $('#back').css('cursor','pointer');
    var title = document.getElementById('header').firstChild;
    title.addEventListener("click",displayAll);
    title.style.cursor = 'pointer';
});

function onClick(me) {
    var name = me.target.parentNode.id;
    console.log(name);
    displayBook(name,'info');
    displayBook(name,'description');
    displayBook(name,'reviews');
}

function displayAll() {
    $.ajax({
       url: 'bestreads.php',
       type: 'GET',
       data: {
           mode: 'books'
       },
       success: function(stuff) {
            $("#allbooks").show();
            $("#singlebook").hide();
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(stuff,"text/xml");
            var books = xmlDoc.getElementsByTagName("book");
            for (var i = 0; i < books.length; i++) {
                var cover = document.createElement("img");
                cover.src = "books/"+books[i].childNodes[1].innerHTML+"/cover.jpg";
                var div = document.createElement("div");
                div.id = books[i].childNodes[1].innerHTML;
                var p = "<p>"+books[i].firstChild.innerHTML+"</p>";
                $(div).append(cover, p);
                $('#allbooks').append(div);
                $(div).on("click",onClick);
                $(div).css('cursor','pointer');
            }
       },
        error: function(e) {
            console.log(e.message);
        }
    });
}

function displayBook(title,new_mode) {
    $.ajax({
        url: 'bestreads.php',
        type: 'GET',
        data: {
            title: title,
            mode: new_mode
        },
        success: function(stuff) {
            $("#allbooks").hide();
            $("#singlebook").show();
            switch(new_mode) {
                case 'info':
                    var parsed_info = JSON.parse(stuff);
                    $('#title').html(parsed_info['title']);
                    $('#author').html(parsed_info['author']);
                    $('#stars').html(parsed_info['stars']);
                    $('#cover').attr('src',"books/"+title+"/cover.jpg");
                    break;
                case 'description':
                    console.log(stuff);
                    $('#description').html(stuff);
                    break;
                case 'reviews':
                    $('#reviews').html("");
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(stuff,"text/xml");
                    var divs = xmlDoc.getElementsByTagName("div");
                    for (var i = 0; i < divs.length; i++) {
                        $('#reviews').append(divs[i].innerHTML);
                    }
                    break;
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    }); 
}