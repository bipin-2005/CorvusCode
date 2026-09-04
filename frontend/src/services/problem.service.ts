import api from "./api";

/* =========================================
   COMMON RESPONSE
========================================= */

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* =========================================
   PROBLEM TYPES
========================================= */

export interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  description: string;
  constraints: string | null;
  inputFormat: string | null;
  outputFormat: string | null;
  explanation: string | null;
  timeLimit: number;
  memoryLimit: number;
}

export interface CreateProblemRequest {
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  explanation: string;
  timeLimit: number;
  memoryLimit: number;
}

/* =========================================
   EXAMPLE TYPES
========================================= */

export interface ProblemExample {
  id: number;
  input: string;
  output: string;
  explanation: string | null;
}

export interface ProblemExampleRequest {
  input: string;
  output: string;
  explanation?: string;
}

/* =========================================
   STARTER CODE TYPES
========================================= */

export interface StarterCode {
  id: number;
  language: string;
  templateCode: string;
  problemId: number;
}

export interface StarterCodeRequest {
  language: string;
  templateCode: string;
  problemId: number;
}

/* =========================================
   TEST CASE TYPES
========================================= */

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  type: string;
  explanation?: string;
}

export interface TestCaseRequest {
  problemId: number;
  input: string;
  expectedOutput: string;
  type: string;
  explanation?: string;
}

/* =========================================
   PROBLEMS
========================================= */

export async function getAllProblems(): Promise<Problem[]> {
  const response =
    await api.get<ApiResponse<Problem[]>>(
      "/problems"
    );

  return response.data.data;
}

export async function getProblemBySlug(
  slug: string
): Promise<Problem> {

  const response =
    await api.get<ApiResponse<Problem>>(
      `/problems/${slug}`
    );

  return response.data.data;
}

export async function createProblem(data: any) {
  const response = await api.post(
    "/problems",
    data
  );

  return response.data.data;
}
export async function updateProblem(
  id: number,
  data: CreateProblemRequest
): Promise<Problem> {

  const response =
    await api.put<ApiResponse<Problem>>(
      `/problems/${id}`,
      data
    );

  return response.data.data;
}

export async function deleteProblem(
  id: number
): Promise<void> {

  await api.delete(
    `/problems/${id}`
  );
}

/* =========================================
   EXAMPLES
========================================= */

export async function getProblemExamples(
  problemId: number
): Promise<ProblemExample[]> {

  const response =
    await api.get<ProblemExample[]>(
      `/problems/${problemId}/examples`
    );

  return response.data;
}

export async function createExample(
  problemId: number,
  data: ProblemExampleRequest
) {

  const response =
    await api.post(
      `/problems/${problemId}/examples`,
      data
    );

  return response.data;
}

export async function updateExample(
  exampleId: number,
  data: ProblemExampleRequest
) {

  const response =
    await api.put(
      `/problems/examples/${exampleId}`,
      data
    );

  return response.data;
}

export async function deleteExample(
  exampleId: number
) {

  await api.delete(
    `/problems/examples/${exampleId}`
  );
}

/* =========================================
   STARTER CODES
========================================= */

export async function getStarterCodes(
  problemId: number
): Promise<StarterCode[]> {

  const response =
    await api.get<StarterCode[]>(
      `/problems/${problemId}/starter-codes`
    );

  return response.data;
}

export async function createStarterCode(
  data: StarterCodeRequest
) {

  const response =
    await api.post(
      "/starter-codes",
      data
    );

  return response.data;
}

export async function updateStarterCode(
  id: number,
  data: StarterCodeRequest
) {

  const response =
    await api.put(
      `/starter-codes/${id}`,
      data
    );

  return response.data;
}

export async function deleteStarterCode(
  id: number
) {

  await api.delete(
    `/starter-codes/${id}`
  );
}

/* =========================================
   TEST CASES
========================================= */

export async function getTestCases(
  problemId: number
): Promise<TestCase[]> {

  const response =
    await api.get<TestCase[]>(
      `/problems/${problemId}/test-cases/admin`
    );

  return response.data;
}

export async function createTestCase(
  data: TestCaseRequest
) {

  const response =
    await api.post(
      "/test-cases",
      data
    );

  return response.data;
}

export async function updateTestCase(
  id: number,
  data: TestCaseRequest
) {

  const response =
    await api.put(
      `/test-cases/${id}`,
      data
    );

  return response.data;
}

export async function deleteTestCase(
  id: number
) {

  await api.delete(
    `/test-cases/${id}`
  );
}
export const getProblemById = async (
  problemId: number
): Promise<Problem> => {
  const response = await api.get(
    `/problems/id/${problemId}`
  );

  return response.data.data;
};