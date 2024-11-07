let openbtn=document.querySelector('.btnnav1');
let closbtn=document.querySelector('.btnnav');
let navbar2=document.querySelector('.navbar2');
openbtn.onclick=function(){
    navbar2.classList.toggle("block")
    openbtn.classList.toggle("none")
}
closbtn.onclick=function(){
    navbar2.classList.toggle("block")
    openbtn.classList.toggle("none")
}