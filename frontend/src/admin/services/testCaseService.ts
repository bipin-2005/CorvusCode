import api from "@/services/api";

export type TestCaseType =
  | "SAMPLE"
  | "HIDDEN";

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  type: TestCaseType;
  explanation: string;
  problemId: number;
}

export interface TestCaseRequest {
  input: string;
  expectedOutput: string;
  type: TestCaseType;
  explanation: string;
  problemId: number;
}

export const testCaseService = {
  getByProblem(problemId: number) {
    return api.get<TestCase[]>(
      `/problems/${problemId}/test-cases/admin`
    );
  },

  create(data: TestCaseRequest) {
    return api.post(
      "/test-cases",
      data
    );
  },

  update(
    id: number,
    data: TestCaseRequest
  ) {
    return api.put(
      `/test-cases/${id}`,
      data
    );
  },

  delete(id: number) {
    return api.delete(
      `/test-cases/${id}`
    );
  },
};