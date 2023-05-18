/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getHours(d) {
  const hours = d.getHours() == 0 ? "12" : d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
  const minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  const ampm = d.getHours() < 12 ? " AM" : " PM";
  const formattedTime = `${hours}:${minutes} ${ampm}`;
  return formattedTime;
}
export const getFormattedDate = (date, address = true) => {
  const d = new Date(date);
  const dayName = days[d.getDay()];
  const dayMonth = d.getDate();
  const monthName = month[d.getMonth()];
  const yaer = d.getFullYear();
  return address
    ? `${dayName}, ${monthName} ${dayMonth}, ${yaer}, ${getHours(d)} UTC`
    : `${dayName}, ${monthName} ${dayMonth}, ${yaer} | ${getHours(d)} UTC`;
};
export const getFormattedDateTweets = (date) => {
  const d = new Date(date);
  const dayName = days[d.getDay()];
  const dayMonth = d.getDate();
  const monthName = month[d.getMonth()];
  const yaer = d.getFullYear();
  return `${getHours(d)}, ${monthName} ${dayMonth}, ${yaer}`;
};

export const twitterAPIURL = (twitterIDs) => {
  let ids = "";
  twitterIDs.forEach((id, idx) => {
    if (idx < twitterIDs.length - 1) {
      ids += `${id},`;
    } else {
      ids += `${id}`;
    }
  });
  return `https://api.twitter.com/2/tweets?ids=${ids}&tweet.fields=attachments,author_id,created_at,entities&expansions=attachments.media_keys,author_id&media.fields=alt_text,duration_ms,media_key,preview_image_url,type,url,variants&user.fields=name,profile_image_url,username`;
};
