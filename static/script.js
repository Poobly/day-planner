let break_time = "5:00";
let starting_time = "1:03";
let time = starting_time;
let is_paused = true;
timer_string = document.getElementById("timer-string");
timer_string.textContent = time;

document.getElementById("timer-button").addEventListener("click", (e) => {
    let timer_button = e.currentTarget;
    if (is_paused) {
        // console.log(typeof(starting_time), starting_time);
        timer.startTimer(timer_button);
        timer_button.textContent = "Pause";

    }
    else {
        timer.pauseTimer();

    }

});

const timer = (function () {
    let _timer;
    let _timer_button;
    let _minutes = starting_time.slice(0, 2) * 1;
    let _seconds = starting_time.slice(3) * 1;
    let _timer_type = "work";
    const _set_timer_button = (timer_button) => _timer_button = timer_button;

    function startTimer(timer_button) {
        _timer = setInterval(_tick, 1000);
        _set_timer_button(timer_button);
        
        is_paused = false;
    }
    
    function _tick() {
        if (_seconds > 0) {
            _seconds--;
            time = `${_minutes}:${_seconds.toString().padStart(2, "0")}`;
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
                _timer_type = _timer_type == "work" ? "break" : "work"; 
                time = _timer_type == "work" ? starting_time : break_time;
                timer_string.textContent = time;
            }
        }

    }

    function _nextMinute() {
        _minutes--;
        _seconds = 59;
    }
    
    function pauseTimer() {
        clearInterval(_timer);
        _timer_button.textContent = "Start";
        is_paused = true;
    }

    return {
        pauseTimer, 
        startTimer
    }
}());