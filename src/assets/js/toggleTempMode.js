export const toggleTempMode = () => {
    const checkbox = document.querySelector('#c2');
    const temperatureBlock = document.querySelector('.temperature__mode');

    let checked = checkbox.getAttribute('checked');

    if (!checked) {
        temperatureBlock.style = 'display: none';
    }

    let display;

    checkbox.addEventListener('click', () => {
        checked = !checked;
        checkbox.setAttribute('checked', checked);
        checked ? display = 'grid' : display = 'none';
        temperatureBlock.style = `display:${display}`;
    })
}