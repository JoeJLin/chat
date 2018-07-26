var dropdown = document.querySelectorAll('.dropdown');
for (let i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener('click', function (event) {
        event.stopPropagation();
        dropdown[i].classList.toggle('is-active');
    })
    document.addEventListener('click', function () {
        dropdown[i].classList.remove('is-active');
    })
}