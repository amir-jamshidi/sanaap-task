import { z } from "zod";

const requiredString = (message: string) =>
  z.string().trim().min(1, message);

const requiredDigitString = (
  requiredMessage: string,
  length: number,
  lengthMessage: string,
) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .regex(new RegExp(`^\\d{${length}}$`), lengthMessage);

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
    insurance_branch: requiredString("انتخاب شعبه بیمه الزامی است"),
    phone: requiredDigitString(
      "شماره ثابت الزامی است",
      8,
      "شماره ثابت باید ۸ رقم باشد",
    ),
    province: requiredString("انتخاب استان الزامی است"),
    name: z.string().trim(),
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
