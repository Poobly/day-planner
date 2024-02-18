// WIP:
// backend integration

import { toIsoStringLocale } from "./helpers.js";

let work_time = "2500";
let break_time = "0500";
let long_break_time = "3000";
const current_date = toIsoStringLocale(new Date()).slice(0, 10);
const xhttp = new XMLHttpRequest();



const timer = (function () {
    const _timer_button = document.getElementById("timer-main-button");
    const _skip_button = document.getElementById("timer-skip-button");
    const _reset_button = document.getElementById("timer-reset-button");
    const _timer_text_con = document.getElementById("timer-text-con");
    const _digits = Array.from(document.querySelectorAll(".timer-digit"));
    let _timer_data = {
        "timer_type" : "work",
        "timer_counter" : 1,
        "work" : "2500",
        "break" : "0500",
        "long_break" : "3000",
        "active" : "false",
        "active_time" : "0000"
    }
    
    let _elapsed_sessions = {};


    let _time = _digits.map(digit => digit.textContent);
    let _timer;
    let _minutes = (_time[0] + _time[1]) * 1;
    let _seconds = (_time[2] + _time[3]) * 1;
    let _timer_digit_index = _time.length - 1;
    
    let _timer_focused = false;
    let _is_paused = true;
    let _digit_editing = false;
    let _digit_selection;
    
    let data = {"time" : _time};

    function _startTimer() {
        _timer_data.active = "true";
        _timer = setInterval(_tick, 1000);
        _is_paused = false;
    }

    function _tick() {
        data = {"time" : _time};
        xhttp.open("POST", "/api/data", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhttp.send(JSON.stringify(data));



        if (_seconds > 0) {
            _nextSecond();
            _setTime();
        }
        else {
            if (_minutes > 0) {
                _nextMinute();
                _setTime();
            }
            else {

                _endTimer();

            }
        }
    }

    
    function _endTimer() {
        if (_timer_data.timer_type === "work") _elapseSession();

        _pauseTimer();
        _timer_data.timer_type = _timer_data.timer_type === "work" ? (_timer_data.timer_counter === 4 ? "long_break" : "break") : "work";

        _time = _getNextSequence();
        
        _updateTime();

        if (_timer_data.timer_counter === 4) _timer_data.timer_counter = 0;
        if (_timer_data.timer_type === "work") _timer_data.timer_counter++;
        localStorage.setItem("timer_data", JSON.stringify(_timer_data));
    }
    

    // sets the next minute
    function _nextMinute() {
        _minutes--;
        _seconds = 59;
    }

    function _nextSecond() {
        _seconds--;
    }
    
    // gets the correct _time for current timer sequence
    function _getNextSequence() {
        localStorage.setItem("timer_data", JSON.stringify(_timer_data));
        return _timer_data[_timer_data.timer_type];
    }

    window.onload = () => {
        let stored_data = JSON.parse(localStorage.getItem("timer_data"));
        let elapsed_sessions_data = JSON.parse(localStorage.getItem("elapsed_sessions"));

        if (elapsed_sessions_data == null) elapsed_sessions_data = _elapsed_sessions;
        _elapsed_sessions = elapsed_sessions_data;

        if (stored_data == null) stored_data = _timer_data;
        _timer_data = stored_data;
        

        if (_timer_data.active === "true") _time = _timer_data.active_time;
        else _time = _timer_data[_timer_data.timer_type];
        
        _updateTime()
        _checkSeconds();
    }

    function _updateTime() {
        _minutes = (_time[0] + _time[1]) * 1;
        _seconds = (_time[2] + _time[3]) * 1;

        _setTime();
    }

    function _setTime() {
        _time = `${_minutes.toString().padStart(2, "0")}${_seconds.toString().padStart(2, "0")}`;
        _digits[0].textContent = _time[0]
        _digits[1].textContent = _time[1]
        _digits[2].textContent = _time[2]
        _digits[3].textContent = _time[3]

        _timer_data.active_time = _time;
        localStorage.setItem("timer_data", JSON.stringify(_timer_data))
    }

    function _pauseTimer() {
        clearInterval(_timer);
        _timer_button.textContent = "Start";
        _is_paused = true;
    }

    function _checkSeconds() {
        if (_seconds >= 60) {
            _minutes += Math.floor(_seconds / 60);
            _seconds = _seconds % 60;
            _setTime();
        }
    }

    // replaces the timer _digits
    function _replaceDigits(e) {

        if (isFinite(parseInt(e.key))) {
            // checks if the digit index is under 0 to reset position to the current digit and if it isn't then 
            if (_timer_digit_index < 0) {
                _timer_digit_index = _digit_selection;
            }
            else if (_timer_digit_index === _time.length - 1 ||  _digit_selection < 3 && _digit_editing) {
                _time = _time.substring(_digit_selection + 1).padStart(4, "0");
            }
            

            if (_digit_selection < 3 && _digit_editing) {
                _time = _time.substring(0, _digit_selection) + e.key + _time.substring(_digit_selection + 1);
                _digit_editing = false;
            }
            else {
                _time = _time.substring(1);
                _time = _time.substring(0, _digit_selection) + e.key + _time.substring(_digit_selection);
            }

            _digits[_timer_digit_index].classList.remove("timer-digit-temp");
            _timer_digit_index--;
            

            _timer_data[_timer_data.timer_type] = _time;
            localStorage.setItem("timer_data", JSON.stringify(_timer_data))

            _updateTime();
        } 
    }

    // unfocuses the editing function
    document.addEventListener("mousedown", (e) => {
        if (!_timer_text_con.contains(e.target)) {
            _digits.forEach(digit => {
                digit.classList.remove("timer-digit-temp");
                digit.removeEventListener("click", _selectDigits);
            });
            
            document.removeEventListener("keydown", _replaceDigits);
            _digits.forEach(d => d.classList.remove("timer-digit-select"));
            _timer_text_con.classList.remove("timer-text-focus");
            
            _timer_focused = false;
            _digit_editing = false;
            
            _checkSeconds();
            _setTime();
        }
    });

    // allows editing of timer when clicking the _digits, also pauses the timer 
    _timer_text_con.addEventListener("click", (e) => {
        if (!_is_paused) {
            _pauseTimer();
        }
        // checks if timer is currently focused
        if (!_timer_focused) {
            _timer_text_con.classList.add("timer-text-focus");
            
            // adds eventlistener for each digit and class for temp _digits.
            _digits.forEach(digit => {
                digit.addEventListener("click", _selectDigits);
                digit.classList.add("timer-digit-temp");
            });
            
            _digit_selection = 3;
            _timer_focused = true;

            _timer_digit_index = _digit_selection;

            document.addEventListener("keydown", _replaceDigits);
        }
    });

    //
    function _selectDigits(e) {
        _digit_editing = true;
        _digit_selection = _digits.indexOf(e.target);

        _timer_digit_index = _digit_selection;

        _digits.forEach((d) => {
            d.classList.remove("timer-digit-select");

            if (_digits.indexOf(d) > _digit_selection) d.classList.remove("timer-digit-temp");
            else d.classList.add("timer-digit-temp");
        });
        
        e.target.classList.add("timer-digit-select");
    }

    function _elapseSession() {
        if (!_elapsed_sessions[current_date]) _elapsed_sessions[current_date] = 1;
        else _elapsed_sessions[current_date]++;
        _elapsed_sessions[current_date] = String(_elapsed_sessions[current_date]);
        
        localStorage.setItem("elapsed_sessions", JSON.stringify(_elapsed_sessions));
    }

    // start/pause button
    _timer_button.addEventListener("click", (e) => {
        if (_is_paused) {
            _startTimer();
            _timer_button.textContent = "Pause";
        }
        else {
            _pauseTimer();
        }
    });


    // skip button
    _skip_button.addEventListener("click", (e) => {
        _endTimer();
    });

    // reset button
    _reset_button.addEventListener("click", (e) => {
        _time = _getNextSequence();
        _pauseTimer();
        _updateTime();
    });


}());

// timer._updateTime();


// xhttp.onload = () => {
//     let data = JSON.parse(this.responseText)
//     console.log(data);
// }