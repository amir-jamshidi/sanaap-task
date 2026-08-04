import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { Controller } from "react-hook-form";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRegisterAgentForm } from "../hooks/use-register-agent-form";
import RegistrationSuccess from "./registration-success";

type BranchOption = {
  label: string;
  value: number;
};

function BranchVirtualizedList({ options }: { options: BranchOption[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    getItemKey: (index) => options[index]?.value ?? index,
    estimateSize: () => 32,
    overscan: 8,
  });

  if (options.length === 0) {
    return (
      <>
        <ComboboxEmpty>شعبه‌ای پیدا نشد</ComboboxEmpty>
        <ComboboxList />
      </>
    );
  }

  return (
    <ComboboxList ref={parentRef} className="relative">
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const option = options[virtualItem.index];

          return (
            <div
              key={option.value}
              className="absolute left-0 top-0 w-full"
              style={{
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ComboboxItem index={virtualItem.index} value={option}>
                {option.label}
              </ComboboxItem>
            </div>
          );
        })}
      </div>
    </ComboboxList>
  );
}

const RegisterAgentForm = () => {
  const {
    form,
    checkAgencyDetails,
    branchDetails,
    isLegalPerson,
    disableBranch,
    disableCity,
    isSubmitting,
    isSuccessModalOpen,
    provinceDetails,
    citiesDetails,
    onSubmit,
    closeSuccessModal,
  } = useRegisterAgentForm();

  return (
    <div>
      <div className="flex justify-center items-center">
        <p className="text-white font-semibold text-2xl">بیـــــــــــمه دی</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-5 bg-white mx-8 px-6 mt-4 py-8 shadow-lg rounded-xl">
          <Input
            {...form.register("agent_code")}
            type="number"
            isLoading={checkAgencyDetails.isPending}
            isError={checkAgencyDetails.isError}
            isSuccess={checkAgencyDetails.isSuccess}
            placeholder="کد نمایندگی"
            disabled={checkAgencyDetails.isPending || isSubmitting}
            error={form.formState.errors.agent_code?.message}
          />

          <Controller
            control={form.control}
            name="province"
            render={({ field }) => (
              <Select
                disabled={isSubmitting}
                items={provinceDetails.provinceData}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  isLoading={provinceDetails.isPending}
                  error={form.formState.errors.province?.message}
                >
                  <SelectValue placeholder="استان" />
                </SelectTrigger>

                <SelectContent side="bottom">
                  <SelectGroup>
                    {provinceDetails.provinceData.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            control={form.control}
            name="county"
            render={({ field }) => (
              <Select
                disabled={disableCity || isSubmitting}
                items={citiesDetails.citiesData}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  isLoading={citiesDetails.isPending}
                  error={form.formState.errors.county?.message}
                >
                  <SelectValue placeholder="شهر" />
                </SelectTrigger>

                <SelectContent side="bottom">
                  <SelectGroup>
                    {citiesDetails.citiesData.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Textarea
            {...form.register("address")}
            disabled={isSubmitting}
            error={form.formState.errors.address?.message}
            legend="آدرس"
          />
          <Controller
            control={form.control}
            name="insurance_branch"
            render={({ field }) => {
              const branchOptions = branchDetails.branchOptions ?? [];
              const selectedBranch =
                branchOptions.find(
                  (option) => String(option.value) === String(field.value),
                ) ?? null;

              return (
                <Combobox
                  disabled={disableBranch || isSubmitting}
                  virtualized
                  items={branchOptions}
                  value={selectedBranch}
                  filter={null}
                  highlightItemOnHover={false}
                  onValueChange={(
                    option: { label: string; value: number } | null,
                  ) => {
                    field.onChange(option?.value ?? "");
                  }}
                  onInputValueChange={(search, { reason }) => {
                    if (reason === "item-press") return;

                    branchDetails.setBranchSearchQuery(search);
                  }}
                >
                  <ComboboxInput
                    isLoading={branchDetails.isPending}
                    disabled={
                      disableBranch || branchDetails.isPending || isSubmitting
                    }
                    error={form.formState.errors.insurance_branch?.message}
                    placeholder="جستجو و انتخاب شعبه"
                    showTrigger
                    showClear
                  />

                  <ComboboxContent>
                    {branchDetails.isPending ? (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        در حال جستجو...
                      </div>
                    ) : branchDetails.isError ? (
                      <div className="px-3 py-2 text-sm text-red-500">
                        دریافت شعبه‌ها ناموفق بود
                      </div>
                    ) : (
                      <BranchVirtualizedList options={branchOptions} />
                    )}
                  </ComboboxContent>
                </Combobox>
              );
            }}
          />

          <div dir="ltr" className="flex gap-x-4 ">
            <Input
              error={form.formState.errors.city_code?.message}
              dir="ltr"
              type="number"
              {...form.register("city_code")}
              disabled={isSubmitting}
              className="flex-1"
              placeholder="پیش شماره"
              isLtrContent
            />
            <Input
              error={form.formState.errors.phone?.message}
              dir="ltr"
              type="number"
              {...form.register("phone")}
              disabled={isSubmitting}
              className="flex-3"
              placeholder="شماره ثابت"
              isLtrContent
            />
          </div>

          <div className="flex justify-between w-full">
            <p className="text-gray-400 text-sm">نوع نمایندگی :</p>
            <div>
              <Controller
                control={form.control}
                name="agency_type"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                    dir="rtl"
                    className="flex items-center gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="real" id="person-type-real" />

                      <Label
                        htmlFor="person-type-real"
                        className="cursor-pointer text-gray-700"
                      >
                        حقیقی
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="legal" id="person-type-legal" />

                      <Label
                        htmlFor="person-type-legal"
                        className="cursor-pointer text-gray-700"
                      >
                        حقوقی
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          </div>
          {isLegalPerson && (
            <Input
              {...form.register("name", {
                shouldUnregister: true,
              })}
              disabled={isSubmitting}
              error={form.formState.errors.name?.message}
              placeholder="نام نمایندگی"
            />
          )}
          <Button type="submit" disabled={isSubmitting}>
            ثبت نام
          </Button>
        </div>
      </form>
      <RegistrationSuccess
        open={isSuccessModalOpen}
        onClose={closeSuccessModal}
      />
    </div>
  );
};

export default RegisterAgentForm;
