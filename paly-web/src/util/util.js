const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const formatDate = (date, includeYear, includeTime) => {
    var date1 = new Date(date);
    var s = months[date1.getMonth()] + " " + date1.getDate();
    if(includeYear){
        s += " " + date1.getFullYear();
    }
    if(includeTime){
        s += " at " + date1.getHours() + ":";
        if(date1.getMinutes() < 10) s += "0";
        s += date1.getMinutes();
    }
    return s;
}

export {
    formatDate
}