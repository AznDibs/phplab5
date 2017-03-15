<?php

$mode = $_GET["mode"];

function modeInfo() {
    $title = $_GET["title"];
    $info = file("books/$title/info.txt");
    $info = array("title"=>$info[0], "author"=>$info[1], "stars"=>$info[2]);
    $info = json_encode($info);
    echo $info;
}

function modeDescription() {
    $title = $_GET["title"];
    $desc = fread(fopen("books/$title/description.txt", "r"), filesize("books/$title/description.txt"));
    return $desc;
}

function modeReviews() {
    $title = $_GET["title"];
    $xml = new SimpleXMLElement("<body></body>");
    foreach (glob("books/$title/review*.txt") as $review_file) {
        $reviewer = file($review_file)[0];
        $stars = file($review_file)[1];
        $review = file($review_file)[2];
        $div = $xml->addChild('div');
        $h3 = $div->addChild('h3',$reviewer);
        $span = $h3->addChild('span',$stars);
        $p = $div->addChild('p',$review);
    }
    return $xml->asXML();
}

function modeBooks() {
    $mBooks = array();
    $xml = new SimpleXMLElement("<books></books>");
    foreach (glob("books/**/info.txt") as $info_file) {
        #var_dump($info_txt);
        $title = file($info_file)[0];
        $folder = explode("/",dirname($info_file))[1];
        $book = $xml->addChild('book');
        $book->addChild('title',$title);
        $book->addChild('folder',$folder);
    }
    #echo htmlspecialchars($xml);
    return $xml->asXML();
}


switch($mode) {
    case 'info':
        echo modeInfo();
        break;
    case 'description':
        echo modeDescription();
        break;
    case 'reviews':
        echo modeReviews();
        break;
    case 'books':
        echo modeBooks();
}

?>