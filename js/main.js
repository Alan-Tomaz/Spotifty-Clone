/* DROPDOWN */
const dropdowns = document.querySelectorAll('.dropdown');

//LOOP THROUGH ALL DROPDOWN ELEMENTS
dropdowns.forEach(dropdown => {
    //get dropdown location
    const dropdownLocation = dropdown.getBoundingClientRect();
    //change the location of the menu
    document.getElementById(`menu-${dropdown.dataset.dropdown}`).style.top = (dropdownLocation.top + 145) + "px";
    document.getElementById(`menu-${dropdown.dataset.dropdown}`).style.left = (dropdownLocation.left + 40) + "px";

    //get other elements
    let activeElement = dropdown.querySelector('.menu .active');
    const menu = dropdown.querySelector('.menu');
    const dropdownHideIcon = dropdown.querySelector(`#dropdown-hide-${dropdown.dataset.dropdown}`);
    const dropdownShowIcon = dropdown.querySelector(`#dropdown-show-${dropdown.dataset.dropdown}`);
    const options = dropdown.querySelectorAll('.option');
    const selected = dropdown.querySelector('.selected span');
    const select = dropdown.querySelector('.select');


    let isOpen = false;

    document.querySelector('main').onclick = () => {
        dropdowns.forEach(dropdown => {
            menu.style.display = "none";
            dropdownHideIcon.style.display = "none"
            dropdownShowIcon.style.display = "inline-block";
            isOpen = false;
        })
    }
    //create the click event
    select.addEventListener('click', () => {
        if (isOpen == false) {
            setTimeout(() => {
                menu.style.display = "block";
                dropdownHideIcon.style.display = "inline-block"
                dropdownShowIcon.style.display = "none";
                isOpen = true;
            }, 50);
        } else {
            menu.style.display = "none";
            dropdownHideIcon.style.display = "none"
            dropdownShowIcon.style.display = "inline-block";
            isOpen = false;
        }
    })


    options.forEach(option => option.addEventListener('click', () => {
        let activeElement = dropdown.querySelector('.menu .active');
        activeElement.className = "option";
        option.classList.add("active");
        menu.style.display = "none";
        dropdownHideIcon.style.display = "none"
        dropdownShowIcon.style.display = "inline-block";
        selected.innerHTML = option.querySelector("span").innerHTML;
        isOpen = false;
    }))
})




//main element
const mainElement = document.querySelector('.main');
//main content header
const mainHeader = document.querySelector('.main-content');

mainHeader.style.background.color = "transparent";

mainElement.addEventListener('scroll', (event) => {
    mainHeader.style.backgroundColor = "#121212";
    if (mainElement.scrollTop >= 100) {
        mainHeader.style.backgroundColor = "#121212";
    }
    if (mainElement.scrollTop < 100) {
        mainHeader.style.backgroundColor = "transparent";
    }
})