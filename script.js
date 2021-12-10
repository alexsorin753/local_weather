document.addEventListener('DOMContentLoaded', function() {
    
    function time() {
        const elem = document.getElementsByClassName('time')[0]
        let date = new Date();
        let time = date.toLocaleTimeString();

        elem.textContent = time;
    }; time(); setInterval(time, 1000);


    let location = document.getElementsByClassName('location')[0];
    let temp = document.getElementsByClassName('temp')[0];
    let condition = document.getElementsByClassName('condition')[0];
    let logo = document.getElementsByClassName('logo')[0].children[0];

    function getLocation() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            location.textContent = "Geolocation is not supported by this browser.";
        }
    }; getLocation();

    function showPosition(position) {
        let lati = position.coords.latitude;
        let longi = position.coords.longitude;
        
        let request = new XMLHttpRequest();
        request.open('GET', `https://weather-proxy.freecodecamp.rocks/api/current?lat=${lati}&lon=${longi}`);

        request.onload = function() {
            let info = JSON.parse(request.response); console.log( info );

            location.textContent = `${info.name}, ${info.sys.country}`;
            temp.children[0].textContent = `${ Math.trunc(info.main.temp) }`;
            temp.children[1].textContent = 'C'
            condition.textContent = `${info.weather[0].main}`
            logo.setAttribute('src', `${info.weather[0].icon}`);
        }; request.send();
    };

    function convert(val, unit) {
        if(unit === 'fahrenheit') {
            return Math.round( (Number(val)  * 9/5) + 32 );
        } else {
            return Math.round( (Number(val)  - 32) * 5/9 );
        }
    }
    temp.children[1].addEventListener('click', function() {
        if(this.textContent === 'C') {
            this.textContent = 'F';
            temp.children[0].textContent = convert(temp.children[0].textContent, 'fahrenheit');
        } else {
            this.textContent = 'C'
            temp.children[0].textContent = convert(temp.children[0].textContent, 'celsius')
        }
    })

});

