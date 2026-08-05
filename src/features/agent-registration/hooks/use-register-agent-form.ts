import { useDebounce } from "@/hooks/useDebounce";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  registerAgentSchema,
  type RegisterAgentFormValues,
} from "../schemas/agent-registration-schema";
import type {
  CheckAgencyCodeResponse,
  RegisterAgentRequest,
} from "../types/agent-registration.types";
import {
  useCheckAgencyCodeStatus,
  useGetCitiesByProvinceID,
  useGetInsuranceBranches,
  useGetProvinces,
  useRegisterAgent,
} from "./use-register-agent";

export const useRegisterAgentForm = () => {
  const [branchSearchQuery, setBranchSearchQuery] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const form = useForm<RegisterAgentFormValues>({
    resolver: zodResolver(registerAgentSchema),
    defaultValues: {
      address: "",
      agent_code: "",
      agency_type: "real", // "real"|"legal"
      city_code: "",
      county: "",
      insurance_branch: "",
      phone: "",
      province: "",
      name: "",
    },
  });

  const code = useWatch({
    control: form.control,
    name: "agent_code",
  });

  const cityId = useWatch({
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
  const debouncedBranchSearchQuery = useDebounce(branchSearchQuery.trim(), 700);

  const {
    data: branchDetails,
    isPending: branchesIsPending,
    isError: branchesIsError,
  } = useGetInsuranceBranches(debouncedBranchSearchQuery);

  const {
    data: provinces = [],
    isPending: provinceIsPending,
    isError: provinceIsError,
  } = useGetProvinces();

  const {
    data: cities = [],
    isFetching: citiesIsFetching,
    isError: citiesIsError,
  } = useGetCitiesByProvinceID(provinceId ? Number(provinceId) : 0);

  const {
    mutate: checkAgencyStatus,
    mutateAsync: checkAgencyStatusAsync,
    data: agencyStatus,
    isPending: agencyStatusIsPending,
    isError: agencyStatusIsError,
    error: agencyStatusError,
    reset: resetAgencyStatus,
  } = useCheckAgencyCodeStatus();

  const { mutateAsync: registerAgentFn, isPending: isSubmitting } =
    useRegisterAgent();

  useEffect(() => {
    if (!debouncedCode) {
      resetAgencyStatus();
      return;
    }

    checkAgencyStatus(debouncedCode);
  }, [debouncedCode, checkAgencyStatus, resetAgencyStatus]);

  useEffect(() => {
    form.setValue("county", "");
  }, [provinceId, form]);

  useEffect(() => {
    form.setValue("insurance_branch", "");
  }, [cityId, form]);

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
    value: String(branch.id),
    label: branch.name,
  }));

  const agencyStatusErrorData = isAxiosError<CheckAgencyCodeResponse>(
    agencyStatusError,
  )
    ? agencyStatusError.response?.data
    : undefined;
  const isAgencyCodeReserved =
    agencyStatus?.is_success === false ||
    agencyStatusErrorData?.is_success === false;

  const onSubmit: SubmitHandler<RegisterAgentFormValues> = async (values) => {
    const agencyCheck = await checkAgencyStatusAsync(values.agent_code);

    if (agencyCheck.is_success === false) {
      toast.error(`کد نمایندگی ${values.agent_code} قبلا ثبت شده است`);
      return;
    }

    const payload: RegisterAgentRequest = {
      ...values,
      first_name: "firstNameTest",
      last_name: "lastNameTest",
      phone_number: `${values.city_code}${values.phone}`,
      name: values.name || "nameTest",
    };

    await registerAgentFn(payload);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setBranchSearchQuery("");
    resetAgencyStatus();
    form.reset();
  };

  return {
    form,
    disableCity: !provinceId || provinceIsPending || citiesIsFetching,
    disableBranch: !cityId,
    isProvinceSelected: Boolean(provinceId),
    isCitySelected: Boolean(cityId),
    isSubmitting,
    isSuccessModalOpen,
    //--
    isLegalPerson: agencyType === "legal",
    //--
    citiesDetails: {
      citiesData,
      isPending: Boolean(provinceId) && citiesIsFetching,
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
      isError: agencyStatusIsError || agencyStatus?.is_success === false,
      isSuccess: agencyStatus?.is_success === true,
      statusTooltip: isAgencyCodeReserved
        ? "این کد نمایندگی قبلا ثبت شده"
        : undefined,
    },
    //--
    branchDetails: {
      branchOptions,
      isPending: branchesIsPending,
      isError: branchesIsError,
      setBranchSearchQuery,
    },
    onSubmit,
    closeSuccessModal,
  };
};
