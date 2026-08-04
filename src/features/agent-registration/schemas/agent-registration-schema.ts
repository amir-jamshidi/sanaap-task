import { z } from "zod";

export const registerAgentSchema = z
  .object({
    address: z.string().trim().min(1, "آدرس الزامی است"),
    agent_code: z.string().trim().min(1, "کد نمایندگی الزامی است"),
    agency_type: z.enum(["real", "legal"]),
    city_code: z.string().trim().min(1, "کد شهر الزامی است"),
    county: z.string().trim().min(1, "انتخاب شهرستان الزامی است"),
    insurance_branch: z.number().min(1, "انتخاب شعبه بیمه الزامی است"),
    phone: z.string().trim().min(1, "شماره موبایل الزامی است"),
    province: z.string().trim().min(1, "انتخاب استان الزامی است"),
    name: z.string().trim().min(1, "نام نمایندگی الزامی است"),
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
