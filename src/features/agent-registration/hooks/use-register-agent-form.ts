import { useDebounce } from "@/hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
  type Resolver,
  type SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import {
  registerAgentSchema,
  type RegisterAgentFormInputValues,
  type RegisterAgentFormValues,
} from "../schemas/agent-registration-schema";
import type { RegisterAgentRequest } from "../types/agent-registration.types";
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
  const isFirstCityChange = useRef(true);

  const form = useForm<
    RegisterAgentFormInputValues,
    unknown,
    RegisterAgentFormValues
  >({
    resolver: zodResolver(registerAgentSchema) as Resolver<
      RegisterAgentFormInputValues,
      unknown,
      RegisterAgentFormValues
    >,
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
    isFetching: citiesIsFetching,
    isError: citiesIsError,
  } = useGetCitiesByProvinceID(provinceId ? Number(provinceId) : 0);

  const {
    mutate: checkAgencyStatus,
    mutateAsync: checkAgencyStatusAsync,
    data: agencyStatus,
    isPending: agencyStatusIsPending,
    isError: agencyStatusIsError,
    reset: resetAgencyStatus,
  } = useCheckAgencyCodeStatus();

  const { mutateAsync: registerAgentFn, isPending: isSubmitting } =
    useRegisterAgent();
  console.log(isSubmitting);
  useEffect(() => {
    if (!debouncedCode) {
      resetAgencyStatus();
      return;
    }

    checkAgencyStatus(debouncedCode);
  }, [debouncedCode, checkAgencyStatus, resetAgencyStatus]);

  useEffect(() => {
    if (isFirstCityChange.current) {
      isFirstCityChange.current = false;
      return;
    }

    form.setValue("insurance_branch", -1);
  }, [ciryId, form]);

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

  const onSubmit: SubmitHandler<RegisterAgentFormValues> = async (values) => {
    console.log("values", values);

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
    disableBranch: !ciryId,
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
    closeSuccessModal,
  };
};
