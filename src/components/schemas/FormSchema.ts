import * as z from "zod";

export const FormSchema = z.object({
  // "Collateral Owner": z.string().trim().nonempty("This field is required"),
  Collateral: z.array(
    z.object({
      "Collateral Type": z.string().trim().nonempty("This field is required"),
      "Collateral Desc of item": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Collateral Year of Purchase": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Collateral Purchase Value": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Collateral Market Value": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Collateral Liquidation Value": z
        .string()
        .trim()
        .nonempty("This field is required"),
    })
  ),
  "Inventory Market Value": z
    .string()
    .trim()
    .nonempty("This field is required"),
  "Inventory Liquidation Value": z
    .string()
    .trim()
    .nonempty("This field is required"),
  "Vehicle Mortgage": z.array(
    z.object({
      "Vehicle Mortgage Year": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Vehicle Mortgage Color": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Vehicle Mortgage Type": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Vehicle Mortgage Reg No": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Vehicle Mortgage Engine No": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Vehicle Mortgage Chasis No": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Vehicle Mortgage Purchase Value": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Vehicle Mortgage Market Value": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Vehicle Mortgage Liquidation Value": z
        .string()
        .trim()
        .nonempty("This field is required"),
    })
  ),
  "Land & Building Mortgage": z.array(
    z.object({
      "Land & Building Market Value": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Land & Building Force Sale Value": z
        .string()
        .trim()
        .nonempty("This field is required"),
      "Land & Building Description": z
        .string()
        .trim()
        .nonempty("This field is required"),
    })
  ),
  HG: z.string().trim().nonempty("This field is required"),
  BA: z.string().trim().nonempty("This field is required"),
  INV: z.string().trim().nonempty("This field is required"),
  VMG: z.string().trim().nonempty("This field is required"),
  Sales: z.string().trim().nonempty("This field is required"),
  LBMG: z.string().trim().nonempty("This field is required"),
  Others: z.string().trim().nonempty("This field is required"),
  "Collateral Owner Name": z.string().trim().nonempty("This field is required"),
  "Collateral Owner Signature Date": z
    .string()
    .trim()
    .nonempty("This field is required"),
  "Witness Name": z.string().trim().nonempty("This field is required"),
  "Witness Signature Date": z
    .string()
    .trim()
    .nonempty("This field is required"),
});

export type FormValues = z.infer<typeof FormSchema>;
