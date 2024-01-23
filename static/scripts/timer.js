let work_time = "25:00";
let break_time = "05:00";
let long_break_time = "30:00";
let is_paused = true;
let active = false;
let time = work_time;
const timer_string = document.getElementById("timer-string");
const timer_button = document.getElementById("timer-button");
timer_string.textContent = time;
const original_timer_string = timer_string.textContent
let timer_string_index = timer_string.textContent.length;

// unfocuses the editing function
document.addEventListener("mousedown", (e) => {
    if (e.target != timer_string) {
        timer_string.classList.remove("timer-text-focus");
        timer_string.textContent = time;
        timer_string_index = timer_string.textContent.length;
        document.removeEventListener("keydown", replaceDigits);
        active = false;
    }
});

// allows editing of timer when clicking the digits, also pauses the timer.
timer_string.addEventListener("click", (e) => {
    if (!is_paused) {
        timer.pauseTimer();
    }
    
    if (!active) {
        timer_string.classList.add("timer-text-focus");
        active = true;

        document.addEventListener("keydown", replaceDigits);
    }
});

// replaces the timer digits
function replaceDigits(e) {
    let new_digits = timer_string.textContent;
    if (isFinite(e.key)) {
        console.log(timer_string_index, original_timer_string.length)
        if (timer_string_index === 0) {
            timer_string_index = original_timer_string.length;
        }
        else if (timer_string_index === original_timer_string.length) {
            new_digits = "00:00";
        }

        timer_string_index--;
        if (timer_string.textContent.substring(timer_string_index + 1, timer_string_index) === ":") {
            timer_string_index--;
        }
        new_digits = new_digits.substring(0, timer_string_index) + e.key + new_digits.substring(timer_string_index + 1, timer_string.length);
        

        time = new_digits;
        timer_string.textContent = new_digits;
    } 
}

timer_button.addEventListener("click", (e) => {
    if (is_paused) {
        timer.startTimer();
        timer_button.textContent = "Pause";
    }
    else {
        timer.pauseTimer();
    }
});

const timer = (function () {
    let _counter = 1;
    let _timer;
    let _minutes = time.slice(0, time.indexOf(":")) * 1;
    let _seconds = time.slice(3) * 1;
    let _timer_type = "work";

    function startTimer() {
        _minutes = time.slice(0, time.indexOf(":")) * 1;
        _seconds = time.slice(3) * 1;

        _timer = setInterval(_tick, 1000);
        is_paused = false;
    }

    function _tick() {
        if (_seconds > 0) {
            _seconds--;
            time = `${_minutes.toString().padStart(2, "0")}:${_seconds.toString().padStart(2, "0")}`;
            timer_string.textContent = time;
        }
        else {
            if (_minutes > 0) {
                _nextMinute();
                time = `${_minutes}:${_seconds}`;
                timer_string.textContent = time;
            }
            else {
                pauseTimer();
                _timer_type = _timer_type === "work" ? (_counter === 4 ? "long break" : "break") : "work";
                time = _getTime(_timer_type);
                _setTime(time);

                if (_counter === 4) _counter = 0;
                if (_timer_type === "work") _counter++;
                timer_string.textContent = time;
            }
        }
    }

    // sets the next minute
    function _nextMinute() {
        _minutes--;
        _seconds = 59;
    }
    
    // gets the correct time for current timer sequence
    function _getTime(_timer_type) {
        switch (_timer_type) {
            case "work":
                return work_time;
            case "break":
                return break_time;
            case "long break":
                return long_break_time;
        }
    }

    function _setTime(time) {
        _minutes = time.slice(0, time.indexOf(":")) * 1;
        _seconds = time.slice(3) * 1;
        time = `${_minutes.toString().padStart(2, "0")}:${_seconds.toString().padStart(2, "0")}`;
    }

    function pauseTimer() {
        clearInterval(_timer);
        timer_button.textContent = "Start";
        is_paused = true;
    }

    return {
        pauseTimer, 
        startTimer
    }
}());