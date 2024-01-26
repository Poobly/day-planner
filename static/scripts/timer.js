const timer_button = document.getElementById("timer-button");
const timer_text_con = document.getElementById("timer-text-con");
const digits = Array.from(document.querySelectorAll(".timer-digit"));
let is_paused = true;
let timer_focused = false;
let digit_focused = false;
let time = digits.map(digit => digit.textContent);
let digit_selection;

let work_time = "2500";
let break_time = "0500";
let long_break_time = "3000";

let timer_digit_index = time.length;

const timer = (function () {
    let _counter = 1;
    let _timer;
    let _minutes = (time[0] + time[1]) * 1;
    let _seconds = (time[2] + time[3]) * 1;
    let _timer_type = "work";

    function startTimer() {
        _timer = setInterval(_tick, 1000);
        is_paused = false;
    }

    function _tick() {
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
                pauseTimer();
                _timer_type = _timer_type === "work" ? (_counter === 4 ? "long break" : "break") : "work";
                time = _getNextSequence(_timer_type);
                
                updateTime();

                if (_counter === 4) _counter = 0;
                if (_timer_type === "work") _counter++;

            }
        }
    }

    // sets the next minute
    function _nextMinute() {
        _minutes--;
        _seconds = 59;
    }

    function _nextSecond() {
        _seconds--;
    }
    
    // gets the correct time for current timer sequence
    function _getNextSequence(_timer_type) {
        switch (_timer_type) {
            case "work":
                return work_time;
            case "break":
                return break_time;
            case "long break":
                return long_break_time;
        }
    }

    function updateTime() {
        _minutes = (time[0] + time[1]) * 1;
        _seconds = (time[2] + time[3]) * 1;

        _setTime();
    }

    function _setTime() {
        time = `${_minutes.toString().padStart(2, "0")}${_seconds.toString().padStart(2, "0")}`;
        digits[0].textContent = time[0]
        digits[1].textContent = time[1]
        digits[2].textContent = time[2]
        digits[3].textContent = time[3]
    }

    function pauseTimer() {
        clearInterval(_timer);
        timer_button.textContent = "Start";
        is_paused = true;
    }

    function checkSeconds() {
        if (_seconds >= 60) {
            _minutes += Math.floor(_seconds / 60);
            _seconds = _seconds % 60;
            _setTime();
        }
    }



    // replaces the timer digits
    function replaceDigits(e) {

        if (isFinite(e.key)) {
            if (timer_digit_index === 0) {
                timer_digit_index = time.length;
            }
            // else if (timer_digit_index === time.length) {
            //     time = "0000";
            // }
            // console.log(); 
            if (digit_selection < 3 && digit_focused) {
                time = time.substring(0, digit_selection) + e.key + time.substring(digit_selection + 1);
                digits[digit_selection].classList.remove("timer-digit-temp");
                digit_focused = false;
            }
            else {
                time = time.substring(1);
                time = time.substring(0, digit_selection) + e.key + time.substring(digit_selection);
                timer_digit_index--;
                digits[timer_digit_index].classList.remove("timer-digit-temp");
            }
            console.log(time);


            updateTime();
        } 
    }

    return {      
        pauseTimer, 
        startTimer,
        replaceDigits,
        updateTime,
        checkSeconds
    }
}());

timer.updateTime();


// unfocuses the editing function
document.addEventListener("mousedown", (e) => {
    if (!timer_text_con.contains(e.target)) {
        digits.forEach(element => element.classList.remove("timer-digit-temp"));

        timer_text_con.classList.remove("timer-text-focus");
        timer.checkSeconds();
        timer_digit_index = digit_selection;
        document.removeEventListener("keydown", timer.replaceDigits);
        timer_focused = false;

        digits.forEach(d => d.classList.remove("timer-digit-select"));
        digit_focused = false;

    }
});

// allows editing of timer when clicking the digits, also pauses the timer.
timer_text_con.addEventListener("click", (e) => {
    if (!is_paused) {
        timer.pauseTimer();
    }
    
    if (!timer_focused) {
        timer_text_con.classList.add("timer-text-focus");
        timer_focused = true;
        digit_selection = 3;
        digits.forEach(digit => {
            digit.classList.add("timer-digit-temp");
            digit.addEventListener("click", (e) => {
                if (digit_focused) {
                    digits.forEach(d => d.classList.remove("timer-digit-select"));
                }
                digit.classList.add("timer-digit-select");
                digit_selection = digits.indexOf(digit);
                digit_focused = true;

            });
        });
        // timer_digit_index = digit_selection;
        document.addEventListener("keydown", timer.replaceDigits);
    }
});



timer_button.addEventListener("click", (e) => {
    if (is_paused) {
        timer.startTimer();
        timer_button.textContent = "Pause";
    }
    else {
        timer.pauseTimer();
    }
});

