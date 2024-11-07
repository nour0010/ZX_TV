let openbtn=document.querySelector('.btnnav1');
let closbtn=document.querySelector('.btnnav');
let navbar2=document.querySelector('.navbar2');
let navbar1=document.getElementById('navbar1');
let body=document.getElementById('body');
let scrollBtn1 =document.querySelectorAll(".scrollBtn1");
let scrollBtn2 =document.querySelectorAll(".scrollBtn2");
let move =document.querySelectorAll(".move");
let movebar =document.querySelectorAll(".movebar");
let moves =document.getElementById("moves")
console.log(moves)




openbtn.onclick=function(){
    navbar2.classList.toggle("block")
}
closbtn.onclick=function(){
    navbar2.classList.toggle("block")
}


body.onscroll=function()
{
    let value =scrollY;
    if(value >= 30.6240005493164){
        navbar1.style.backdropFilter='blur(100px)';
        navbar1.style.border="2px solid #0b050373";
        navbar1.style.transform ="translateY(-25px)";

    }
    else if(value <= 30.6240005493164){
        navbar1.style.backdropFilter='blur(0px)';
        navbar1.style.border="2px solid transparent";
        navbar1.style.transform ="translateY(0px)";
    } 
}



