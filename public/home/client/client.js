
document.querySelector('button').addEventListener('click', function(event) {
    let currentLink = window.location.href;
    window.location.href = `${currentLink}chess`;
});