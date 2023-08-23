import fetch from "node-fetch";
import { parse } from "node-html-parser";

// const url = "https://www.santaclaravalleyathleticleague.org/g5-bin/client.cgi?cwellOnly=1&G5statusflag=view&school_id=1&G5genie=1545&search_text=";

// var events = []

// const getSports = async () => {
//     const start = Date.now();
//     console.log("LOG: started getting events ");
//     const response = await fetch(url)
//     const txt = await response.text();
//     const root = parse(txt, {
//         blockTextElements: {
//             script: false, style: false
//         }
//     });
//     const table = root.querySelector("#outer_table")
//     var t = table.text.split("\t").join("").split("\n\n\n\n\n\n\n").join("     ");
//     var aha = t.split("     ");
//     var currentDate = "";
//     var currentObj = null;
//     for(var i = 0; i < aha.length; i++){
//         if(aha[i].trim().length == 0){
//             continue;
//         }
//         const datuhm = aha[i].trim().split("\n")
//         if(datuhm.length == 1){ // day name
//             if(datuhm[0] == "Palo Alto High School") continue;
//             if(currentObj !== null) events.push(currentObj);
//             currentDate = datuhm[0];
//             currentObj = {
//                 date: currentDate,
//                 events: []
//             };
//             continue;
//         }else{
//             if(datuhm.length < 6) continue;
//             const away = datuhm[4].includes("Away vs.  ");
//             const e = {
//                 eventName: datuhm[0],
//                 time: datuhm[2].trim(),
//                 against: datuhm[4].trim().split("Away vs.  ")[away ? 1 : 0].trim(),
//                 isHomeGame: !away,
//                 location: datuhm[5],
//                 date: currentDate,
//             }
//             if(currentObj == null) continue;
//             currentObj.events.push(e);
//         }
//     }

//     console.log("LOG: events length = " + events.length);
//     console.log("LOG: finished getting sport events in " + (Date.now() - start) + "ms")
//     return events;
// }

const rootUrl = "https://palyathletics.com/events/";
const events = [];

const getSports = async () => {
    for(var i = 0; i < 2; i++){
        // rootUrl + "mm/yyyy"
        var d = new Date();
        d.setMonth(d.getMonth() + i);
        var url = rootUrl + (d.getMonth() + 1) + "/" + (d.getFullYear());
        console.log("getting sports from " + url + "...");
        const response = await fetch(url)
        const txt = await response.text();
        const root = parse(txt, {
            blockTextElements: {
                script: false, style: false
            }
        });

        const tableValues = root.querySelectorAll("tr.event");

        var currentDay = {
            date: "",
            events: []
        };
        tableValues.forEach((value) => {
            try{
                if(value.attributes.class.trim() !== "event") return;
                var date = value.querySelector("td.date.print-hide").getAttribute("data-event-date");
                var time = value.querySelector("td.start-time").text.trim();
                var team = value.querySelector("td.team").querySelector("a").text.trim();
                var teamLink = value.querySelector("td.team").querySelector("a").getAttribute("href");
                var eventDetails = value.querySelector("td.event-details");
                var opponent = "";
                if(eventDetails.querySelector(".opponent")){
                    opponent = eventDetails.querySelector(".opponent").textContent.trim();
                }else{
                    console.log("no opponent found");
                    console.log(eventDetails);
                }
                var eventName;
                if(eventDetails.querySelector(".event-name")){
                    eventName = eventDetails.querySelector(".event-name").text.trim();
                }else{
                    console.log("no event name found");
                    console.log(eventDetails);
                }

                var locationElement = value.querySelector("td.location");
                var isHomeGame = locationElement.textContent.trim().toLowerCase().includes("home");
                var location = locationElement.textContent.trim().split("\n")[1].trim();
                var result = value.querySelector("td.result").textContent.trim();
                
                const newEvent = {
                    date: date,
                    time: time,
                    team: team,
                    teamLink: teamLink,
                    opponent: opponent,
                    eventName: eventName,
                    isHomeGame: isHomeGame,
                    location: location,
                    result: result
                };

                if(currentDay.date !== date){
                    if(currentDay.date !== ""){
                        events.push(currentDay);
                    }
                    currentDay = {
                        date: date,
                        events: []
                    };
                }
                currentDay.events.push(newEvent);
            }catch(e){
                // console.log(value.childNodes);
                console.log("error: " + e);
                // log line that threw e
                console.log(e.stack.split("\n")[1]);
            };
        });
    }

    return events;
};

export { getSports };