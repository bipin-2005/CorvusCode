import api from "@/services/api";

export interface ProblemExample {
  id: number;
  input: string;
  output: string;
  explanation: string;
}

export const problemExampleService = {
  getExamples(problemId: number) {
    return api.get<ProblemExample[]>(
      `/problems/${problemId}/examples`
    );
  },

  createExample(
    problemId: number,
    data: {
      input: string;
      output: string;
      explanation: string;
    }
  ) {
    return api.post(
      `/problems/${problemId}/examples`,
      data
    );
  },

  updateExample(
    exampleId: number,
    data: {
      input: string;
      output: string;
      explanation: string;
    }
  ) {
    return api.put(
      `/problems/examples/${exampleId}`,
      data
    );
  },

  deleteExample(exampleId: number) {
    return api.delete(
      `/problems/examples/${exampleId}`
    );
  },
};