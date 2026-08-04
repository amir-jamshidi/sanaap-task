import { useDebounce } from "@/hooks/useDebounce";
import {
  useCheckAgencyCodeStatus,
  useGetCitiesByProvinceID,
  useGetInsuranceBranches,
  useGetProvinces,
} from "./use-register-agent";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerAgentSchema,
  type RegisterAgentFormValues,
} from "../schemas/agent-registration-schema";

export const useRegisterAgentForm = () => {
  const [branchSearchQuery, setBranchSearchQuery] = useState("");

  const form = useForm<RegisterAgentFormValues>({
    resolver: zodResolver(registerAgentSchema),
    defaultValues: {
      address: "",
      agent_code: "",
      agency_type: "real", // "real"|"legal"
      city_code: "",
      county: "",
      first_name: "",
      insurance_branch: "",
      lastname: "",
      phone: "",
      province: "",
      name: "",
    },
  });

  console.log(form.formState.errors)

  const code = useWatch({
    control: form.control,
    name: "agent_code",
  });

  const ciryId = useWatch({
    control: form.control,
    name: "county",
  });

  const agencyType = useWatch({
    control: form.control,
    name: "agency_type",
  });

  const provinceId = useWatch({
    control: form.control,
    name: "province",
  });

  const debouncedCode = useDebounce(code.trim(), 700);
  const debouncedBrachSearchQuery = useDebounce(branchSearchQuery.trim(), 700);

  const {
    data: branchDetails,
    isPending: branchesIsPending,
    isError: branchesIsError,
  } = useGetInsuranceBranches(debouncedBrachSearchQuery);

  const {
    data: provinces = [],
    isPending: provinceIsPending,
    isError: provinceIsError,
  } = useGetProvinces();

  const {
    data: cities = [],
    isPending: citiesIsPending,
    isError: citiesIsError,
  } = useGetCitiesByProvinceID(provinceId ? Number(provinceId) : 0);

  const {
    mutate: checkAgencyStatus,
    data: agencyStatus,
    isPending: agencyStatusIsPending,
    isError: agencyStatusIsError,
    reset: resetAgencyStatus,
  } = useCheckAgencyCodeStatus();

  useEffect(() => {
    if (!debouncedCode) {
      resetAgencyStatus();
      return;
    }

    checkAgencyStatus(debouncedCode);
  }, [debouncedCode, checkAgencyStatus, resetAgencyStatus]);

  const provinceData =
    provinces?.map((province) => ({
      value: String(province.id),
      label: province.name,
    })) ?? [];

  const citiesData =
    cities?.map((province) => ({
      value: String(province.id),
      label: province.name,
    })) ?? [];

  const branchOptions = branchDetails?.response.map((branch) => ({
    value: branch.id,
    label: branch.name,
  }));

  return {
    provinceData,
    provinceIsPending,
    provinceIsError,

    citiesData,
    citiesIsPending,
    citiesIsError,

    form,
    disableCity: !provinceId || provinceIsPending || citiesIsPending,
    disableBranch: !ciryId,

    isLegalPerson: agencyType === "legal",

    checkAgencyDetails: {
      isPending: agencyStatusIsPending,
      isError: agencyStatusIsError,
      isSuccess: agencyStatus?.is_success,
    },

    branchDetails: {
      branchOptions,
      isPending: branchesIsPending,
      isError: branchesIsError,
      setBranchSearchQuery,
    },
  };
};
