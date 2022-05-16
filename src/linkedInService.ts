const PROXY_CURL_API_KEY = "4bc256d2-baca-4fd2-b8f4-26a1a22601c4";
const API_ENDPOINT = "https://nubela.co/proxycurl/api/v2/linkedin";

export const getLinkedInDataFor = async (userId: string) => {
  const url = new URL(API_ENDPOINT);

  url.searchParams.append("url", `https://www.linkedin.com/in/${userId}`);

  return await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${PROXY_CURL_API_KEY}`
    },
    mode: "no-cors"
  })
    .then((response) => response.json())
    .catch((e) => {
      console.log(e);
    });
};
