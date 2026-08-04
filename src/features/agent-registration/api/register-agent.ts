import { httpClient } from "@/lib/axios";
import type {
  CheckAgencyCodeRequest,
  CheckAgencyCodeResponse,
  City,
  InsuranceBranchResponse,
  Province,
  RegisterAgentRequest,
  RegisterAgentResponse,
} from "../types/agent-registration.types";

export const getProvinces = () => {
  return httpClient.get<Province[]>("/base/provinces_wop/");
};

export const getCities = (provinceId: number) => {
  return httpClient.get<City[]>("/base/counties_wop/", {
    params: {
      province: provinceId,
    },
  });
};

export const checkAgencyCodeStatus = (body: CheckAgencyCodeRequest) => {
  return httpClient.post<CheckAgencyCodeResponse, CheckAgencyCodeRequest>(
    "/api/v2/app/DEY/agent/verification/signup/check_agency_code/",
    body,
  );
};

export const getInsuranceBranches = (query?: string) => {
  return httpClient.get<InsuranceBranchResponse>(
    "/api/v2/app/selection_item/insurance_branch/wop_list/",
    {
      params: {
        name: query,
      },
    },
  );
};

export const registerAgent = (body: RegisterAgentRequest) => {
  return httpClient.post<RegisterAgentResponse, RegisterAgentRequest>(
    "/api/v2/app/DEY/agent/verification/signup/",
    body,
  );
};
