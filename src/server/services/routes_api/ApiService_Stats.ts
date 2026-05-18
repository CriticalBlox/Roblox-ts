import { HttpService } from "@rbxts/services";

const API_URL = "https://backend-1-6no2.onrender.com";
const API_KEY = "hfb5958895dsffsf5fsdfsdf";

export function apiPost(path: string, body: object) {
  const response = HttpService.RequestAsync({
    Url: `${API_URL}${path}`,
    Method: "POST",
    Headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    Body: HttpService.JSONEncode(body),
  });

  return HttpService.JSONDecode(response.Body);
}
