import { useMutation, useQuery } from "@tanstack/react-query";
import {
  checkAgencyCodeStatus,
  getCities,
  getInsuranceBranches,
  getProvinces,
  registerAgent,
} from "../api/register-agent";
import type { RegisterAgentRequest } from "../types/agent-registration.types";

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

export const useGetProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
    staleTime: ONE_DAY,
  });
};

export const useGetCitiesByProvinceID = (provinceId: number) => {
  return useQuery({
    queryKey: ["cities", provinceId],
    queryFn: () => getCities(provinceId),
    staleTime: ONE_HOUR,
    enabled: typeof provinceId === "number" && provinceId > 0,
  });
};

export const useCheckAgencyCodeStatus = () => {
  return useMutation({
    mutationKey: ["agent_status"],
    mutationFn: (agent_code: string) => checkAgencyCodeStatus({ agent_code }),
  });
};

export const useGetInsuranceBranches = (query?: string) => {
  return useQuery({
    queryKey: ["insurance_branches", query ? query : ""],
    queryFn: () => getInsuranceBranches(query),
    staleTime: ONE_HOUR,
  });
};

export const useRegisterAgent = () => {
  return useMutation({
    mutationKey: ["register_agent"],
    mutationFn: (registerDetails: RegisterAgentRequest) =>
      registerAgent(registerDetails),
  });
};
