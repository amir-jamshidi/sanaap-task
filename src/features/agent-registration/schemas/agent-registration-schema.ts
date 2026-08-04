import { z } from "zod";

const requiredString = (message: string) =>
  z.preprocess(
    (value) => (value == null ? "" : String(value)),
    z.string().trim().min(1, message),
  );

const requiredDigitString = (
  requiredMessage: string,
  length: number,
  lengthMessage: string,
) =>
  z.preprocess(
    (value) => (value == null ? "" : String(value)),
    z
      .string()
      .trim()
      .min(1, requiredMessage)
      .regex(new RegExp(`^\\d{${length}}$`), lengthMessage),
  );

const requiredNumber = (message: string) =>
  z.preprocess((value) => {
    if (value == null || value === "") return -1;
    if (typeof value === "number") return Number.isFinite(value) ? value : -1;
    if (typeof value !== "string") return -1;

    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : -1;
  }, z.number().min(1, message));

export const registerAgentSchema = z
  .object({
    address: requiredString("آدرس الزامی است"),
    agent_code: requiredString("کد نمایندگی الزامی است"),
    agency_type: z.enum(["real", "legal"]),
    city_code: requiredDigitString(
      "کد شهر الزامی است",
      3,
      "کد شهر باید ۳ رقم باشد",
    ),
    county: requiredString("انتخاب شهرستان الزامی است"),
    insurance_branch: requiredNumber("انتخاب شعبه بیمه الزامی است"),
    phone: requiredDigitString(
      "شماره ثابت الزامی است",
      8,
      "شماره ثابت باید ۸ رقم باشد",
    ),
    province: requiredString("انتخاب استان الزامی است"),
    name: z.preprocess(
      (value) => (value == null ? "" : String(value)),
      z.string().trim(),
    ),
  })
  .refine(
    (values) => {
      if (values.agency_type === "legal") {
        return values.name.length > 0;
      }
      return true;
    },
    {
      path: ["name"],
      message: "نام شرکت الزامی است",
    },
  );

export type RegisterAgentFormValues = z.infer<typeof registerAgentSchema>;
export type RegisterAgentFormInputValues = Omit<
  RegisterAgentFormValues,
  "insurance_branch"
> & {
  insurance_branch: number | string | null;
};
