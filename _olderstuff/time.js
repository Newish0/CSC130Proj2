


function dayOfWeekStringToDayNumber(dayOfWeekString) {
    const dayOfWeek = {
        "monday": 1,
        "tuesday": 2,
        "wednesday": 3,
        "thursday": 4,
        "friday": 5,
        "saturday": 6,
        "sunday": 7,
    }

    dayOfWeekString = dayOfWeekString.toLowerCase();

    return dayOfWeek[dayOfWeekString];
}



/**
 * Get the number of miliseconds between two day of 
 * the week and time of the week. 
 * i.e. A is the current time, B is a later time.
 * 
 * @param {String} dayOfWeekA  in the format monday tuesday etc...
 * @param {String} timeA in the format hh:mm:ss
 * @param {String} dayOfWeekB in the format monday tuesday etc...
 * @param {String} timeB in the format hh:mm:ss
 * @returns {Numberr} miliseconds between two time of the week.
 */
function compareTwoDayOfWeekTime(dayOfWeekA, timeA, dayOfWeekB, timeB) {
    let dowA = dayOfWeekStringToDayNumber(dayOfWeekA);
    let dowB = dayOfWeekStringToDayNumber(dayOfWeekB);
    let timeSplitA = timeA.split(":");
    let timeSplitB = timeB.split(":");
    let hourA = parseInt(timeSplitA[0]);
    let hourB = parseInt(timeSplitB[0]);
    let minuteA = parseInt(timeSplitA[1]);
    let minuteB = parseInt(timeSplitB[1]);
    let secA = parseInt(timeSplitA[2]);
    let secB = parseInt(timeSplitB[2]);

    if(dowA === dowB) {

    } else {
        let dayDiff = Math.abs(dowB - dowA);
        let hourDiff = Math.abs(hourB - hourA);
        let minuteDiff = Math.abs(minuteB - minuteA);
        let secDiff = Math.abs(secB - secA);

        // TODO 
        // Oops huge mistake does not work like this!!!!

        return dayDiff * 24 * 60 * 60 + hourDiff * 60 * 60 + minuteDiff * 60 + secDiff;
    }

}