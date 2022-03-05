console.log('hi');
var start=(possdate)=>{
    const today = new Date();
    var daylist = [];
    console.log(possdate);
    function clickfunc(id){
    var nwdate_el = document.getElementById(id);
    var child = nwdate_el.childNodes;
    var check_vis;
    for(var i=0;i<child.length;i++){
        if(child[i].className=="check"){
        check_vis = child[i];
        }
    }

    var ind = daylist.indexOf(id);
    if(ind<0){
        daylist.push(id);
        check_vis.style.visibility='visible';
    }
    else{
        daylist.splice(ind,1);
        check_vis.style.visibility='hidden';

    }

    console.log(id);
    }

    const setCalendarData = (year, month) => {
    let calHtml = "";
    const setDate = new Date(year, month - 1, 1);
    const firstDay = setDate.getDate();
    const firstDayName = setDate.getDay();
    const lastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    ).getDate();
    const prevLastDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
    ).getDate();

    let startDayCount = 1;
    let lastDayCount = 1;
    month = parseInt(month);
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
        if (i == 0 && j < firstDayName) {
            if (j == 0) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#FFB3BB;' id='${(month-2)%12+1}_${(prevLastDay - (firstDayName - 1) + j)}' onclick='clickfunc(this.id)'  class='calendar__day horizontalGutter'><span>${(month-2)%12+1}asdf/${(prevLastDay - (firstDayName - 1) + j)}</span><span class='check'></span></div>`;
            } else if (j == 6) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#FFB3BB;' id='${(month-2)%12+1}_${(prevLastDay - (firstDayName - 1) + j)}' onclick='clickfunc(this.id)' class='calendar__day'><span>${(month-2)%12+1}/${(prevLastDay - (firstDayName - 1) + j)}</span><span class='check'></span></div>`;
            } else {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#FFB3BB;' id='${(month-2)%12+1}_${(prevLastDay - (firstDayName - 1) + j)}' onclick='clickfunc(this.id)' class='calendar__day horizontalGutter'><span>${(month-2)%12+1}/${(prevLastDay - (firstDayName - 1) + j)}</span><span class='check'></span></div>`;
            }
        }
        else if (i == 0 && j == firstDayName) {
            if (j == 0) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#FFE0BB;' id='${month}_${startDayCount}' onclick='clickfunc(this.id)' class='calendar__day horizontalGutter'><span>${month}/${startDayCount++}</span><span class='check'></span></div>`;
            } else if (j == 6) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#FFE0BB;' id='${month}_${startDayCount}' onclick='clickfunc(this.id)' class='calendar__day'><span>${month}/${startDayCount++}</span><span class='check'></span></div>`;
            } else {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#FFE0BB;' id='${month}_${startDayCount}' onclick='clickfunc(this.id)' class='calendar__day horizontalGutter'><span>${month+1-1}/${startDayCount++}</span><span class='check'></span></div>`;
            }
        }
        else if (i == 0 && j > firstDayName) {
            if (j == 0) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#FFFFBB' id='${month}_${startDayCount}' onclick='clickfunc(this.id)' class='calendar__day horizontalGutter'><span>${month}/${startDayCount++}</span><span class='check'></span></div>`;
            } else if (j == 6) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#FFFFBB' id='${month}_${startDayCount}' onclick='clickfunc(this.id)' class='calendar__day'><span>${month}/${startDayCount++}</span><span class='check'></span></div>`;
            } else {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#FFFFBB' id='${month}_${startDayCount}' onclick='clickfunc(this.id)' class='calendar__day horizontalGutter'><span>${month}/${startDayCount++}</span><span class='check'></span></div>`;
            }
        }
        else if (i > 0 && startDayCount <= lastDay) {
            if (j == 0) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#BBFFC9;' id='${month}_${startDayCount}' onclick='clickfunc(this.id)' class='calendar__day horizontalGutter verticalGutter'><span>${month}/${startDayCount++}</span><span class='check'></span></div>`;
            } else if (j == 6) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#BBFFC9;' id='${month}_${startDayCount}' onclick='clickfunc(this.id)' class='calendar__day verticalGutter'><span>${month}/${startDayCount++}</span><span class='check'></span></div>`;
            } else {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#BBFFC9;' id='${month}_${startDayCount}' onclick='clickfunc(this.id)' class='calendar__day horizontalGutter verticalGutter'><span>${month}/${startDayCount++}</span><span class='check'></span></div>`;
            }
        }
        else if (startDayCount > lastDay) {
            if (j == 0) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#B9E1FF;' id='${(month)%12+1}_${lastDayCount}' onclick='clickfunc(this.id)' class='calendar__day horizontalGutter verticalGutter'><span>${(month)%12+1}/${lastDayCount++}</span><span class='check'></span></div>`;
            } else if (j == 6) {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#B9E1FF;' id='${(month)%12+1}_${lastDayCount}' onclick='clickfunc(this.id)' class='calendar__day verticalGutter'><span>${(month)%12+1}/${lastDayCount++}</span><span class='check'></span></div>`;
            } else {
            // 스타일링을 위한 클래스 추가
            calHtml +=
                `<div style='background-color:#B9E1FF;' id='${(month)%12+1}_${lastDayCount}' onclick='clickfunc(this.id)' class='calendar__day horizontalGutter verticalGutter'><span>${(month)%12+1}/${lastDayCount++}</span><span class='check'></span></div>`;
            }
        }
        }
    }
    document
        .querySelector("#calendar")
        .insertAdjacentHTML("beforeend", calHtml);
    };

    const setFixDayCount = number => {
    let fixNum = "";
    if (number < 10) {
        fixNum = "0" + number;
    } else {
        fixNum = number;
    }
    return fixNum;
    };

    if (today.getMonth() + 1 < 10) {
    setCalendarData(today.getFullYear(), "0" + (today.getMonth() + 1));
    } else {
    setCalendarData(today.getFullYear(), "" + (today.getMonth() + 1));
    }
}

fetch('./possdate.json')
.then(response => response.json())
.then(data => start(data))
.catch(error => console.log(error));
