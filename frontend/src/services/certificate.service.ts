import api from "./api";

export interface CertificateResponse {
  id: number;
  certificateNumber: string;
  verificationCode: string;

  userId: number;
  contestId: number;

  participantName?: string;
  contestName?: string;

  type:
    | "FIRST_PLACE"
    | "SECOND_PLACE"
    | "THIRD_PLACE"
    | "PARTICIPATION";

  rank: number | null;

  issuedAt: string;

  certificateUrl: string | null;
}


/* =========================================================
   GET MY CERTIFICATE FOR A CONTEST
========================================================= */

export const getMyContestCertificate = async (
  contestId: number
): Promise<CertificateResponse> => {

  const response =
    await api.get(
      `/certificates/contest/${contestId}/my`
    );

  return response.data;
};


/* =========================================================
   DOWNLOAD CERTIFICATE PDF
========================================================= */

export const downloadCertificate = async (
  certificateId: number
): Promise<Blob> => {

  const response =
    await api.get(
      `/certificates/${certificateId}/download`,
      {
        responseType: "blob",
      }
    );

  return response.data;
};


/* =========================================================
   GET ALL MY CERTIFICATES
========================================================= */

export const getMyCertificates = async (): Promise<
  CertificateResponse[]
> => {

  const response =
    await api.get(
      "/certificates/my"
    );

  return response.data;
};