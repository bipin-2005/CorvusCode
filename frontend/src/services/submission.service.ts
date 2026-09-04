import axios from "axios";
import { getToken } from "./token";

export type SubmissionStatus =
  | "PENDING"
  | "RUNNING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED";

export type SubmissionType = "RUN" | "SUBMIT";

export type ProgrammingLanguage =
  | "JAVA"
  | "PYTHON"
  | "CPP"
  | "JAVASCRIPT"
  | "C"
  | "CSHARP"
  | "GO"
  | "KOTLIN"
  | "SWIFT"
  | "RUST";

export type Difficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

/* =========================================
   SUBMISSION
========================================= */

export interface Submission {
  id: number;

  sourceCode: string;

  language: ProgrammingLanguage;

  status: SubmissionStatus;

  type: SubmissionType;

  executionTime: number | null;

  memory: number | null;

  submittedAt: string;

  problemId: number;

  problemTitle: string;

  problemDifficulty: Difficulty;

  userId: number;

  passedTestCases: number;

  totalTestCases: number;

  // Contest ID if this submission
  // was made inside a contest
  contestId?: number | null;
}


/* =========================================
   SUBMISSION RESULT
========================================= */

export interface SubmissionResult {
  submissionId: number;

  status: SubmissionStatus;

  executionTime: number | null;

  memory: number | null;

  compileOutput: string | null;

  standardOutput: string | null;

  standardError: string | null;
}


/* =========================================
   SUBMISSION TEST RESULT
========================================= */

export interface SubmissionTestResult {
  id: number;

  submissionId: number;

  testCaseId: number;

  status: SubmissionStatus;

  passed: boolean;

  expectedOutput: string;

  actualOutput: string;

  executionTime: number | null;

  memory: number | null;
}


/* =========================================
   AXIOS INSTANCE
========================================= */

const submissionApi = axios.create({
  baseURL: "http://localhost:8080/api",

  headers: {
    "Content-Type": "application/json",
  },
});


/* =========================================
   REQUEST INTERCEPTOR
========================================= */

submissionApi.interceptors.request.use((config) => {

  const token = getToken();

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});


/* =========================================
   RESPONSE INTERCEPTOR
========================================= */

submissionApi.interceptors.response.use(
  (response) => response,

  (error) => {

    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {

      localStorage.removeItem("accessToken");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


/* =========================================
   SUBMISSION REQUEST
========================================= */

export interface SubmissionRequest {

  sourceCode: string;

  language: ProgrammingLanguage;

  type: SubmissionType;

  problemId: number;

  // Optional because normal
  // problem submissions don't
  // belong to a contest.
  contestId?: number;
}


/* =========================================
   SUBMIT SOLUTION
========================================= */

export async function submitSolution(
  request: SubmissionRequest
): Promise<Submission> {

  const response =
    await submissionApi.post(
      "/submissions",
      request
    );

  return response.data;
}


/* =========================================
   MY SUBMISSIONS
========================================= */

export async function getMySubmissions(): Promise<
  Submission[]
> {

  const response =
    await submissionApi.get(
      "/submissions/me"
    );

  return response.data;
}


/* =========================================
   SUBMISSION BY ID
========================================= */

export async function getSubmissionById(
  id: number
): Promise<Submission> {

  const response =
    await submissionApi.get(
      `/submissions/${id}`
    );

  return response.data;
}


/* =========================================
   SUBMISSION RESULT
========================================= */

export async function getSubmissionResult(
  id: number
): Promise<SubmissionResult> {

  const response =
    await submissionApi.get(
      `/submissions/${id}/result`
    );

  return response.data;
}


/* =========================================
   SUBMISSION TEST RESULTS
========================================= */

export async function getSubmissionTestResults(
  submissionId: number
): Promise<SubmissionTestResult[]> {

  const response =
    await submissionApi.get(
      `/submission-results/submission/${submissionId}`
    );

  return response.data;
}


/* =========================================
   SUBMISSIONS BY PROBLEM
========================================= */

export async function getSubmissionsByProblem(
  problemId: number
): Promise<Submission[]> {

  const response =
    await submissionApi.get(
      `/submissions/problem/${problemId}`
    );

  return response.data;
}