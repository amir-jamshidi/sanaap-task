import { useDebounce } from "@/hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  registerAgentSchema,
  type RegisterAgentFormValues,
} from "../schemas/agent-registration-schema";
import {
  useCheckAgencyCodeStatus,
  useGetCitiesByProvinceID,
  useGetInsuranceBranches,
  useGetProvinces,
  useRegisterAgent,
} from "./use-register-agent";

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
      insurance_branch: -1,
      phone: "",
      province: "",
      name: "",
    },
  });

  console.log(form.formState.errors);

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

  const { mutateAsync: registerAgentFn, isPending } = useRegisterAgent();
  console.log(isPending);
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

  const onSubmit = (values) => {
    console.log("values", values);
    registerAgentFn(values);
  };

  return {
    form,
    disableCity: !provinceId || provinceIsPending || citiesIsPending,
    disableBranch: !ciryId,
    //--
    isLegalPerson: agencyType === "legal",
    //--
    citiesDetails: {
      citiesData,
      isPending: citiesIsPending,
      isError: citiesIsError,
    },
    //--
    provinceDetails: {
      provinceData,
      isPending: provinceIsPending,
      isError: provinceIsError,
    },
    //--
    checkAgencyDetails: {
      isPending: agencyStatusIsPending,
      isError: agencyStatusIsError,
      isSuccess: agencyStatus?.is_success,
    },
    //--
    branchDetails: {
      branchOptions,
      isPending: branchesIsPending,
      isError: branchesIsError,
      setBranchSearchQuery,
    },
    onSubmit,
  };
};
