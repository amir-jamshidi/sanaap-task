import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRegisterAgentForm } from "../hooks/use-register-agent-form";
import { Controller } from "react-hook-form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const RegisterAgentForm = () => {
  const {
    provinceData,
    citiesData,
    form,
    checkAgencyDetails,
    branchDetails,
    isLegalPerson,
  } = useRegisterAgentForm();

  const submit = (values) => {
    console.log(values);
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <p className="text-white font-semibold text-2xl">بیـــــــــــمه دی</p>
      </div>
      <form onSubmit={form.handleSubmit(submit)}>
        <div className="flex flex-col gap-y-10 bg-white mx-8 px-6 mt-4 py-8 shadow-lg rounded-xl">
          <Input
            {...form.register("agent_code")}
            isLoading={checkAgencyDetails.isPending}
            isError={checkAgencyDetails.isError}
            isSuccess={checkAgencyDetails.isSuccess}
            placeholder="کد نمایندگی"
          />

          <Controller
            control={form.control}
            name="province"
            render={({ field }) => (
              <Select
                items={provinceData}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="استان" />
                </SelectTrigger>

                <SelectContent side="bottom">
                  <SelectGroup>
                    {provinceData.map((item) => (
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
                items={citiesData}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="شهر" />
                </SelectTrigger>

                <SelectContent side="bottom">
                  <SelectGroup>
                    {citiesData.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Textarea {...form.register("address")} legend="آدرس" />
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
              {...form.register("phone")}
              className="flex-3"
              placeholder="شماره ثابت"
            />
            <Input
              {...form.register("city_code")}
              className="flex-1"
              placeholder="پیش شماره"
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
