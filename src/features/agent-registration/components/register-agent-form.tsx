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

const RegisterAgentForm = () => {
  const { provinceData, citiesData, form, checkAgencyDetails } =
    useRegisterAgentForm();

  return (
    <div>
      <div className="flex justify-center items-center">
        <p className="text-white font-semibold text-2xl">بیـــــــــــمه دی</p>
      </div>
      <div className="flex flex-col gap-y-10 bg-white mx-8 px-6 mt-4 py-8 shadow-lg rounded-xl">
        <Input
          {...form.register("code")}
          isLoading={checkAgencyDetails.isPending}
          isError={checkAgencyDetails.isError}
          isSuccess={checkAgencyDetails.isSuccess}
          placeholder="کد نمایندگی"
        />
        <Select items={provinceData}>
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
        <Select />
        <Select items={citiesData}>
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
        <Select />
        <Textarea legend="آدرس" />
        <Input placeholder="جستجو نمایندگی" />
        <div className="flex gap-x-4 ">
          <Input className="flex-3" placeholder="شماره ثابت" />
          <Input className="flex-1" placeholder="پیش شماره" />
        </div>

        <div className="flex justify-between w-full">
          <p className="text-gray-400 text-sm">نوع نمایندگی :</p>
          <div>
            <RadioGroup
              defaultValue="individual"
              dir="rtl"
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label
                  htmlFor="individual"
                  className="cursor-pointer text-gray-700"
                >
                  حقیقی
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="legal" id="legal" />
                <Label htmlFor="legal" className="cursor-pointer text-gray-700">
                  حقوقی
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <Input placeholder="نام نمایندگی" />
        <Button>ثبت نام</Button>
      </div>
    </div>
  );
};

export default RegisterAgentForm;
