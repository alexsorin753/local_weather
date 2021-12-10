function tool_tip(button, tool) {
    let toolTip_width = parseInt(window.getComputedStyle(tool).width)
    let btn_width = parseInt(window.getComputedStyle(button).width)
    let btn_left_dist = button.getBoundingClientRect().x;

    tool.style.left = `${btn_left_dist - (toolTip_width / 2) + (btn_width / 2)}px`;    
}

document.addEventListener('DOMContentLoaded', function() {
    
    function time() {
        const elem = document.getElementsByClassName('time')[0]
        let date = new Date();
        let time = date.toLocaleTimeString();

        elem.textContent = time;
    }; time(); setInterval(time, 1000);


    let location = document.getElementsByClassName('location')[0];
    let temperature = document.getElementsByClassName('temp')[0].children[0];
    let temp_btn = document.getElementsByClassName('temp_btn')[0];
    let temp_tool = document.getElementsByClassName('temp_tool')[0];
    let temp_feels = document.getElementsByClassName('temp_fells')[0];
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
            let cur_temp = Math.round(info.main.temp);
            // cur_temp = 32
            location.textContent = `${info.name}, ${info.sys.country}`;
            temperature.textContent = cur_temp;
            temp_btn.textContent = 'C'
            temp_feels.children[0].textContent = `${Math.round(info.main.feels_like)} C` ;

            condition.textContent = info.weather[0].main;

            if(info.weather[0].icon) logo.setAttribute('src', `${info.weather[0].icon}`);

            if(cur_temp < 0) document.body.style.backgroundColor = '#91C4F2';
            if(cur_temp >= 0 && cur_temp < 11) document.body.style.backgroundColor = '#39A2AE';
            if(cur_temp > 10 && cur_temp < 21) document.body.style.backgroundColor = '#9dc288';
            if(cur_temp > 20 && cur_temp < 31) document.body.style.backgroundColor = '#ceb32f';
            if(cur_temp > 30) document.body.style.backgroundColor = '#F48668';

            tool_tip(temp_btn, temp_tool);

        }; request.send();
    };

    function convert(val, unit) {
        if(unit === 'fahrenheit') {
            return Math.round( (Number(val)  * 9/5) + 32 );
        } else {
            return Math.round( (Number(val)  - 32) * 5/9 );
        }
    };
    temp_btn.addEventListener('click', function() {
        if(this.textContent === 'C') {
            this.textContent = 'F';
            let new_Ftemp = convert(temperature.textContent, 'fahrenheit');
            temperature.textContent = new_Ftemp;
            temp_feels.children[0].textContent = `${new_Ftemp}F`;
            temp_tool.textContent = "Change to Celsius"
        } else {
            let new_Ctemp = convert(temperature.textContent, 'celsius');
            this.textContent = 'C'
            temperature.textContent = new_Ctemp;
            temp_feels.children[0].textContent = `${new_Ctemp}C`;
            temp_tool.textContent = "Change to Fahrenheit"
        }
    });

});

window.addEventListener('resize', function() {
    let temp_btn = document.getElementsByClassName('temp_btn')[0];
    let temp_tool = document.getElementsByClassName('temp_tool')[0];    
    tool_tip(temp_btn, temp_tool);
})