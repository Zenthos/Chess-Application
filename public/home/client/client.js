
document.getElementById('button1').addEventListener('click', function(event) {
    let currentLink = window.location.href;
    window.location.href = `${currentLink}chess`;
});

document.getElementById('button2').addEventListener('click', function(event) {
    let currentLink = window.location.href;
    window.location.href = `https://github.com/Zenthos/Chess-Application`;
});