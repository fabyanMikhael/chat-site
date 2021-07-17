sessionStorage.setItem("Username", "Base User");
sessionStorage.setItem("Avatar", "https://d3h0owdjgzys62.cloudfront.net/images/6745/live_cover_art/thumb2x/pattern__2_.png");
var LoginButton = document.getElementById('LoginButton');
var UsernameInput = document.getElementById('Username');
var AvatarInput = document.getElementById('Avatar');
var AvatarImg = document.getElementById('AvatarImg');


LoginButton.addEventListener("click", () => {
    sessionStorage.setItem("Username", UsernameInput.value);
    sessionStorage.setItem("Avatar", AvatarInput.value);
    if (AvatarInput.value == ""){ sessionStorage.setItem("Avatar", "https://d3h0owdjgzys62.cloudfront.net/images/6745/live_cover_art/thumb2x/pattern__2_.png");}
    location.replace("Chat.html");
});

AvatarInput.addEventListener( "input", () => {
    AvatarImg.setAttribute('src', AvatarInput.value);
});