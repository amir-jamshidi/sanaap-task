import { httpClient } from "@/lib/axios";
import type {
  CheckAgencyCodeRequest,
  CheckAgencyCodeResponse,
  City,
  Province,
} from "../types/agent-registration.types";

export const getProvinces = () => {
  return httpClient.get<Province[]>("/base/provinces_wop/");
};

export const getCites = (provinceId: number) => {
  return httpClient.get<City[]>("/base/counties_wop/?province=35", {
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
