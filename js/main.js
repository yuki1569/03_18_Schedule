function generate_year_range(start, end) {
  var years = "";
  for (var year = start; year <= end; year++) {
    years += "<option value='" + year + "'>" + year + "</option>";
  }
  return years;
}

var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();
var selectYear = document.getElementById("year");
var selectMonth = document.getElementById("month");

var createYear = generate_year_range(1970, 2200);

document.getElementById("year").innerHTML = createYear;

var calendar = document.getElementById("calendar");
var lang = calendar.getAttribute('data-lang');

var months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
var days = ["日", "月", "火", "水", "木", "金", "土"];

var dayHeader = "<tr>";
for (day in days) {
  dayHeader += "<th data-days='" + days[day] + "'>" + days[day] + "</th>";
}
dayHeader += "</tr>";

document.getElementById("thead-month").innerHTML = dayHeader;

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);




function next() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
  daycolumnGenerate();
  button_color_change();
  chack();
  changecolor();
  clear();

}

function previous() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
  daycolumnGenerate();
  button_color_change();
  chack();
  changecolor();
  clear();

}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);
  showCalendar(currentMonth, currentYear);
  daycolumnGenerate();
  button_color_change();
  chack();
  changecolor();
  clear();

}

function today_button() {
  showCalendar(today.getMonth(), today.getFullYear());
  console.log(today.getFullYear());
  console.log();
  daycolumnGenerate(today.getMonth());
  chack();
}

function showCalendar(month, year) {

  var firstDay = (new Date(year, month)).getDay();

  tbl = document.getElementById("calendar-body");

  tbl.innerHTML = "";

  monthAndYear.innerHTML = months[month] + " " + year;
  selectYear.value = year;
  selectMonth.value = month;

  // creating all cells
  var date = 1;
  for (var i = 0; i < 6; i++) {
    var row = document.createElement("tr");

    for (var j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement("td");
        cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth(month, year)) {
        break;
      } else {
        cell = document.createElement("td");
        cell.setAttribute("data-date", date);
        cell.setAttribute("data-month", month + 1);
        cell.setAttribute("data-year", year);
        cell.setAttribute("data-month_name", months[month]);
        cell.className = "date-picker";
        cell.innerHTML = "<span>" + date + "</span>";

        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
          cell.className = "date-picker selected";
        }
        row.appendChild(cell);
        date++;
      }
    }

    tbl.appendChild(row);

  }

}

function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(".today").on('click', function () {
  today_button();
});


var colorchoice = "white";
// var element = document.getElementById("target");
// $().checked

// $('input:radio[name="color"]').change(function () {
//   const choicecolor = $('input:radio[name="color"]:checked').val();
//   colorchoice = choicecolor;
// });
function button_color_change() {
  $('.button').on('click', function () {
    const choicecolor = $(this).data("value");
    colorchoice = choicecolor;
  });
}
delete_schedule();
function delete_schedule() {
  $(".delete").on('click', function () {
    colorchoice = $(this).data("value");

  });
}

let scheduletitle = {
  slategray: ["a"],
  royalblue: ["b"],
  seagreen: ["c"],
  khaki: ["d"],
  deeppink: ["d"],
  purple: ["タスクあり"]
};
let schedulecolumn = {
  slategray: [""],
  royalblue: [""],
  seagreen: [""],
  khaki: [""],
  deeppink: [""],
  purple: ["a"],
};


//localStorageからscheduleを読み出し
function localStorageget_schedule() {
  if (localStorage.getItem("schedule")) {
    const jsonData_schedule = localStorage.getItem("schedule");
    const data_schedule = JSON.parse(jsonData_schedule);
    Object.keys(schedulecolumn).forEach(keycolor => {
      schedulecolumn[keycolor] = data_schedule[keycolor];
    })
  }
  if (localStorage.getItem("scheduletitle")) {
    const jsonData_scheduletitle = localStorage.getItem("scheduletitle");
    const data_scheduletitle = JSON.parse(jsonData_scheduletitle);
    console.log(data_scheduletitle);
    Object.keys(scheduletitle).forEach(keycolor => {
      scheduletitle[keycolor] = data_scheduletitle[keycolor];
    })
  }
}
function localStorageget_target() {
  if (localStorage.getItem("target")) {
    const jsonData_target = localStorage.getItem("target");
    const data_target = JSON.parse(jsonData_target);
    $("#target").append(data_target);
  }
}
console.log(schedulecolumn[colorchoice]);




let daycolumn = [];


//(検証)tdのdata-date属性の値に応じてcssを適用 
// let number = 5
// $(`td[data-date='${number}']`).css("background-color", "red");


//htmlに表示されている日付をdaycolumn配列にpushする（更新されるごとに）
function daycolumnGenerate() {
  daycolumn = [];
  for (let i = 1; i <= 31; i++) {
    let D = i;
    daycolumn.push(`${getyear_monthAndYear()}${getmonth_monthAndYear()}${D}`);
  }
  console.log(daycolumn);
}

daycolumnGenerate();



//daycolumn配列とschedulecolumn配列（スケジュール）の照合をする関数trueは設定したスケジュールが入る
function chack() {

  // localStorageget_schedule();
  Object.keys(schedulecolumn).forEach(keycolor => {
    daycolumn.forEach(col => {
      //オブジェクトのキー名を変数で表示する場合は[]を使う！
      try {
        if (schedulecolumn[keycolor].includes(col)) {
          //下記はtd内の属性data-dateの数字でセレクトしている
          //daycolumnの文字列に応じて抽出する数字の桁数を分岐する

          if (col.length == 7) {
            let td_length7 = $(`td[data-date='${col.substr(6, 1)}'`);
            //セレクターを変数にした場合は子要素はfindでセレクトできる
            let A = $(td_length7).find("p").textContent;
            console.log(A);
            $(td_length7).append(`<br><p></p>`);
            $(td_length7).find("p:empty")
              .append(`${scheduletitle[keycolor][0]}`)
              .css({ "background-color": `${keycolor}`, "margin": "0", "font-size": "6px" });
          } else if (col.length == 8) {
            let td_length8 = $(`td[data-date='${col.substr(6, 2)}'`);
            // let RGB = new RGBColor(`${keycolor}`);
            // let keycolor_rgb = `rgb(${RGB.r}, ${RGB.g}, ${RGB.b})`
            $(td_length8).append(`<br><p></p>`);
            $(td_length8).find("p:empty")
              .append(`${scheduletitle[keycolor][0]}`)
              .css({ "background-color": `${keycolor}`, "margin": "0", "font-size": "6px" });
          }

        }

      }
      catch (e) {
        console.log("error");
      }
    });
  })//オブジェクトObject.keys(schedulecolumn).forEachはここまで


}




//htmlに表示されている月の文字列を取得
function getmonth_monthAndYear() {
  let monthtext = $("#monthAndYear").text();
  let M;
  if (monthtext.substr(1, 1) == "月") {
    M = "0" + monthtext.substr(0, 1);
  } else {
    M = monthtext.substr(0, 2);
  }
  return M;
}
//htmlに表示されている年の文字列を取得
function getyear_monthAndYear() {
  let yeartext = $("#monthAndYear").text();
  let Y;
  if (yeartext.length == 8) {
    Y = yeartext.substr(4, 4);
  } else {
    Y = yeartext.substr(3, 4);
  }
  return Y;
}



//カレンダー上のひにちをクリックすると色が変わってデータがローカルにたまる
function changecolor() {
  $("td").on("click", function () {
    var getdate = this.getAttribute("data-date");
    var getmonth = this.getAttribute("data-month");
    if (getmonth < 10) {
      getmonth = "0" + getmonth;
    }
    var getyear = this.getAttribute("data-year");
    var day = (`${getyear}${getmonth}${getdate}`);

    //deleteボタン＝colorchoice =white この時は削除機能
    if (colorchoice == "white") {

      Object.keys(schedulecolumn).forEach(keycolor => {
        schedulecolumn[keycolor] = schedulecolumn[keycolor].filter(function (a) {
          return a != day;
        });
      })
      const jsonData = JSON.stringify(schedulecolumn);
      localStorage.setItem("schedule", jsonData);
      console.log(schedulecolumn.pink);
      $(this).find("p,br").remove();
    } else {
      console.log(day);
      try {
        schedulecolumn[colorchoice].push(day);
        const jsonData = JSON.stringify(schedulecolumn);
        localStorage.setItem("schedule", jsonData);

        if ($(this).find("p").is(`:contains(${scheduletitle[colorchoice][0]})`)) {
        } else {
          $(this).append(`<br><p>${scheduletitle[colorchoice][0]}</p>`);
          $(this).find("p:last-child")
            .css({ "background-color": `${colorchoice}`, "margin": "0", "font-size": "6px" });
        }
      } catch (e) {
        console.log("error changecolor()");
      }

    }

  });
}

//スケジュールボタン追加
add();
function add() {
  $("#add").on("click", function () {
    location.reload();
    let color = $("input[name='color']:checked").val();
    let title = $(".form-control").val();
    console.log(color)
    schedulecolumn[color] = [];
    scheduletitle[color] = [];
    schedulecolumn[color].push("");
    scheduletitle[color].push(`${title}`);

    const json_scheduletitle = JSON.stringify(scheduletitle);
    localStorage.setItem("scheduletitle", json_scheduletitle);

    console.log(schedulecolumn);
    console.log(scheduletitle);
    $("#target").append(`<a class="button list-group-item list-group-item-action" data-value="${color}" style="background-color:${color}; border-radius:0; color: #fff;"> ${title} </a>`);
    //サイドバー(target)のhtml情報をlocalstrageへ
    const Json_target = JSON.stringify($("#target").html());
    localStorage.setItem("target", Json_target);

    // scheduletitle
  });
}


function clear() {
  $(".a").on("click", function () {
    localStorage.clear();
    localStorageget_schedule();
    location.reload();

    daycolumnGenerate();
    Object.keys(schedulecolumn).forEach(keycolor => {
      schedulecolumn[keycolor] = [];
    })
    //カレンダー上で見えているスケジュールをremove
    daycolumn.forEach(col => {
      if (col.length == 7) {
        $(`td[data-date='${col.substr(6, 1)}'] p`).remove();
      } else if (col.length == 8) {
        $(`td[data-date='${col.substr(6, 2)}'] p`).remove();
      }
    });
    chack();
  });

}
localStorageget_target();
localStorageget_schedule();

changecolor();
chack();
clear();
button_color_change();


//tab２のJS
addtask();
console.log(scheduletitle);
console.log(schedulecolumn);


//タスクデータを呼ぶとき
function addtask() {
  $(".submit-button").on("click", function () {
    let title = $(".task-title").val();
    let contents = $(".task-contents").val();
    let deadline = $(".task-deadline").val();
    //タスク追加
    document.querySelector('.task-container').innerHTML += `<li class="container-fluid shadow p-2 mb-2 row" style="background-color: #fff;">
          <div class="col-3">
            <p style="line-height: 39px; margin-bottom: 0;">${title}</p>
          </div>
          <div class="col-6">
            <p style="line-height: 39px; margin-bottom: 0;">${contents}</p>
          </div>
          <div class="col-2">
            <p style="line-height: 39px; margin-bottom: 0;">${deadline}</p>
          </div>
          <div class="delete-task col-1">
            <i class="far fa-trash-alt delete" style="line-height: 39px; padding: 0; margin: 0;"></i>
          </div>
        </li>`;
    console.log(schedulecolumn.purple);
    schedulecolumn.purple.push(deadline);
    const jsonData = JSON.stringify(schedulecolumn);
    localStorage.setItem("schedule", jsonData);
    $(".task-title").val('');
    $(".task-contents").val('');
    $(".task-deadline").val('');
    console.log(`${$(".task-container").html()}`);
    localStorage.setItem("taskdata", $(".task-container").html());
  });
}

if (localStorage.getItem("taskdata")) {
  const taskjsonData = localStorage.getItem("taskdata");
  // const dataT = JSON.parse(taskjsonData);
  console.log(taskjsonData);
  $(".task-container").append(taskjsonData);
}


const localStorageset_task = 

//以下イベントはhttps://lucklog.info/jqeury-on-no-event/
// を参照
$("body").on('click', ".delete-task", function () { 
  $(this).parent().remove();
  localStorage.setItem("taskdata", $(".task-container").html());
  // var deadline = $()

});
// document.querySelector(".task-container").addEventListener('click', e => {
//   if (e.target.classList.contains('delete-task')) {
//     e.target.parentElement.remove();
//   }
// });





// //1.Save クリックイベント
// $(".submit-button").on("click", function () {
//   const data = {
//     title: $("#input").val(),
//     text: $("#text_area").val(),
//   };
//   const jsonData = JSON.stringify(data);
//   localStorage.setItem("memo", jsonData);
// });

// //2.clear クリックイベント
// $("#clear").on('click', function () {
//   localStorage.clear();
//   $("#text_area,input").val('');

// });

// //3.ページ読み込み：保存データ取得表示
// if (localStorage.getItem("memo")) {
//   const jsonData = localStorage.getItem("memo");
//   const data = JSON.parse(jsonData);
//   $("#input").val(data.title);
//   $("#text_area").val(data.text);
// }


// const block = `<div class="row">
//     <div class="col-3">
//     <p style="line-height: 39px; margin-bottom: 0;"></p>
//     </div>
//     <div class="col-8">
//     <p style="line-height: 39px; margin-bottom: 0;">$</p>
//     </div>
//     <div class="col-1" id="delete-task">
//     <i class="far fa-trash-alt delete" style="line-height: 39px; padding: 0; margin: 0;"></i>
//     </div>
//     </div>`;

// const localDATA = {
//   key1: block,
//   key2: block,
//   key3: block
// }

// console.log(localDATA)





//カラーコード（色名から16進数）
// function colourNameToHex(colour) {
//   var colours = {
//     "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "Azure": "#f0ffff",
//     "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
//     "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
//     "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
//     "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
//     "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
//     "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "Fuchsia": "#ff00ff",
//     "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
//     "honeydew": "#f0fff0", "hotpink": "#ff69b4",
//     "indianred ": "#cd5c5c", "Indigo": "#4b0082", "ivory": "#fffff0", "Khaki": "#f0e68c",
//     "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
//     "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
//     "lightyellow": "#ffffe0", "Lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
//     "Magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
//     "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
//     "navajowhite": "#ffdead", "navy": "#000080",
//     "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
//     "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "Plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
//     "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
//     "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
//     "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
//     "Violet": "#ee82ee",
//     "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
//     "yellow": "#ffff00", "yellowgreen": "#9acd32"
//   };

//   if (typeof colours[colour.toLowerCase()] != 'undefined')
//     return colours[colour.toLowerCase()];

//   return false;
// }


