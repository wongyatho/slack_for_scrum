const db = require('./models/db');


exports.getPassWeekMondayDate = () => {
    let weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let date = new Date();
    switch (weekDays[date.getDay()]) {
        case 'MON':
            date.setDate(date.getDate() - 7);
            break;
        case 'TUE':
            date.setDate(date.getDate() - 8);
            break;
        case 'WED':
            date.setDate(date.getDate() - 9);
            break;
        case 'THU':
            date.setDate(date.getDate() - 10);
            break;
        case 'FRI':
            date.setDate(date.getDate() - 11);
            break;
        case 'SAT':
            date.setDate(date.getDate() - 12);
            break;
        case 'SUN':
            date.setDate(date.getDate() - 13);
            break;
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};

exports.getPassWeekFridayDate = () => {
    let weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let date = new Date();
    switch (weekDays[date.getDay()]) {
        case 'MON':
            date.setDate(date.getDate() - 3);
            break;
        case 'TUE':
            date.setDate(date.getDate() - 4);
            break;
        case 'WED':
            date.setDate(date.getDate() - 5);
            break;
        case 'THU':
            date.setDate(date.getDate() - 6);
            break;
        case 'FRI':
            date.setDate(date.getDate() - 7);
            break;
        case 'SAT':
            date.setDate(date.getDate() - 8);
            break;
        case 'SUN':
            date.setDate(date.getDate() - 9);
            break;
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};

// exports.getTodayDate = () => {
//     const now = new Date();
//     return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
// }

exports.getCloselyWorkingDate = () => {
    let weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let date = new Date();
    switch (weekDays[date.getDay()]) {
        case 'MON':
            date.setDate(date.getDate() - 3);
            break;
        case 'TUE':
        case 'WED':
        case 'THU':
        case 'FRI':
        case 'SAT':
            date.setDate(date.getDate() - 1);
            break;
        case 'SUN':
            date.setDate(date.getDate() - 2);
            break;
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}