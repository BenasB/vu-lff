import CONSTANTS from "./constants";

// Gets real time string (beware of timezones)
const getTimeString: (date: Date) => string = (date) => {
  return date.toLocaleTimeString(CONSTANTS.LOCALE, {hour: '2-digit', minute:'2-digit'});
}

export default getTimeString;