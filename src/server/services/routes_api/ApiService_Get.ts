import { HttpService } from "@rbxts/services";
import {LeaderboardPlayer} from "../../../shared/interfaces/Leaderboard";

const API_URL = "https://backend-1-6no2.onrender.com";
const API_KEY = "hfb5958895dsffsf5fsdfsdf";


export function getLeaderboard(page = 1, size = 10,): LeaderboardPlayer[] | undefined {
  const response = HttpService.RequestAsync({
    Url: `${API_URL}/leaderboard?page=${page}&size=${size}`,
    Method: "GET",
    Headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
  });

  return HttpService.JSONDecode(response.Body) as LeaderboardPlayer[];
}
