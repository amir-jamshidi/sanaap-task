import { useDebounce } from "@/hooks/useDebounce";
import {
  useCheckAgencyCodeStatus,
  useGetCitiesByProvinceID,
  useGetProvinces,
} from "./use-register-agent";
import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";

export const useRegisterAgentForm = () => {
  const form = useForm({
    defaultValues: {
      code: "",
      provinceId: "",
    },
  });

  const code = useWatch({
    control: form.control,
    name: "code",
  });

  const provinceId = useWatch({
    control: form.control,
    name: "provinceId",
  });

  const debouncedCode = useDebounce(code.trim(), 700);

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

  return {
    provinceData,
    provinceIsPending,
    provinceIsError,

    citiesData,
    citiesIsPending,
    citiesIsError,

    form,

    checkAgencyDetails: {
      isPending: agencyStatusIsPending,
      isError: agencyStatusIsError,
      isSuccess: agencyStatus?.is_success,
    },
  };
};
