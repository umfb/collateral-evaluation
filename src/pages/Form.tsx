import { useForm, useFieldArray } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { MdClose } from "react-icons/md";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "../components/schemas/FormSchema";
import { ToastContainer } from "react-toastify";
import NavBar from "../components/NavBar";
import FormHeader from "../components/FormHeader";
import MiniHeader from "../components/MiniHeader";
import { submit } from "../utils/submit";
import { ImageDataType } from "../models/ImageData.type";

export default function Form() {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Collateral: [
        {
          "Collateral Type": "",
          "Collateral Desc of item": "",
          "Collateral Liquidation Value": "",
          "Collateral Market Value": "",
          "Collateral Purchase Value": "",
          "Collateral Year of Purchase": "",
        },
      ],
      "Vehicle Mortgage": [
        {
          "Vehicle Mortgage Year": "",
          "Vehicle Mortgage Type": "",
          "Vehicle Mortgage Chasis No": "",
          "Vehicle Mortgage Color": "",
          "Vehicle Mortgage Engine No": "",
          "Vehicle Mortgage Liquidation Value": "",
          "Vehicle Mortgage Market Value": "",
          "Vehicle Mortgage Purchase Value": "",
          "Vehicle Mortgage Reg No": "",
        },
      ],
      "Land & Building Mortgage": [
        {
          "Land & Building Description": "",
          "Land & Building Force Sale Value": "",
          "Land & Building Market Value": "",
        },
      ],
    },
  });

  const {
    fields: collateralFields,
    append: addCollateral,
    remove: removeCollateral,
  } = useFieldArray({
    control,
    name: "Collateral",
  });

  const {
    fields: vmFields,
    append: addVm,
    remove: removeVm,
  } = useFieldArray({
    control,
    name: "Vehicle Mortgage",
  });
  const {
    fields: LBMGFields,
    append: addLBMG,
    remove: removeLBMG,
  } = useFieldArray({
    control,
    name: "Land & Building Mortgage",
  });

  const onSubmit = (data: Record<string, any>) => {
    if (signatureError) {
      console.error("Cannot submit form:", signatureError);
      return;
    }
    submit(
      data,
      signatureFile,
      reset,
      setIsLoading,
      setSignature,
      setSignaturePic
    );
  };

  function handleRemoveSignature(name: string) {
    setSignaturePic((prev) => ({
      ...prev,
      [name]: "",
    }));
    setSignature((prev) => ({
      ...prev,
      [name]: false,
    }));
  }

  function handleSignature(event: ChangeEvent<HTMLInputElement>) {
    setSignatureError("");
    if (!event.target.files) return;
    const name = event.target.name;
    const files = event.target.files;

    name.toLowerCase().includes("owner")
      ? setSignature((prev) => ({
          ...prev,
          owner: true,
        }))
      : setSignature((prev) => ({
          ...prev,
          witness: true,
        }));

    const fileUrl = URL.createObjectURL(files[0]);

    setSignaturePic((prev) => ({
      ...prev,
      [name.includes("Owner") ? "owner" : "witness"]: fileUrl,
    }));

    const promises = Array.from(files).map((file) => {
      return new Promise<ImageDataType>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            base64: reader.result?.toString().split(",")[1] || "",
            mimeType: file.type,
            name,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((images: ImageDataType[]) => {
        setSignatureFile((prev) => ({
          ...prev,
          [name.includes("Owner") ? "owner" : "witness"]: images,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleEnter = () => {
    setHover(true);
  };
  const handleLeave = () => {
    setHover(false);
  };

  const [hover, setHover] = useState(false);
  const [signature, setSignature] = useState({
    owner: false,
    witness: false,
  });
  const [signatureError, setSignatureError] = useState({});
  const [signatureFile, setSignatureFile] = useState<{
    owner: ImageDataType[];
    witness: ImageDataType[];
  }>({ owner: [], witness: [] });
  const [signaturePic, setSignaturePic] = useState<{
    owner: string;
    witness: string;
  }>({ owner: "", witness: "" });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="border mx-auto md:p-5 py-5 overflow-auto h-screen relative">
      <div className="fixed top-0 left-0 text-center h-[150px] bg-white z-10 w-full shadow-md">
        <NavBar />
      </div>
      <div className="h-fit py-10 lg:w-[70%] w-full mx-auto mt-[150px] border-1 border-[#800] md:px-8 px-2 rounded-lg">
        <FormHeader title="GUARANTOR ASSESSMENT" />
        <form
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.error("errors:", errors)
          )}
          className="flex flex-col gap-3 mx-auto md:px-3 mt-3 inter"
        >
          <div className="wrapper-custom">
            <label htmlFor="" className="font-bold">
              Collateral Owner
            </label>
            <select
              className="input-custom"
              {...register("Collateral Owner")}
              name="Collateral Owner"
              id=""
            >
              <option className="bg-gray-300" selected value="">
                Collateral Owner?
              </option>
              <option value="Applicant">Applicant</option>
              <option value="Guarantor">Guarantor</option>
            </select>
            {errors["Collateral Owner"] && (
              <p className="absolute -bottom-9 text-sm text-red-500">
                {errors["Collateral Owner"].message}
              </p>
            )}
          </div>
          {collateralFields.map((field, index) => (
            <div className="flex flex-col gap-2" key={field.id}>
              <MiniHeader title={`Collateral ${index + 1}`} />
              <div className="row mt-3">
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label className="font-bold" htmlFor="">
                    Type
                  </label>
                  <input
                    {...register(`Collateral.${index}.Collateral Type`)}
                    className="input-custom"
                    placeholder="Type"
                    type="text"
                  />
                  {errors.Collateral &&
                    errors.Collateral[index] &&
                    errors.Collateral[index]["Collateral Type"] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {errors.Collateral[index]["Collateral Type"]?.message}
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold w-full truncate">
                    Description of Item (Color, Make, Model, S/No)
                  </label>
                  <input
                    {...register(`Collateral.${index}.Collateral Desc of item`)}
                    type="text"
                    placeholder="Description"
                    className="input-custom"
                  />
                  {errors.Collateral &&
                    errors.Collateral[index] &&
                    errors.Collateral[index]["Collateral Desc of item"] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors.Collateral[index]["Collateral Desc of item"]
                            ?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Year of Purchase
                  </label>
                  <input
                    {...register(
                      `Collateral.${index}.Collateral Year of Purchase`
                    )}
                    type="text"
                    placeholder="Year of Purchase"
                    className="input-custom"
                  />
                  {errors.Collateral &&
                    errors.Collateral[index] &&
                    errors.Collateral[index]["Collateral Year of Purchase"] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors.Collateral[index][
                            "Collateral Year of Purchase"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
              </div>
              <div className="row mt-2">
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label className="font-bold" htmlFor="">
                    Purchase Value
                  </label>
                  <input
                    {...register(
                      `Collateral.${index}.Collateral Purchase Value`
                    )}
                    className="input-custom"
                    placeholder="Purchase Value"
                    type="text"
                  />
                  {errors.Collateral &&
                    errors.Collateral[index] &&
                    errors.Collateral[index]["Collateral Purchase Value"] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors.Collateral[index]["Collateral Purchase Value"]
                            ?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold w-full truncate">
                    Market Value
                  </label>
                  <input
                    {...register(`Collateral.${index}.Collateral Market Value`)}
                    type="text"
                    placeholder="Market Value"
                    className="input-custom"
                  />
                  {errors.Collateral &&
                    errors.Collateral[index] &&
                    errors.Collateral[index]["Collateral Market Value"] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors.Collateral[index]["Collateral Market Value"]
                            ?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Liquidation Value
                  </label>
                  <input
                    {...register(
                      `Collateral.${index}.Collateral Liquidation Value`
                    )}
                    type="text"
                    placeholder="Liquidation Value"
                    className="input-custom"
                  />
                  {errors.Collateral &&
                    errors.Collateral[index] &&
                    errors.Collateral[index][
                      "Collateral Liquidation Value"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors.Collateral[index][
                            "Collateral Liquidation Value"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeCollateral(index)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2 w-fit disabled:bg-red-300 disabled:cursor-not-allowed"
                disabled={index === 0}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                addCollateral({
                  "Collateral Type": "",
                  "Collateral Desc of item": "",
                  "Collateral Liquidation Value": "",
                  "Collateral Market Value": "",
                  "Collateral Purchase Value": "",
                  "Collateral Year of Purchase": "",
                })
              }
              className="bg-green-500 text-white px-2 py-1 rounded w-fit"
            >
              <span className="text-sm"> Add Collateral</span>
            </button>
          </div>
          <div className="mt-2">
            <MiniHeader title="INVENTORY" />
          </div>
          <div className="row mb-3">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="" className="font-bold">
                Market Value
              </label>
              <input
                {...register("Inventory Market Value")}
                type="text"
                placeholder="Market Value"
                className="input-custom"
              />
              {errors["Inventory Market Value"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["Inventory Market Value"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="" className="font-bold">
                Liquidation Value
              </label>
              <input
                {...register("Inventory Liquidation Value")}
                type="text"
                placeholder="Liquidation Value"
                className="input-custom"
              />
              {errors["Inventory Liquidation Value"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["Inventory Liquidation Value"].message}
                </p>
              )}
            </div>
          </div>
          {vmFields.map((field, index) => (
            <div className="flex flex-col gap-3" key={field.id}>
              <MiniHeader title={`Vehicle Mortgage ${index + 1}`} />
              <div className="row mt-3">
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Year
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Year`
                    )}
                    type="text"
                    placeholder="Year"
                    className="input-custom"
                  />
                  {errors["Vehicle Mortgage"] &&
                    errors["Vehicle Mortgage"][index] &&
                    errors["Vehicle Mortgage"][index][
                      "Vehicle Mortgage Year"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Vehicle Mortgage"][index][
                            "Vehicle Mortgage Year"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Color
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Color`
                    )}
                    type="text"
                    placeholder="Color"
                    className="input-custom"
                  />
                  {errors["Vehicle Mortgage"] &&
                    errors["Vehicle Mortgage"][index] &&
                    errors["Vehicle Mortgage"][index][
                      "Vehicle Mortgage Color"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Vehicle Mortgage"][index][
                            "Vehicle Mortgage Color"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Type
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Type`
                    )}
                    type="text"
                    placeholder="Type"
                    className="input-custom"
                  />
                  {errors["Vehicle Mortgage"] &&
                    errors["Vehicle Mortgage"][index] &&
                    errors["Vehicle Mortgage"][index][
                      "Vehicle Mortgage Type"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Vehicle Mortgage"][index][
                            "Vehicle Mortgage Type"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
              </div>
              <div className="row">
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Registration Number
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Reg No`
                    )}
                    type="text"
                    placeholder="Registration Number"
                    className="input-custom"
                  />
                  {errors["Vehicle Mortgage"] &&
                    errors["Vehicle Mortgage"][index] &&
                    errors["Vehicle Mortgage"][index][
                      "Vehicle Mortgage Reg No"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Vehicle Mortgage"][index][
                            "Vehicle Mortgage Reg No"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Engine Number
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Engine No`
                    )}
                    type="text"
                    placeholder="Engine Number"
                    className="input-custom"
                  />
                  {errors["Vehicle Mortgage"] &&
                    errors["Vehicle Mortgage"][index] &&
                    errors["Vehicle Mortgage"][index][
                      "Vehicle Mortgage Engine No"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Vehicle Mortgage"][index][
                            "Vehicle Mortgage Engine No"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Chasis Number
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Chasis No`
                    )}
                    type="text"
                    placeholder="Chasis Number"
                    className="input-custom"
                  />
                  {errors["Vehicle Mortgage"] &&
                    errors["Vehicle Mortgage"][index] &&
                    errors["Vehicle Mortgage"][index][
                      "Vehicle Mortgage Chasis No"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Vehicle Mortgage"][index][
                            "Vehicle Mortgage Chasis No"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
              </div>
              <div className="row">
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Purchase Value
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Purchase Value`
                    )}
                    type="text"
                    placeholder="Purchase Value"
                    className="input-custom"
                  />
                  {errors["Vehicle Mortgage"] &&
                    errors["Vehicle Mortgage"][index] &&
                    errors["Vehicle Mortgage"][index][
                      "Vehicle Mortgage Purchase Value"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Vehicle Mortgage"][index][
                            "Vehicle Mortgage Purchase Value"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Market Value
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Market Value`
                    )}
                    type="text"
                    placeholder="Market Value"
                    className="input-custom"
                  />
                  {errors["Vehicle Mortgage"] &&
                    errors["Vehicle Mortgage"][index] &&
                    errors["Vehicle Mortgage"][index][
                      "Vehicle Mortgage Market Value"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Vehicle Mortgage"][index][
                            "Vehicle Mortgage Market Value"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Liquidation Value
                  </label>
                  <input
                    {...register(
                      `Vehicle Mortgage.${index}.Vehicle Mortgage Liquidation Value`
                    )}
                    type="text"
                    placeholder="Liquidation Value"
                    className="input-custom"
                  />
                  {errors["Vehicle Mortgage"] &&
                    errors["Vehicle Mortgage"][index] &&
                    errors["Vehicle Mortgage"][index][
                      "Vehicle Mortgage Liquidation Value"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Vehicle Mortgage"][index][
                            "Vehicle Mortgage Liquidation Value"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeVm(index)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2 w-fit disabled:bg-red-300 disabled:cursor-not-allowed"
                disabled={index === 0}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-green-500 py-1 px-2 rounded"
              onClick={() =>
                addVm({
                  "Vehicle Mortgage Year": "",
                  "Vehicle Mortgage Type": "",
                  "Vehicle Mortgage Chasis No": "",
                  "Vehicle Mortgage Color": "",
                  "Vehicle Mortgage Engine No": "",
                  "Vehicle Mortgage Liquidation Value": "",
                  "Vehicle Mortgage Market Value": "",
                  "Vehicle Mortgage Purchase Value": "",
                  "Vehicle Mortgage Reg No": "",
                })
              }
            >
              <span className="text-sm text-white">Add Vehicle Mortgage</span>
            </button>
          </div>
          {LBMGFields.map((field, index) => (
            <div className="flex flex-col gap-3" key={field.id}>
              <MiniHeader title={`Land & Building Mortgage ${index + 1}`} />
              <div className="row mt-3">
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Description
                  </label>
                  <input
                    {...register(
                      `Land & Building Mortgage.${index}.Land & Building Description`
                    )}
                    type="text"
                    placeholder="Description"
                    className="input-custom"
                  />
                  {errors["Land & Building Mortgage"] &&
                    errors["Land & Building Mortgage"][index] &&
                    errors["Land & Building Mortgage"][index][
                      "Land & Building Description"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Land & Building Mortgage"][index][
                            "Land & Building Description"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Force Sale Value
                  </label>
                  <input
                    {...register(
                      `Land & Building Mortgage.${index}.Land & Building Force Sale Value`
                    )}
                    type="text"
                    placeholder="Force Sale Value"
                    className="input-custom"
                  />
                  {errors["Land & Building Mortgage"] &&
                    errors["Land & Building Mortgage"][index] &&
                    errors["Land & Building Mortgage"][index][
                      "Land & Building Force Sale Value"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Land & Building Mortgage"][index][
                            "Land & Building Force Sale Value"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
                <div className="wrapper-custom col-12 col-lg-4 relative">
                  <label htmlFor="" className="font-bold">
                    Market Value
                  </label>
                  <input
                    {...register(
                      `Land & Building Mortgage.${index}.Land & Building Market Value`
                    )}
                    type="text"
                    placeholder="Market Value"
                    className="input-custom"
                  />
                  {errors["Land & Building Mortgage"] &&
                    errors["Land & Building Mortgage"][index] &&
                    errors["Land & Building Mortgage"][index][
                      "Land & Building Market Value"
                    ] && (
                      <p className="text-red-500 text-sm absolute -bottom-9">
                        {
                          errors["Land & Building Mortgage"][index][
                            "Land & Building Market Value"
                          ]?.message
                        }
                      </p>
                    )}
                </div>
              </div>
              <button
                type="button"
                className="bg-red-500 disabled:bg-red-300 disabled:cursor-not-allowed text-sm text-white rounded px-2 py-1 w-fit mt-2"
                disabled={index === 0}
                onClick={() => removeLBMG(index)}
              >
                <span className="text-sm">Remove</span>
              </button>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                addLBMG({
                  "Land & Building Description": "",
                  "Land & Building Force Sale Value": "",
                  "Land & Building Market Value": "",
                })
              }
              className="bg-green-500 px-2 py-1 rounded"
            >
              <span className="text-sm text-white">Add LBMG</span>
            </button>
          </div>
          <MiniHeader title="COLLATERAL CLASSIFICATION SUMMARY" />
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Household Goods
              </label>
              <input
                {...register("HG")}
                type="text"
                placeholder="Household Goods"
                className="input-custom"
              />
              {errors["HG"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["HG"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Business Asset
              </label>
              <input
                {...register("BA")}
                type="text"
                placeholder="Business Asset"
                className="input-custom"
              />
              {errors["BA"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["BA"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Inventory
              </label>
              <input
                {...register("INV")}
                type="text"
                placeholder="Inventory"
                className="input-custom"
              />
              {errors["INV"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["INV"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Vehicle Mortgage
              </label>
              <input
                {...register("VMG")}
                type="text"
                placeholder="Vehicle Mortgage"
                className="input-custom"
              />
              {errors["VMG"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["VMG"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Land & Building Mortgage
              </label>
              <input
                {...register("LBMG")}
                type="text"
                placeholder="Land & Building Mortgage"
                className="input-custom"
              />
              {errors["LBMG"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["LBMG"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="" className="font-bold">
                Others
              </label>
              <input
                {...register("Others")}
                type="text"
                placeholder="Others"
                className="input-custom"
              />
              {errors["Others"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["Others"].message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <MiniHeader title="Collateral Owner" />
          </div>
          <div className="wrapper-custom">
            {!signature.owner ? (
              <label
                className="lg:w-[30%] w-[250px] h-60 border-dashed border-2 border-gray-700 d-flex text-center justify-center items-center hover:bg-slate-100 cursor-pointer shadow-md"
                htmlFor="signature"
              >
                <span>Signature</span>
              </label>
            ) : (
              <div
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                className="relative lg:w-[30%] w-[250px] h-60 bg-gray-200 shadow-md"
              >
                {hover && (
                  <button
                    name="owner"
                    onClick={() => handleRemoveSignature("owner")}
                    type="button"
                    className="text-white absolute top-2 bg-red-600 right-2 rounded-full"
                  >
                    <MdClose name="owner" size="24" className="text-white" />
                  </button>
                )}
                <img
                  className="object-cover h-60"
                  width="100%"
                  src={signaturePic.owner}
                  alt="Owner Signature"
                />
              </div>
            )}

            <input
              className="hidden"
              type="file"
              name="Owner Signature"
              id="signature"
              accept="image/*"
              onChange={(e) => handleSignature(e)}
            />
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="" className="font-bold">
                Name
              </label>
              <input
                {...register("Collateral Owner Name")}
                type="text"
                placeholder="Name"
                className="input-custom"
              />
              {errors["Collateral Owner Name"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["Collateral Owner Name"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="" className="font-bold">
                Date
              </label>
              <input
                {...register("Collateral Owner Signature Date")}
                type="date"
                className="input-custom"
              />
              {errors["Collateral Owner Signature Date"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["Collateral Owner Signature Date"].message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <MiniHeader title="Witness" />
          </div>
          <div className="wrapper-custom">
            {!signature.witness ? (
              <label
                className="lg:w-[30%] w-[250px] h-60 border-dashed border-2 border-gray-700 d-flex text-center justify-center items-center hover:bg-slate-100 cursor-pointer shadow-md"
                htmlFor="signature-witness"
              >
                <span>Signature</span>
              </label>
            ) : (
              <div
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                className="relative lg:w-[30%] w-[250px] h-60 bg-gray-200 shadow-md"
              >
                {hover && (
                  <button
                    onClick={() => handleRemoveSignature("witness")}
                    type="button"
                    className="text-white absolute top-2 bg-red-600 right-2 rounded-full"
                  >
                    <MdClose size="24" className="text-white" />
                  </button>
                )}
                <img
                  className="object-cover h-60"
                  width="100%"
                  src={signaturePic.witness}
                  alt="Witness Signature"
                />
              </div>
            )}

            <input
              className="hidden"
              type="file"
              name="Witness Signature"
              id="signature-witness"
              accept="image/*"
              onChange={(e) => handleSignature(e)}
            />
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="" className="font-bold">
                Name
              </label>
              <input
                {...register("Witness Name")}
                type="text"
                placeholder="Name"
                className="input-custom"
              />
              {errors["Witness Name"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["Witness Name"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="" className="font-bold">
                Date
              </label>
              <input
                {...register("Witness Signature Date")}
                type="date"
                className="input-custom"
              />
              {errors["Witness Signature Date"] && (
                <p className="absolute -bottom-9 text-sm text-red-500">
                  {errors["Witness Signature Date"].message}
                </p>
              )}
            </div>
          </div>
          <div className="rounded-full w-full bg-[#800] mt-3">
            <button
              disabled={isLoading}
              type="submit"
              className="bg-[#800] text-white py-[13px] rounded-pill w-full disabled:bg-[#db8686] hover:bg-[#700] text-center flex items-center justify-center"
            >
              {isLoading ? (
                <div className="h-7 w-7 border-2 border-t-transparent border-[#7b3434] rounded-full animate-spin"></div>
              ) : (
                <span className="text-xl rounded-full">Submit</span>
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
