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
import { Controller } from "react-hook-form";
import { useRegisterAgentForm } from "../hooks/use-register-agent-form";

const RegisterAgentForm = () => {
  const {
    form,
    checkAgencyDetails,
    branchDetails,
    isLegalPerson,
    disableBranch,
    disableCity,
    provinceDetails,
    citiesDetails,
    onSubmit,
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
            error={form.formState.errors.agent_code?.message}
          />

          <Controller
            control={form.control}
            name="province"
            render={({ field }) => (
              <Select
                items={provinceDetails.provinceData}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger error={form.formState.errors.province?.message}>
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
                disabled={disableCity}
                items={citiesDetails.citiesData}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger error={form.formState.errors.county?.message}>
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
            error={form.formState.errors.address?.message}
            legend="آدرس"
          />
          <Controller
            control={form.control}
            name="insurance_branch"
            render={({ field }) => {
              const selectedBranch =
                branchDetails.branchOptions?.find(
                  (option) => String(option.value) === String(field.value),
                ) ?? null;

              return (
                <Combobox
                  disabled={disableBranch}
                  virtualized
                  items={branchDetails.branchOptions}
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
                      <>
                        <ComboboxEmpty>شعبه‌ای پیدا نشد</ComboboxEmpty>

                        <ComboboxList>
                          {(option: { label: string; value: number }) => (
                            <ComboboxItem key={option.value} value={option}>
                              {option.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </>
                    )}
                  </ComboboxContent>
                </Combobox>
              );
            }}
          />

          <div className="flex gap-x-4 ">
            <Input
              error={form.formState.errors.phone?.message}
              dir="ltr"
              type="number"
              {...form.register("phone")}
              className="flex-3"
              placeholder="شماره ثابت"
              isLtrContent
            />
            <Input
              error={form.formState.errors.city_code?.message}
              dir="ltr"
              type="number"
              {...form.register("city_code")}
              className="flex-1"
              placeholder="پیش شماره"
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
              error={form.formState.errors.name?.message}
              placeholder="نام نمایندگی"
            />
          )}
          <Button type="submit">ثبت نام</Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterAgentForm;
