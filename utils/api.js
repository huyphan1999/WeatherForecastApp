export async function getRequest(url, temp) {
  getUrl = temp ? url + `/${temp}` : url;
  console.log('getRequest', getUrl);
  const response = await fetch(getUrl);
  const json = await response.json();
  if (response.ok && json) {
    return json;
  } else {
    let {message} = json;
    throw new Error(message);
  }
}
