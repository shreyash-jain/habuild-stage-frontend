export async function CreateCsvFromArray(arr, downloadedFileName) {
  let csvContent = "data:text/csv;charset=utf-8,";

  arr[0] = Object.keys(arr[0]).map((item) => item);

  for (let i = 0; i < arr.length; i++) {
    const val = Object.values(arr[i]).map((item) => {
      if (typeof item !== "string") {
        return item;
      } else {
        try {
          const result = JSON.parse(item);
          return result;
        } catch {
          return item;
        }
      }
    });

    let row = val.join(",");
    csvContent += row + "\r\n";
  }

  var encodedUri = encodeURI(csvContent);

  if (typeof window !== "undefined") {
    const downloadLink = document.createElement("a");
    const a = document.createAttribute("href");
    const b = document.createAttribute("download");
    a.value = encodedUri;
    b.value = downloadedFileName || "CSV Export";
    downloadLink.setAttributeNode(a);
    downloadLink.setAttributeNode(b);

    downloadLink.click();
  }
}
