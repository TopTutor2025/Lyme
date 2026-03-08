gsap.registerPlugin(ScrollTrigger)



/* NAVBAR SCROLL */

let lastScroll = 0
const navbar = document.getElementById("navbar")

window.addEventListener("scroll",()=>{

let current = window.scrollY

if(current > lastScroll){
navbar.style.transform = "translateY(-100%)"
}else{
navbar.style.transform = "translateY(0)"
}

lastScroll = current

})



/* HERO LIGHT */

gsap.to(".light",{
scale:1.08,
opacity:.5,
scrollTrigger:{
trigger:".hero",
scrub:1
}
})



/* MULTILAYER JACKET 3D */

gsap.to("#jacket3D",{
rotateY:14,
rotateX:5,
y:-12,
scrollTrigger:{
trigger:".hero",
start:"top top",
end:"bottom top",
scrub:1
}
})

gsap.to(".back",{
x:-10,
y:12,
scrollTrigger:{
trigger:".hero",
start:"top top",
end:"bottom top",
scrub:1
}
})

gsap.to(".front",{
x:10,
y:-8,
scrollTrigger:{
trigger:".hero",
start:"top top",
end:"bottom top",
scrub:1
}
})



/* TECH DETAILS */

gsap.to(".tech",{
opacity:1,
y:0,
stagger:.3,
scrollTrigger:{
trigger:".hero",
start:"top 60%"
}
})



/* VIDEO SOUND TOGGLE */

const video = document.getElementById("heroVideo")
const btn = document.getElementById("soundToggle")

if(video && btn){
btn.addEventListener("click",()=>{

video.muted = !video.muted

if(video.muted){
btn.innerHTML = "▶"
}else{
btn.innerHTML = "🔊"
}

})
}