let work_time = "00:01";
let time = work_time;
let break_time = "00:01";
let long_break_time = "00:03";
let is_paused = true;
const timer_string = document.getElementById("timer-string");
const timer_button = document.getElementById("timer-button");
timer_string.textContent = time;

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
    let _minutes = work_time.slice(0, work_time.indexOf(":")) * 1;
    let _seconds = work_time.slice(3) * 1;
    let _timer_type = "work";

    function startTimer() {
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