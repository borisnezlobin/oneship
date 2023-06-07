import fetch from "node-fetch";
import { parse } from "node-html-parser";

const url = "https://www.santaclaravalleyathleticleague.org/g5-bin/client.cgi?cwellOnly=1&G5statusflag=view&school_id=1&G5genie=1545&search_text=";

var events = []

const getSports = async () => {
    const start = Date.now();
    console.log("LOG: started getting events ");
    const response = await fetch(url)
    const txt = await response.text();
    const root = parse(txt, {
        blockTextElements: {
            script: false, style: false
        }
    });
    const table = root.querySelector("#outer_table")
    var t = table.text.split("\t").join("").split("\n\n\n\n\n\n\n").join("     ");
    var aha = t.split("     ");
    var currentDate = "";
    var currentObj = null;
    for(var i = 0; i < aha.length; i++){
        if(aha[i].trim().length == 0){
            continue;
        }
        const datuhm = aha[i].trim().split("\n")
        if(datuhm.length == 1){ // day name
            if(datuhm[0] == "Palo Alto High School") continue;
            if(currentObj !== null) events.push(currentObj);
            currentDate = datuhm[0];
            currentObj = {
                date: currentDate,
                events: []
            };
            continue;
        }else{
            if(datuhm.length < 6) continue;
            const away = datuhm[4].includes("Away vs.  ");
            const e = {
                eventName: datuhm[0],
                time: datuhm[2].trim(),
                against: datuhm[4].trim().split("Away vs.  ")[away ? 1 : 0].trim(),
                isHomeGame: !away,
                location: datuhm[5],
                date: currentDate,
            }
            if(currentObj == null) continue;
            currentObj.events.push(e);
        }
    }

    console.log("LOG: events length = " + events.length);
    console.log("LOG: finished getting sport events in " + (Date.now() - start) + "ms")
    return events;
}

export { getSports };