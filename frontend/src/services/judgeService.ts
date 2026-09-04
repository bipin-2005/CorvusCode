import axios from "axios";
import { getToken } from "./token";

export interface JudgeRequest {
  language: "JAVA" | "PYTHON" | "CPP";
  sourceCode: string;
  stdin: string;
}

export interface JudgeResponse {
  status: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  executionTime: number;
  memory: number;
}

const judgeApi = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

judgeApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function executeCode(
  request: JudgeRequest
): Promise<JudgeResponse> {
  const response = await judgeApi.post<JudgeResponse>(
    "/judge/run",
    request
  );

  return response.data;
}