export async function CreateCsvFromArray(arr) {
  let csvContent = "data:text/csv;charset=utf-8,";

  arr[0] = Object.keys(arr[0]).map((item) => item);

  for (let i = 0; i < arr.length; i++) {
    const val = Object.values(arr[i]).map((item) => {
      if (typeof item !== "string") {
        return item;
      } else {
        try {
          JSON.parse(item);
          return "";
        } catch {
          return item;
        }
      }
    });

    let row = val.join(",");
    csvContent += row + "\r\n";
  }

  var encodedUri = encodeURI(csvContent);
  return window.open(encodedUri);
}
