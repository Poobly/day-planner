// WIP
// Create calendar
// Display events from backend or from local storage
// 

const current_date = new Date;
const year = current_date.getFullYear(); 

let date = new Date(year, 0, 1);

while (date.getFullYear() === year) {


    console.log(date);
    date.setDate(date.getDate() + 1);
}
