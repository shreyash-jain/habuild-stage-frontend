export const addDaysToDate = (newDate, numOfDays) => {
  try {
    const date = new Date(newDate);
    date.setDate(date.getDate() + Number(numOfDays));
    return date;
  } catch (err) {
    console.log(err);
  }
};
